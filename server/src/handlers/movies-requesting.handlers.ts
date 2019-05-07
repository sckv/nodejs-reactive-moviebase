import {CustomRequestHandler} from 'types/utils';
import {hashUrl} from '@src/utils';
import {CacheServices} from '@src/pkg/cache/cache.services';
import {RedisStreamingService} from '@src/services/redis-polling-service';
import {MoviesRequestingServices} from '@src/pkg/movies-requesting/movies-requesting.services';
import {Cache} from '@src/redis';
import {searchMovies, plotMovie, translateMovieText} from '@src/services/external-movies-service';
import {MovieRequestThin, MovieRequest} from 'types/movies-requesting.services';
import {MovieSearchResult} from 'types/external-movies';
import {mongoConnection} from '@src/database';

// if we have CRITERIA and SORTING we subscribe to changes
// otherwise we make a call to the API and get movies from IMDB
// we retrieve the movie and add it to db
export const searchMovie: CustomRequestHandler = async (req, res) => {
  const {l, s, c, p, ps} = req.query;

  console.log('MONGO CONNECTION??', mongoConnection);
  const hashedUrl = hashUrl(req.originalUrl);

  if (c && s) {
    function listenerFn(data: any) {
      res.write(data);
    }

    req.on('close', () => {
      res.send(200);
      RedisStreamingService.unsubscribeFrom(hashedUrl, listenerFn);
      throw new Error('User disconnected');
    });

    const redisSubscription = RedisStreamingService.subscribeTo(hashedUrl);

    const entryData = MoviesRequestingServices().search({
      criteria: c,
      language: l,
      page: p,
      pageSize: ps,
      sort: s,
    });
    res.write(entryData);

    redisSubscription.consume(hashedUrl, listenerFn);
    redisSubscription.force();

    const isSubscribingFromBD = await CacheServices.existsSubscription(hashedUrl);
    if (!isSubscribingFromBD) {
      const streamingChange = MoviesRequestingServices().watchSearch({
        criteria: c,
        language: l,
      });

      streamingChange.on('data', chunk => {
        Cache.publish('cache:digest', JSON.stringify({url: req.originalUrl, data: chunk}));
        res.write(chunk);
      });
    }
  } else {
    if (!c) return res.send(200);
    const imdbData = await searchMovies(c);
    if (!imdbData && !imdbData.length) return res.status(200).send([]);

    const firstMovie = imdbData[0];
    const getMovieIfExist = await MoviesRequestingServices().getByTtid({ttid: firstMovie.ttid});

    if (!getMovieIfExist) {
      await translateAndAddNewMovie(imdbData);

      const searchForAMovie = await MoviesRequestingServices().search({criteria: c});

      let results = [];
      if (imdbData.length > 20)
        results = imdbData.slice(0, 5).map<MovieRequestThin>(mo => ({
          ttid: mo.ttid,
          poster: mo.image.url,
          rate: 0,
          _id: null,
          title: mo.title,
          year: mo.year,
        }));
      else
        results = imdbData.map<MovieRequestThin>(mo => ({
          ttid: mo.ttid,
          poster: mo.image.url,
          rate: 0,
          _id: null,
          title: mo.title,
          year: mo.year,
        }));
      results = results.concat(searchForAMovie);

      return res.status(200).send(results);
    }
  }
};

export const getMovieById: CustomRequestHandler = async (req, res) => {
  const {movieId} = req.params;
  const hashedUrl = hashUrl(req.originalUrl);

  function listenerFn(data: any) {
    res.write(data);
  }

  req.on('close', () => {
    res.send(200);
    RedisStreamingService.unsubscribeFrom(hashedUrl, listenerFn);
    throw new Error('User disconnected');
  });

  const movieData = await MoviesRequestingServices().getById({
    movieId,
    language: req.auth ? req.auth.language : undefined,
    selfId: req.auth ? req.auth.userId : undefined,
  });
  res.write(movieData);

  const redisSubscription = RedisStreamingService.subscribeTo(hashedUrl);

  redisSubscription.consume(hashedUrl, listenerFn);
  redisSubscription.force();

  const isSubscribingFromBD = await CacheServices.existsSubscription(hashedUrl);
  if (!isSubscribingFromBD) {
    const streamingChange = MoviesRequestingServices().watchById({
      movieId,
      language: req.auth ? req.auth.language : undefined,
      selfId: req.auth ? req.auth.userId : undefined,
    });

    streamingChange.on('data', chunk => {
      Cache.publish('cache:digest', JSON.stringify({url: req.originalUrl, data: chunk}));
      res.write(chunk);
    });
  }
};

export const getMovieByTtid: CustomRequestHandler = async (req, res) => {
  const {ttid} = req.params;
  let movie = (await MoviesRequestingServices().getByTtid({ttid, fullMovie: true})) as MovieRequest;
  if (!movie._id) {
    const imdbData = await searchMovies(ttid);
    if (!imdbData && !imdbData.length) return res.status(200).send([]);
    await translateAndAddNewMovie(imdbData);
    movie = (await MoviesRequestingServices().getByTtid({ttid, fullMovie: true})) as MovieRequest;
  }
  return res.status(200).send(movie);
};

const translateAndAddNewMovie = async (imdbData: MovieSearchResult[]) => {
  const firstMovie = imdbData[0];
  const englishPlotData = await plotMovie(firstMovie.ttid);
  const spanishPlotTranslation = await translateMovieText(englishPlotData.Plot);

  await MoviesRequestingServices().addToDatabase({
    poster: firstMovie.image.url,
    title: firstMovie.title,
    ttid: firstMovie.ttid,
    year: firstMovie.year,
    data: {
      en: {
        description: englishPlotData.Actors,
        plot: englishPlotData.Plot,
      },
      es: {
        description: englishPlotData.Actors,
        plot: spanishPlotTranslation,
      },
    },
  });
};
