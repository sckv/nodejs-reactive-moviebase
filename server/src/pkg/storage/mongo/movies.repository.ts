import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {SearchMoviesObject} from 'types/movies.repository';

export const MoviesRepository = (connection: MongoClient) => {
  return {
    search: async <T>(criteria: SearchMoviesObject): Promise<T[]> => {},
    get: async <T>(movieId: ObjectID): Promise<T> => {},
    getByUserRate: async <T>(userId: ObjectID): Promise<T[]> => {},
  };
};
