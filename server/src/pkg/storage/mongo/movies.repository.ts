import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {SearchMoviesObject, LanguageType, MovieCreateObject} from 'types/movies.repository';

export const MoviesRepository = (connection: MongoClient) => {
  return {
    add: async (movieCreateObject: MovieCreateObject): Promise<boolean> => {
      return;
    },
    search: async <T>({language = 'es', ...params}: SearchMoviesObject): Promise<T[]> => {
      return;
    },
    get: async <T>({movieId, language = 'es'}: {movieId: ObjectID; language: LanguageType}): Promise<T> => {
      return;
    },
    getByUserRate: async <T>(language: LanguageType = 'es'): Promise<T[]> => {
      return;
    },
  };
};
