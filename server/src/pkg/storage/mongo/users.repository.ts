import { Db, ObjectId } from 'mongodb';
import { RegisterUserObject, SearchUsersObject, GetUserObject, ModifyUserObject } from 'types/users.repository';
import { UserRegisterError } from '@src/errors/domain-errors/user-register';
import { User } from 'types/User.model';
import { UserFull } from 'types/user-controlling.services';
import { UserNotFoundError } from '@src/errors/domain-errors/user-not-found';
import { FollowingOperationError } from '@src/errors/domain-errors/following';
import { UserModifyingError } from '@src/errors/domain-errors/user-modify';
import { logger } from '@src/utils/logger';

const USERS_PER_PAGE = 30;
const LIMIT_PAGINATION = 30;

export const UsersRepository = (connection: Db) => {
  return {
    register: async (registerData: RegisterUserObject): Promise<{ userId: ObjectId }> => {
      try {
        const registration = await connection
          .collection<Partial<User>>('users')
          .insertOne({ ...registerData, language: 'en' });

        if (!registration.insertedCount) throw new UserRegisterError({ data: { registerData } });

        const updating = await connection.collection<User>('users').updateOne(
          { _id: registration.insertedId },
          {
            $set: {
              language: 'en',
              active: false,
            },
            $currentDate: {
              createdAt: { $type: 'date' },
              lastModified: true,
            },
          },
        );

        if (!updating.modifiedCount) throw new UserModifyingError({ data: { registerData } });
        const account = await connection
          .collection<User>('users')
          .findOne({ username: registerData.username }, { projection: { _id: 1 } });
        return { userId: account._id };
      } catch (e) {
        logger.error(e);
        throw new UserRegisterError({ data: { registerData } });
      }
    },
    search: async <T>({ username, page = 0 }: SearchUsersObject): Promise<T[]> => {
      const users = await connection
        .collection<User>('users')
        .find<T>(
          { username: new RegExp(username, 'gi') },
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
      page = 0,
    }: GetUserObject): Promise<Partial<UserFull>> => {
      const user = await connection.collection<User>('users').findOne<User>(
        { $and: [{ $or: [{ _id: userId }, { username }] }] },
        {
          projection: {
            _id: 1,
          },
        },
      );

      if (!user)
        throw new UserNotFoundError({
          data: {
            username,
            userId,
          },
        });

      const { _id } = user;

      // monkey-check the input query additional parameters, do not count on personalData
      const exclusionProject: { $project: { [k: string]: number } } = { $project: {} };
      if (!followers) exclusionProject.$project.followers = 0;
      if (!follows) exclusionProject.$project.follows = 0;
      if (!listsData) exclusionProject.$project.lists = 0;
      if (!moviesData) exclusionProject.$project.ratedMovies = 0;
      const exclusions = Object.keys(exclusionProject.$project);

      // query initial array and helper object
      const queryArray: Array<{ [k: string]: any }> = [];
      const addFieldsObject: { $addFields: { [k: string]: any } } = { $addFields: {} };

      // match the required user
      queryArray.push({ $match: { _id } });

      // make invisible irrelevant data by default
      queryArray.push({
        $project: {
          password: 0,
          active: 0,
          createdAt: 0,
          lastModified: 0,
          activationToken: 0,
          recoveryToken: 0,
        },
      });

      // add limit 20 for the data we retrieve in altogether
      if (exclusions.length > 1)
        queryArray.push({
          $addFields: {
            follows: { $slice: ['$follows', LIMIT_PAGINATION] },
            followers: { $slice: ['$followers', LIMIT_PAGINATION] },
            ratedMovies: { $slice: ['$ratedMovies', LIMIT_PAGINATION] },
            lists: { $slice: ['$lists', LIMIT_PAGINATION] },
          },
        });

      // if there were only single query we can paginate over it
      // aggregation $slice https://docs.mongodb.com/manual/reference/operator/aggregation/slice/
      // TODO: test the optional $slicing
      if (exclusions.length === 1) {
        const uniqueKey = exclusions[0];
        const lowerLimit = LIMIT_PAGINATION * page;
        queryArray.push({
          $addFields: {
            [uniqueKey]: { $slice: [`$${uniqueKey}`, lowerLimit, LIMIT_PAGINATION] },
          },
        });
      }

      // exclude personal data if the query is done by another user
      if (!personalData || (personalData && !_id.equals(selfId)))
        queryArray.push({
          $project: {
            email: 0,
            language: 0,
          },
        });

      // add follows aggregation stage, unwind and format the data
      if (follows) {
        queryArray.push({
          $graphLookup: {
            from: 'users',
            connectFromField: 'follows',
            connectToField: '_id',
            startWith: '$follows',
            as: 'follows',
            maxDepth: 0,
          },
        });
        addFieldsObject.$addFields.follows = {
          $map: {
            input: '$follows',
            as: 'follow',
            in: {
              _id: '$$follow._id',
              username: '$$follow.username',
            },
          },
        };
      }

      // add followers aggregation stage, unwind and format the data
      if (followers) {
        queryArray.push({
          $graphLookup: {
            from: 'users',
            connectFromField: 'followers',
            connectToField: '_id',
            startWith: '$followers',
            as: 'followers',
            maxDepth: 0,
          },
        });
        addFieldsObject.$addFields.followers = {
          $map: {
            input: '$followers',
            as: 'follower',
            in: {
              _id: '$$follower._id',
              username: '$$follower.username',
            },
          },
        };
      }

      // add lists aggregation stage, unwind and format the data
      if (listsData) {
        addFieldsObject.$addFields.lists = {
          $map: {
            input: '$lists',
            as: 'list',
            in: {
              _id: '$$list._id',
              description: '$$list.description',
            },
          },
        };
      }

      /* add movies aggregation stage
       * it is a foreign `movies` collection
       * have to match and transform the data to be easier to explore
       */
      if (moviesData)
        queryArray.push({
          $lookup: {
            from: 'movies',
            as: 'ratedMovies',
            pipeline: [
              {
                $match: { 'ratedBy.userId': _id },
              },
              { $unwind: '$ratedBy' },
              {
                $project: {
                  _id: '$_id',
                  title: '$title',
                  poster: '$poster',
                  rate: '$ratedBy.rate',
                },
              },
              {
                $group: {
                  _id: '$_id',
                  title: { $first: '$title' },
                  poster: { $first: '$poster' },
                  rate: { $first: '$rate' },
                },
              },
            ],
          },
        });

      // additions for the transformations, only if we requested any fields from the document
      if (Object.keys(addFieldsObject.$addFields).length) queryArray.push(addFieldsObject);

      // if there were no additional queries by the user data,
      // we $project to exclude all the unnecesary fields
      if (exclusions.length) queryArray.push(exclusionProject);

      // make query
      const queriedUserData = await connection
        .collection<User>('users')
        .aggregate<Partial<UserFull>>(queryArray)
        .next();

      if (!queriedUserData)
        throw new UserNotFoundError({
          data: {
            username,
            userId,
          },
        });
      return queriedUserData;
    },

    modify: async ({ userId, ...userData }: ModifyUserObject): Promise<boolean> => {
      const updatedUser = await connection.collection<User>('users').updateOne(
        { _id: userId },
        {
          $set: {
            ...userData,
          },
          $currentDate: {
            lastModified: true,
          },
        },
      );
      if (!updatedUser.matchedCount) throw new UserNotFoundError({ data: { userId, ...userData } });
      if (!updatedUser.modifiedCount) throw new UserModifyingError({ data: { userId, ...userData } });

      return;
    },
    follow: async ({ userId, followId }: { userId: ObjectId; followId: ObjectId }) => {
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
      if (followed.matchedCount !== 2) throw new FollowingOperationError({ data: { userId, followId } });
      return true;
    },
    unfollow: async ({ userId, followId }: { userId: ObjectId; followId: ObjectId }) => {
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
      if (followed.matchedCount !== 2) throw new FollowingOperationError({ data: { userId, followId } });
      return true;
    },
  };
};
