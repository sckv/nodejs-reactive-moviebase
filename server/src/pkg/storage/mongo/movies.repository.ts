import { ObjectID, ObjectId } from 'bson';
import { Db } from 'mongodb';
import { SearchMoviesObject, MovieCreateObject } from 'types/movies.repository';
import { LanguageType } from 'types/User.model';
import { Movie } from 'types/Movie.model';
import { MovieInsertError } from '@src/errors/domain-errors/movie-insert';
import { logger } from '@src/utils/logger';
// import {MovieNotFoundError} from '@src/errors/domain-errors/movie-not-found';
import { MovieRequest, MovieRequestThin } from 'types/movies-requesting.services';

const LIMIT_PAGINATION = 30;

export const MoviesRepository = (connection: Db) => {
  return {
    add: async (movieCreateObject: MovieCreateObject | MovieCreateObject[]): Promise<boolean> => {
      try {
        const insertable = Array.isArray(movieCreateObject) ? movieCreateObject : [movieCreateObject];
        const { insertedIds } = await connection
          .collection<Partial<Movie>>('movies')
          .insertMany(insertable, { ordered: false });

        const insertedArray = Object.keys(insertedIds).map(k => insertedIds[k]);

        await connection.collection<Partial<Movie>>('movies').updateMany(
          {
            _id: { $in: insertedArray },
          },
          {
            $currentDate: {
              lastModified: true,
              createdAt: { $type: 'date' },
            },
          },
        );

        return true;
      } catch (error) {
        logger.error('Error inserting movies: ', error);
        // console.log('Error inserting movies', error);
        throw new MovieInsertError({ data: { error } });
      }
    },
    search: async ({
      language = 'es',
      criteria,
      page = 0,
      pageSize = LIMIT_PAGINATION,
      sort,
    }: SearchMoviesObject): Promise<MovieRequestThin[]> => {
      const $sort: { [k: string]: any } = {};
      let aggregationPipeline: any[] = [];

      const $addFields: any = {
        plot: `$data.${language}.plot`,
        description: `$data.${language}.description`,
        averageRate: {
          $avg: '$ratedBy.rate',
        },
      };
      if (sort === 'hitsAsc' || sort === 'hitsDesc') {
        $sort.hits = sort === 'hitsAsc' ? -1 : 1;
      } else if (sort === 'latest' || sort === 'oldest') {
        $sort.createdAt = sort === 'latest' ? -1 : 1;
      } else if (sort === 'topRated' || sort === 'worstRated') {
        $sort.rate = sort === 'topRated' ? -1 : 1;
      } else if (criteria) {
        $sort.score = { $meta: 'textScore' };
        aggregationPipeline.push({ $match: { $text: { $search: criteria } } });
        $addFields.score = { $meta: 'textScore' };
      }
      aggregationPipeline = aggregationPipeline.concat(
        { $sort },
        { $skip: page > 0 ? (page - 1) * pageSize : 0 },
        { $limit: pageSize },
        { $addFields },
        {
          $project: {
            _id: 1,
            ttid: 1,
            title: 1,
            year: 1,
            poster: 1,
            averageRate: 1,
            plot: `$data.${language}.plot`,
          },
        },
      );

      const searchResult = await connection
        .collection<MovieRequestThin>('movies')
        .aggregate(aggregationPipeline)
        .toArray();

      return searchResult;
    },
    watchSearch: ({ language = 'es', criteria = '' }: { language?: LanguageType; criteria: string }) => {
      // TODO: refine the object, value to combine/filter it upstairs
      return connection.collection<Movie>('movies').watch([
        {
          $project: {
            _id: 1,
            operationType: 1,
            documentKey: 1,
            fullDocument: {
              _id: '$fullDocument._id',
              poster: '$fullDocument.poster',
              title: '$fullDocument.title',
              ttid: '$fullDocument.ttid',
              year: '$fullDocument.year',
              plot: `$fullDocument.data.${language}.plot`,
              description: `$fullDocument.data.${language}.description`,
            },
          },
        },
      ]);
    },
    get: async ({
      movieId,
      language = 'es',
      selfId,
    }: {
      movieId: ObjectID;
      language?: LanguageType;
      selfId?: ObjectId;
    }): Promise<MovieRequest> => {
      const aggregationPipeline: Array<{ [k: string]: any }> = [
        { $match: { _id: movieId } },
        {
          $addFields: {
            rate: {
              $filter: {
                input: '$ratedBy',
                as: 'rate',
                cond: { $eq: ['$$rate.userId', selfId] },
              },
            },
          },
        },
        {
          $project: {
            plot: '$data.en.plot',
            description: `$data.${language}.description`,
            poster: '$poster',
            ttid: '$ttid',
            title: '$title',
            year: '$year',
            comment: '$rate.comment',
            rate: '$rate.rate',
            ratedBy: {
              $filter: {
                input: '$ratedBy',
                as: 'rate',
                cond: { $ne: ['$$rate.userId', selfId] },
              },
            },
            averageRate: {
              $avg: '$ratedBy.rate',
            },
          },
        },
      ];
      const movie = await connection
        .collection<MovieRequest>('movies')
        .aggregate(aggregationPipeline)
        .next();

      if (!movie) return null;
      //  throw new MovieNotFoundError({data: {movieId, language}});
      connection.collection<Movie>('movies').updateOne({ _id: movie._id }, { $inc: { hits: 1 } });

      return movie;
    },
    getMovieWatch: ({
      movieId,
      language = 'es',
      selfId,
    }: {
      movieId: ObjectID;
      language: LanguageType;
      selfId?: ObjectId;
    }) => {
      return connection.collection('movies').watch([
        { $match: { 'fullDocument._id': movieId } },
        {
          $addFields: {
            rate: {
              $filter: {
                input: '$fullDocument.ratedBy',
                as: 'rate',
                cond: { $eq: ['$$rate.userId', selfId] },
              },
            },
          },
        },
        {
          $project: {
            plot: '$fullDocument.data.en.plot',
            description: `$fullDocument.data.${language}.description`,
            poster: '$fullDocument.poster',
            ttid: '$fullDocument.ttid',
            title: '$fullDocument.title',
            year: '$fullDocument.year',
            comment: '$fullDocument.rate.comment',
            rate: '$fullDocument.rate.rate',
            ratedBy: {
              $filter: {
                input: '$fullDocument.ratedBy',
                as: 'rate',
                cond: { $ne: ['$$rate.userId', selfId] },
              },
            },
            averageRate: {
              $avg: '$fullDocument.ratedBy.rate',
            },
          },
        },
      ]);
    },
    getByTtid: async ({
      ttid,
      fullMovie = false,
      language = 'es',
    }: {
      ttid: string;
      fullMovie?: boolean;
      language?: LanguageType;
    }): Promise<{ movieId: ObjectID } | MovieRequest | null> => {
      const aggregationPipeline: Array<{ [k: string]: any }> = [{ $match: { ttid } }];

      if (fullMovie)
        aggregationPipeline.push({
          $project: {
            plot: `$data.${language}.plot`,
            description: `$data.${language}.description`,
            poster: '$poster',
            ttid: '$ttid',
            title: '$title',
            year: '$year',
            comment: '$rate.comment',
            rate: '$rate.rate',
            averageRate: {
              $avg: '$ratedBy.rate',
            },
          },
        });
      else aggregationPipeline.push({ $project: { _id: 1 } });

      const movie = await connection
        .collection<MovieRequest>('movies')
        .aggregate(aggregationPipeline)
        .next();

      if (!movie) return null;
      //throw new MovieNotFoundError({data: {ttid}});
      connection.collection<Movie>('movies').updateOne({ _id: movie._id }, { $inc: { hits: 1 } });

      return fullMovie ? movie : { movieId: movie._id };
    },
  };
};
