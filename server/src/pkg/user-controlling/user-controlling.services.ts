import {UsersRepository} from '@src/pkg/storage/mongo/users.repository';
import {mongoConnection} from '@src/database';
import {RegistrationObject, UserThin, ModifyUserObjectService} from 'types/user-controlling.services';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import {InvalidEmailError} from '@src/errors/application-errors/invalid-email';
import {GetUserObject, ModifyUserObject} from 'types/users.repository';
import {Db} from 'mongodb';
import {createObjectId} from '@src/utils/create-objectid';

export const PASSWORD_HASHING_ROUNDS = 10;

export const UserControllingServices = async (db?: Db) => {
  const UsersRepo = UsersRepository(db || mongoConnection);
  return {
    register: async ({username, password, email}: RegistrationObject): Promise<boolean> => {
      if (!isEmail(String(email))) throw new InvalidEmailError({data: {email, username}});
      return UsersRepo.register({
        username,
        password: await bcrypt.hash(String(password).trim(), PASSWORD_HASHING_ROUNDS),
        email,
      });
    },
    search: (searchData: {username: string; page: number}): Promise<UserThin[]> => {
      return UsersRepo.search(searchData);
    },
    get: (criterias: GetUserObject) => {
      return UsersRepo.get(criterias);
    },
    modify: async ({password, language, userId}: ModifyUserObjectService) => {
      const objectToModify: ModifyUserObject = {
        language,
        userId: createObjectId(userId),
      };

      if (password) objectToModify.password = await bcrypt.hash(password, PASSWORD_HASHING_ROUNDS);
      return UsersRepo.modify({
        ...objectToModify,
      });
    },
    follow: async ({userId, followId}: {userId: string; followId: string}) => {
      return UsersRepo.follow({userId: createObjectId(userId), followId: createObjectId(followId)});
    },
    unfollow: async ({userId, followId}: {userId: string; followId: string}) => {
      return UsersRepo.unfollow({userId: createObjectId(userId), followId: createObjectId(followId)});
    },
  };
};
