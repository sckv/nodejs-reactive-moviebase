import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {RegisterUserObject, SearchUsersObject, GetUserObject, ModifyUserObject} from 'types/users.repository';

export const UsersRepository = (connection: MongoClient) => {
  return {
    register: async (registerData: RegisterUserObject): Promise<boolean> => {
      return;
    },
    search: async <T>({username = null}: SearchUsersObject): Promise<T[]> => {
      return;
    },
    get: async <T>(userId: GetUserObject): Promise<T> => {
      return;
    },
    getByEmail: async <T>(email: string): Promise<T> => {
      return;
    },
    modify: async (userId: ModifyUserObject): Promise<boolean> => {
      return;
    },
    follow: async ({userId, followId}: {userId: ObjectID; followId: ObjectID}) => {
      return;
    },
    unfollow: async ({userId, followId}: {userId: ObjectID; followId: ObjectID}) => {
      return;
    },
  };
};
