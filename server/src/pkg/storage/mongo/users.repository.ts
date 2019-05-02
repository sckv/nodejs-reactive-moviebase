import {Db} from 'mongodb';
import {RegisterUserObject, SearchUsersObject, GetUserObject, ModifyUserObject} from 'types/users.repository';
import {UserRegisterError} from '@src/errors/domain-errors/user-register-error';
import {User} from 'types/User.model';
import {UserFull} from 'types/user-controlling.services';
import {UserNotFoundError} from '@src/errors/domain-errors/user-not-found';
import {FollowingOperationError} from '@src/errors/domain-errors/following';

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
        .find<T>(
          {
            username: new RegExp(username, 'gi'),
            active: true,
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
        .toArray();

      return users;
    },
    get: async ({
      userId,
      username,
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
    modify: async ({userId, ...userData}: ModifyUserObject): Promise<boolean> => {
      const updatedUser = await connection.collection<User>('users').updateOne(
        {_id: userId},
        {
          $set: {
            ...userData,
          },
          $currentDate: {
            lastModified: true,
          },
        },
      );
      if (!updatedUser.matchedCount || !updatedUser.modifiedCount)
        throw new UserNotFoundError({data: {userId, ...userData}});
      return;
    },
    follow: async ({userId, followId}: {userId: string; followId: string}) => {
      const followed = await connection.collection<User>('users').bulkWrite([
        {
          updateOne: {
            filter: {
              _id: userId,
            },
            update: {
              $addToSet: {
                follows: followId,
              },
            },
          },
        },
        {
          updateOne: {
            filter: {
              _id: followId,
            },
            update: {
              $addToSet: {
                followers: userId,
              },
            },
          },
        },
      ]);
      if (followed.matchedCount !== 2) throw new FollowingOperationError({data: {userId, followId}});
      return true;
    },
    unfollow: async ({userId, followId}: {userId: string; followId: string}) => {
      const followed = await connection.collection<User>('users').bulkWrite([
        {
          updateOne: {
            filter: {
              _id: userId,
            },
            update: {
              $pull: {
                follows: followId,
              },
            },
          },
        },
        {
          updateOne: {
            filter: {
              _id: followId,
            },
            update: {
              $pull: {
                followers: userId,
              },
            },
          },
        },
      ]);
      if (followed.matchedCount !== 2) throw new FollowingOperationError({data: {userId, followId}});
      return true;
    },
  };
};
