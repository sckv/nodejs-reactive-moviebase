import {ObjectID} from 'bson';
import {Db} from 'mongodb';
import {SearchMoviesObject, MovieCreateObject} from 'types/movies.repository';
import {LanguageType} from 'types/User.model';

export const MoviesRepository = (connection: Db) => {
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
