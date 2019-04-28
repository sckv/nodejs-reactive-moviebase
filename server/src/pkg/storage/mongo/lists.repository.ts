import {Omit} from 'utility-types';
import {Db} from 'mongodb';
import {CreateListObject, AddMovieToListObject, RemoveMovieObject} from 'types/lists.repository';
import {MongoObjectID} from 'types/utils';

export const ListsRepository = (connection: Db) => {
  return {
    getByUser: async <T>(criteria: MongoObjectID | string): Promise<T[]> => {
      return;
    },
    get: async <T>(list: MongoObjectID): Promise<T> => {
      return;
    },
    create: async (listData: CreateListObject): Promise<boolean> => {
      return;
    },
    modify: async (listData: {listId: MongoObjectID} & Partial<Omit<CreateListObject, 'userId'>>): Promise<boolean> => {
      return;
    },
    delete: async (list: MongoObjectID): Promise<boolean> => {
      return;
    },
    addMovie: async (addData: AddMovieToListObject): Promise<boolean> => {
      return;
    },
    removeMovie: async (criteria: RemoveMovieObject): Promise<boolean> => {
      return;
    },
  };
};
