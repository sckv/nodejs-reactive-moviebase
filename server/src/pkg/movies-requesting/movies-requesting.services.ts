import {mongoConnection} from '@src/database';

import {Db, ObjectId, ChangeStream, ObjectID} from 'mongodb';
import {createObjectId} from '@src/utils/create-objectid';
import {MoviesRepository} from '@src/pkg/storage/mongo/movies.repository';
import {MongoObjectID} from 'types/utils';
import {MovieCreateObject, SearchMoviesObject} from 'types/movies.repository';
import {MovieRequestThin, MovieRequest} from 'types/movies-requesting.services';
import {LanguageType} from 'types/User.model';

// We let injectable mongoclientDB ONLY for testing purposes
export const MoviesRequestingServices = (mc?: Db) => {
  const MoviesRepo = MoviesRepository(mc || mongoConnection);
  return {
    addToDatabase: (movieCreateObject: MovieCreateObject | MovieCreateObject[]): Promise<boolean> => {
      return MoviesRepo.add(movieCreateObject);
    },
    search: (criteria: SearchMoviesObject): Promise<MovieRequestThin[]> => {
      return MoviesRepo.search(criteria);
    },
    watchSearch: (criteria: {language: LanguageType; criteria: string}): ChangeStream => {
      return MoviesRepo.watchSearch(criteria);
    },
    getById: ({
      movieId,
      language,
      selfId,
    }: {
      movieId: ObjectID | MongoObjectID;
      language?: LanguageType;
      selfId?: ObjectId;
    }): Promise<MovieRequest> => {
      return MoviesRepo.get({
        language,
        selfId: createObjectId(selfId),
        movieId: createObjectId(movieId),
      });
    },
    watchById: ({
      movieId,
      language,
      selfId,
    }: {
      movieId: ObjectID | MongoObjectID;
      language?: LanguageType;
      selfId?: ObjectId;
    }): ChangeStream => {
      return MoviesRepo.getMovieWatch({
        language,
        selfId: createObjectId(selfId),
        movieId: createObjectId(movieId),
      });
    },
    getByTtid: ({ttid}: {ttid: string}): Promise<MovieRequest | {movieId: ObjectID}> => {
      return MoviesRepo.getByTtid({ttid});
    },
  };
};
