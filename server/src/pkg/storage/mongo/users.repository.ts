import {Db} from 'mongodb';
import {RegisterUserObject, SearchUsersObject, GetUserObject, ModifyUserObject} from 'types/users.repository';
import {UserRegisterError} from '@src/errors/domain-errors/user-register-error';
import {User} from 'types/User.model';
import {UserFull} from 'types/user-controlling.services';

const USERS_PER_PAGE = 30;

export const UsersRepository = (connection: Db) => {
  return {
    register: async (registerData: RegisterUserObject): Promise<boolean> => {
      const registration = await connection.collection<Partial<User>>('users').insert({...registerData});
      if (!registration.insertedCount) throw new UserRegisterError({data: {registerData}});
      return true;
    },
    search: async <T>({username, page = 0}: SearchUsersObject): Promise<T[]> => {
      const users = await connection
        .collection<User>('users')
        .find<T[]>(
          {
            $and: [
              {
                $text: {
                  $search: username,
                },
              },
              {
                cast: {
                  $elemMatch: {$regex: new RegExp(`/${username}/`, 'gi')},
                },
              },
            ],
          },
          {
            projection: {
              _id: 1,
              username: 1,
            },
          },
        )
        .skip(page > 0 ? (page - 1) * USERS_PER_PAGE : 0)
        .limit(USERS_PER_PAGE)
        .next();

      return users;
    },
    get: async ({
      userId,
      selfId,
      personalData,
      followers,
      follows,
      listsData,
      moviesData,
    }: GetUserObject): Promise<Partial<UserFull>> => {
      const queryArray: Array<{[k: string]: any}> = [];
      const projectObject: {[k: string]: any} = {};

      //TODO: finish dynamic aggregation pipeline..
      queryArray.push({$match: {_id: userId}});
      queryArray.push({
        $graphLookup: {
          from: 'users',
          connectFromField: 'id',
          connectToField: 'follows',
          depthField: 'follows',
          as: 'followers',
          maxDepth: 0,
        },
      });
      queryArray.push({
        $graphLookup: {
          from: 'users',
          connectFromField: 'follows',
          connectToField: 'id',
          depthField: 'id',
          as: 'follows',
          maxDepth: 0,
        },
      });

      if (personalData && userId === selfId) {
        projectObject.email = 1;
        projectObject.languageType = 1;
      }

      if (follows) {
        projectObject.follows = {
          $project: {
            _id: '$follows.id',
            username: '$follows.username',
          },
        };
      }

      const getResult = connection.collection<User>('users').aggregate(queryArray);
      return;
    },
    // getByEmail: async <T>(email: string): Promise<T> => {
    //   return;
    // },
    modify: async (userData: ModifyUserObject): Promise<boolean> => {
      return;
    },
    follow: async ({userId, followId}: {userId: string; followId: string}) => {
      return;
    },
    unfollow: async ({userId, followId}: {userId: string; followId: string}) => {
      return;
    },
  };
};
