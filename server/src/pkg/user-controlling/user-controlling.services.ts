import {UsersRepository} from '@src/pkg/storage/mongo/users.repository';
import {mongoConnection} from '@src/database';
import {RegistrationObject, UserThin, UserFull} from 'types/user-controlling.services';
import bcrypt from 'bcrypt';
import isEmail from 'validator/lib/isEmail';
import {InvalidEmailError} from '@src/errors/application-errors/invalid-email';
import {GetUserObject, ModifyUserObject} from 'types/users.repository';

export const UserControllingServices = async () => {
  const UsersRepo = UsersRepository(mongoConnection);
  return {
    register: async ({username, password, email}: RegistrationObject): Promise<boolean> => {
      if (!isEmail(String(email))) throw new InvalidEmailError({data: {email, username}});
      return UsersRepo.register({
        username,
        password: await bcrypt.hash(String(password).trim(), 10),
        email,
      });
    },
    search: (searchData: {username: string; page: number}): Promise<UserThin[]> => {
      return UsersRepo.search(searchData);
    },
    get: (criterias: GetUserObject) => {
      return UsersRepo.get(criterias);
    },
    modify: async (userData: ModifyUserObject) => {
      return UsersRepo.modify({
        ...userData,
      });
    },
    follow: async (followsData: {userId: string; followId: string}) => {
      return UsersRepo.follow(followsData);
    },
    unfollow: async (followsData: {userId: string; followId: string}) => {
      return UsersRepo.follow(followsData);
    },
  };
};
