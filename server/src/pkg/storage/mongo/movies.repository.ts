import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {SearchMoviesObject, LanguageType} from 'types/movies.repository';

export const MoviesRepository = (connection: MongoClient) => {
  return {
    search: async <T>({language = 'es', ...params}: SearchMoviesObject): Promise<T[]> => {},
    get: async <T>({movieId, language = 'es'}: {movieId: ObjectID; language: LanguageType}): Promise<T> => {},
    getByUserRate: async <T>(language: LanguageType = 'es'): Promise<T[]> => {},
  };
};
