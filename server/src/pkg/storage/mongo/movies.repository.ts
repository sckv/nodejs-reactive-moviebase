import {ObjectID} from 'bson';
import {Db} from 'mongodb';
import {SearchMoviesObject, MovieCreateObject} from 'types/movies.repository';
import {LanguageType} from 'types/User.model';
import {Movie} from 'types/Movie.model';
import {MovieInsertError} from '@src/errors/domain-errors/movie-insert';
import {logger} from '@src/utils/logger';
import {MovieNotFoundError} from '@src/errors/domain-errors/movie-not-found';

export const MoviesRepository = (connection: Db) => {
  return {
    add: async (movieCreateObject: MovieCreateObject | MovieCreateObject[]): Promise<boolean> => {
      try {
        const insertable = Array.isArray(movieCreateObject) ? movieCreateObject : [movieCreateObject];
        const {insertedIds} = await connection
          .collection<Partial<Movie>>('movies')
          .insertMany(insertable, {ordered: false});

        const insertedArray = Object.keys(insertedIds).map(k => insertedIds[k]);
        await connection.collection<Partial<Movie>>('movies').updateMany(
          {
            _id: {$or: insertedArray},
          },
          {
            $currentDate: {
              lastModified: true,
              createdAt: {$type: 'timestamp'},
            },
          },
        );

        return true;
      } catch (error) {
        logger.error('Error inserting movies', error);
        throw new MovieInsertError({data: {movieCreateObject}});
      }
    },
    search: async ({language = 'es', criteria, page, pageSize, sort}: SearchMoviesObject): Promise<Movie[]> => {
      const $sort: {[k: string]: any} = {};
      if (sort === 'hitsAsc' || sort === 'hitsDesc') {
        $sort.hits = sort === 'hitsAsc' ? 1 : 0;
      } else if (sort === 'latest' || sort === 'oldest') {
        $sort.createdAt = sort === 'latest' ? 1 : 0;
      } else if (sort === 'topRated' || sort === 'worstRated') {
        $sort.rate = sort === 'topRated' ? 0 : 1;
      }
      $sort.$text = {$search: criteria};

      const searchResult = await connection
        .collection<Movie>('movies')
        .find({$text: {$search: criteria}}, {projection: {score: {$meta: 'textScore'}, data: `$data.${language}`}})
        .sort(sorting)
        .skip(page > 0 ? (page - 1) * pageSize : 0)
        .limit(pageSize)
        .toArray();

      return searchResult;
    },
    watchSearch: ({language = 'es', criteria}: {language: LanguageType; criteria: string}) => {
      return connection
        .collection<Movie>('movies')
        .watch(
          [
            {$match: {$text: {$search: criteria}}},
            {$project: {score: {$meta: 'textScore'}, data: `$data.${language}`}},
          ],
          {fullDocument: 'updateLookup'},
        );
    },
    get: async ({movieId, language = 'es'}: {movieId: ObjectID | string; language: LanguageType}): Promise<Movie> => {
      const movie = await connection.collection<Movie>('movies').findOne(
        {_id: movieId},
        {
          projection: {
            data: `$data.${language}`,
          },
        },
      );
      if (!movie) throw new MovieNotFoundError({data: {movieId, language}});
      return movie;
    },
    getByUserRate: async <T>(language: LanguageType = 'es'): Promise<T[]> => {
      return;
    },
  };
};
