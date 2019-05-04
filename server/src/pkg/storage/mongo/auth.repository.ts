import {Db, ObjectId} from 'mongodb';
import {
  SessionObject,
  NewPasswordObject,
  NewSessionObject,
  SetActivationTokenObject,
  SetRecoveryTokenObject,
} from 'types/auth.repository';

import {UserNotFoundError} from '@src/errors/domain-errors/user-not-found';
import {ErrorsList} from '@src/errors/errors-list';
import {SessionNotSetError} from '@src/errors/domain-errors/session-not-set';
import {SessionDoNotExistError} from '@src/errors/domain-errors/session-do-not-exist';
import {User} from 'types/User.model';
import {Session} from 'types/Session.model';

export const AuthRepository = (connection: Db) => {
  return {
    /**
     * @throws UserNotFoundError
     */
    getPasswordByUsername: async (username: string): Promise<{password: string}> => {
      const {password} = await connection.collection('users').findOne<{password: string}>(
        {username, active: true},
        {
          projection: {
            password: 1,
          },
        },
      );
      if (!password) throw new UserNotFoundError({data: {username}, message: ErrorsList.USER_NOT_FOUND});
      return {password};
    },

    /**
     * @throws SessionNotSetError, UserNotFoundError
     */
    setSession: async ({username, sessionToken}: NewSessionObject): Promise<{userId: ObjectId}> => {
      const user = await connection
        .collection<User>('users')
        .findOne<Pick<User, '_id'>>({username, active: true}, {projection: {_id: 1}});

      if (!user._id) throw new UserNotFoundError({data: {username}});
      const {_id} = user;

      const session = await connection.collection<Session>('sessions').updateOne(
        {
          userId: _id,
          token: sessionToken,
        },
        {
          $currentDate: {
            lastModified: true,
            createdAt: {$type: 'timestamp'},
          },
        },
        {upsert: true},
      );
      if (!session.result)
        throw new SessionNotSetError({data: {username, sessionToken}, message: ErrorsList.SESSION_NOT_SET});

      return {userId: _id};
    },

    /**
     * @throws SessionDoNotExistError
     */
    closeSession: async (sessionToken: string): Promise<boolean> => {
      const success = await connection.collection<Session>('sessions').updateOne(
        {
          $and: [{token: {$eq: sessionToken}}, {sessionClosed: {$exists: false}}],
        },
        {
          $currentDate: {
            lastModified: true,
            createdAt: {$type: 'timestamp'},
            sessionClosed: {$type: 'timestamp'},
          },
        },
      );
      if (!success.matchedCount) throw new SessionDoNotExistError({data: {sessionToken}});
      return true;
    },

    /**
     * @throws SessionDoNotExistError
     */
    getSession: async (sessionToken: string): Promise<SessionObject> => {
      const sessionObject = await connection
        .collection<User>('users')
        .aggregate<SessionObject>([
          {$match: {active: true}},
          {
            $lookup: {
              from: 'sessions',
              localField: '_id',
              foreignField: 'userId',
              as: 'sessions',
            },
          },
          {
            $project: {
              userId: '$_id',
              username: '$username',
              language: '$language',
              sessions: {
                $filter: {
                  input: '$sessions',
                  as: 'session',
                  cond: {
                    $eq: ['$$session.token', sessionToken],
                  },
                },
              },
            },
          },
          {$unwind: '$sessions'},
          {
            $project: {
              _id: 0,
              userId: 1,
              username: 1,
              language: 1,
            },
          },
        ])
        .next();
      if (!sessionObject) throw new SessionDoNotExistError({data: {sessionToken}});

      return sessionObject;
    },

    /**
     * @throws UserNotFoundError
     */
    setActivationPublicToken: async ({
      userId,
      activationToken,
    }: SetActivationTokenObject): Promise<{activationToken: string}> => {
      const success = await connection.collection<User>('users').updateOne(
        {$and: [{_id: {$eq: userId}}, {active: {$eq: false}}]},
        {
          $set: {activationToken},
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.matchedCount) throw new UserNotFoundError({data: {userId}});
      return {activationToken};
    },

    /**
     * @throws UserNotFoundError
     */
    activate: async (activationToken: string): Promise<boolean> => {
      const success = await connection.collection<User>('users').updateOne(
        {activationToken},
        {
          $set: {active: true},
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.matchedCount && !success.modifiedCount) throw new UserNotFoundError({data: {activationToken}});
      return true;
    },

    /**
     * @throws UserNotFoundError
     */
    setRecoveryPublicToken: async ({
      recoveryToken,
      email,
    }: SetRecoveryTokenObject): Promise<{recoveryToken: string}> => {
      const success = await connection.collection<User>('users').updateOne(
        {email},
        {
          $set: {recoveryToken},
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.matchedCount) throw new UserNotFoundError({data: {email}});
      return {recoveryToken};
    },

    /**
     * @throws UserNotFoundError
     */
    matchRecoveryAndSetResetToken: async ({
      recoveryToken,
      resetToken,
    }: {
      recoveryToken: string;
      resetToken: string;
    }): Promise<{resetToken: string}> => {
      const result = await connection.collection<User>('users').findOneAndUpdate(
        {recoveryToken},
        {
          $set: {
            resetToken,
          },
        },
      );

      if (!result.ok) throw new UserNotFoundError({data: {recoveryToken}});
      return {resetToken};
    },

    /**
     * @throws UserNotFoundError
     */
    setPassword: async ({userId, password, resetToken}: NewPasswordObject): Promise<boolean> => {
      let option;
      if (userId) option = {_id: userId};
      if (resetToken) option = {resetToken};
      const updatedUser = await connection.collection('users').updateOne(
        // {$or: [{_id: {$eq: userId}}, {resetToken: {$eq: resetToken}}]},
        option,
        {
          $set: {password},
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!updatedUser.matchedCount) throw new UserNotFoundError({data: {userId}});

      return true;
    },
  };
};
