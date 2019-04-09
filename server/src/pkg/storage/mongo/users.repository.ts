import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {RegisterUserObject, SearchUsersObject, GetUserObject, ModifyUserObject} from 'types/users.repository';

export const UsersRepository = (connection: MongoClient) => {
  return {
    register: async (registerData: RegisterUserObject): Promise<boolean> => {},
    search: async <T>({username = null}: SearchUsersObject): Promise<T[]> => {},
    get: async <T>(userId: GetUserObject): Promise<T> => {},
    modify: async (userId: ModifyUserObject): Promise<boolean> => {},
  };
};
