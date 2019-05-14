import { CustomRequestHandler } from 'types/utils';
import { hashUrl } from '@src/utils';
import { CacheServices } from '@src/pkg/cache/cache.services';
import { RedisStreamingService } from '@src/services/redis-polling-service';
import { MoviesRequestingServices } from '@src/pkg/movies-requesting/movies-requesting.services';
import { searchMovies, plotMovie, translateMovieText } from '@src/services/external-movies-service';
import { MovieRequestThin, MovieRequest } from 'types/movies-requesting.services';
import { MovieSearchResult } from 'types/external-movies';
import { convertToBuffer } from '@src/utils/convert-to-buffer';

// if we have CRITERIA and SORTING we subscribe to changes
// otherwise we make a call to the API and get movies from IMDB
// we retrieve the movie and add it to db
export const searchMovie: CustomRequestHandler = async (req, res) => {
  const { l = 'en', s, c, p, ps } = req.query;
  console.log('searching for a movie in imdb', c, s);

  const hashedUrl = hashUrl(req.originalUrl);

  res.setHeader('Content-Type', 'application/json');

  if ((c && s) || s) {
    res.setHeader('Transfer-Encoding', 'chunked');

    const entryData = await MoviesRequestingServices().search({
      criteria: c,
      language: l,
      page: p,
      pageSize: ps,
      sort: s,
    });
    res.write(convertToBuffer(entryData));

    const isSubscribingFromBD = await CacheServices.existsSubscription(hashedUrl);
    let announced;
    if (!isSubscribingFromBD) announced = await CacheServices.announceSubscription(hashedUrl);

    if (announced) {
      const streamingChange = MoviesRequestingServices().watchSearch({
        criteria: c,
        language: l,
      });
      streamingChange.on('change', async chunk => {
        if (chunk.operationType !== 'insert') return;
        await CacheServices.publishToDigest({ url: req.originalUrl, data: chunk.fullDocument });
        res.write(convertToBuffer(chunk.fullDocument));
      });

      req.on('close', async () => {
        await CacheServices.clearSubscription(hashedUrl);
        streamingChange.close();
      });
    } else {
      function listenerFn(data: any) {
        res.write(convertToBuffer(data));
      }

      req.on('close', async () => {
        RedisStreamingService.unsubscribeFrom(hashedUrl, listenerFn);
      });

      const redisSubscription = RedisStreamingService.subscribeTo(hashedUrl);
      redisSubscription.consume(hashedUrl, listenerFn);
    }
  } else {
    let results = [];

    if (c) {
      const imdbData = await searchMovies(c);

      if (!imdbData && !imdbData.length) return res.status(200).send([]);

      const firstMovie = imdbData[0];
      const getMovieIfExist = await MoviesRequestingServices().getByTtid({ ttid: firstMovie.ttid });

      if (!getMovieIfExist) {
        await translateAndAddNewMovie(imdbData);
      }

      if (imdbData.length > 20)
        results = imdbData.slice(0, 20).map<MovieRequestThin>(mo => ({
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

      return res.status(200).send(results);
    }
  }
};

export const getMovieById: CustomRequestHandler = async (req, res) => {
  const { movieId } = req.params;
  const hashedUrl = hashUrl(req.originalUrl);

  const movieData = await MoviesRequestingServices().getById({
    movieId,
    language: req.auth ? req.auth.language : undefined,
    selfId: req.auth ? req.auth.userId : undefined,
  });
  res.write(convertToBuffer(movieData));

  const isSubscribingFromBD = await CacheServices.existsSubscription(hashedUrl);
  let announced;

  if (!isSubscribingFromBD) announced = await CacheServices.announceSubscription(hashedUrl);

  if (announced) {
    const streamingChange = MoviesRequestingServices().watchById({
      movieId,
      language: req.auth ? req.auth.language : undefined,
      selfId: req.auth ? req.auth.userId : undefined,
    });

    streamingChange.on('data', async chunk => {
      await CacheServices.publishToDigest({ url: req.originalUrl, data: chunk.fullDocument });
      res.write(convertToBuffer(chunk.fullDocument));
    });

    req.on('close', async () => {
      await CacheServices.clearSubscription(hashedUrl);
      streamingChange.close();
    });
  } else {
    function listenerFn(data: any) {
      res.write(convertToBuffer(data));
    }

    req.on('close', () => {
      RedisStreamingService.unsubscribeFrom(hashedUrl, listenerFn);
    });

    const redisSubscription = RedisStreamingService.subscribeTo(hashedUrl);

    redisSubscription.consume(hashedUrl, listenerFn);
  }
};

export const getMovieByTtid: CustomRequestHandler = async (req, res) => {
  const { ttid } = req.params;
  let movie = (await MoviesRequestingServices().getByTtid({ ttid, fullMovie: true })) as MovieRequest;
  if (!movie) {
    const imdbData = await searchMovies(ttid);
    if (!imdbData && !imdbData.length) return res.status(200).send([]);
    await translateAndAddNewMovie(imdbData);
    movie = (await MoviesRequestingServices().getByTtid({ ttid, fullMovie: true })) as MovieRequest;
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
