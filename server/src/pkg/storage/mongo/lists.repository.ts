import {ObjectID} from 'bson';
import {Omit} from 'utility-types';
import {MongoClient} from 'mongodb';
import {CreateListObject, AddMovieToListObject, RemoveMovieObject} from 'types/lists.repository';

export const ListsRepository = (connection: MongoClient) => {
  return {
    getByUser: async <T>(criteria: ObjectID | string): Promise<T[]> => {
      return;
    },
    get: async <T>(list: ObjectID): Promise<T> => {
      return;
    },
    create: async (listData: CreateListObject): Promise<boolean> => {
      return;
    },
    modify: async (listData: {listId: ObjectID} & Partial<Omit<CreateListObject, 'userId'>>): Promise<boolean> => {
      return;
    },
    delete: async (list: ObjectID): Promise<boolean> => {
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
