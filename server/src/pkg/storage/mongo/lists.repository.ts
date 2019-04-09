import {ObjectID} from 'bson';
import {Omit} from 'utility-types';
import {MongoClient} from 'mongodb';
import {CreateListData, AddMovieToList, RemoveMovieData} from 'types/lists.repository';

export const ListsRepository = (connection: MongoClient) => {
  return {
    getByUser: async <T>(criteria: ObjectID | string): Promise<T[]> => {},
    get: async <T>(list: ObjectID): Promise<T> => {},
    create: async (listData: CreateListData): Promise<boolean> => {},
    modify: async (listData: {listId: ObjectID} & Partial<Omit<CreateListData, 'userId'>>): Promise<boolean> => {},
    delete: async (list: ObjectID): Promise<boolean> => {},
    addMovie: async (addData: AddMovieToList): Promise<boolean> => {},
    removeMovie: async (criteria: RemoveMovieData): Promise<boolean> => {},
  };
};
