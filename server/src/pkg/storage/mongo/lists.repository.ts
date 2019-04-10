import {ObjectID} from 'bson';
import {Omit} from 'utility-types';
import {MongoClient} from 'mongodb';
import {CreateListObject, AddMovieToListObject, RemoveMovieObject} from 'types/lists.repository';

export const ListsRepository = (connection: MongoClient) => {
  return {
    getByUser: async <T>(criteria: ObjectID | string): Promise<T[]> => {},
    get: async <T>(list: ObjectID): Promise<T> => {},
    create: async (listData: CreateListObject): Promise<boolean> => {},
    modify: async (listData: {listId: ObjectID} & Partial<Omit<CreateListObject, 'userId'>>): Promise<boolean> => {},
    delete: async (list: ObjectID): Promise<boolean> => {},
    addMovie: async (addData: AddMovieToListObject): Promise<boolean> => {},
    removeMovie: async (criteria: RemoveMovieObject): Promise<boolean> => {},
  };
};
