import {Db} from 'mongodb';
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
      const password = await connection.collection('users').findOne<string>({username, active: true});
      if (!password) throw new UserNotFoundError({data: {username}, message: ErrorsList.USER_NOT_FOUND});
      return {password};
    },

    /**
     * @throws SessionNotSetError, UserNotFoundError
     */
    setSession: async ({username, sessionToken}: NewSessionObject): Promise<{userId: string}> => {
      const {_id} = await connection
        .collection<User>('users')
        .findOne({username, active: true}, {projection: {_id: 1}});

      if (!_id) throw new UserNotFoundError({data: {username}});

      const session = await connection.collection<Session>('sessions').update(
        {
          userId: _id,
          token: sessionToken,
        },
        {
          $set: {
            $currentDate: {
              lastModified: true,
              createdAt: {$type: 'timestamp'},
            },
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
    closeSession: async (sessionId: string): Promise<boolean> => {
      const success = await connection.collection<Session>('sessions').updateOne(
        {
          $and: [{_id: {$eq: sessionId}}, {sessionClosed: {$exists: false}}],
        },
        {
          $currentDate: {
            lastModified: true,
            createdAt: {$type: 'timestamp'},
            sessionClosed: {$type: 'timestamp'},
          },
        },
      );
      if (!success.matchedCount) throw new SessionDoNotExistError({data: {sessionId}});
      return true;
    },

    /**
     * @throws SessionDoNotExistError
     */
    getSession: async (sessionToken: string): Promise<SessionObject> => {
      const sessionObject = await connection
        .collection<User>('users')
        .aggregate<SessionObject>([
          {
            $lookup: {
              from: 'sessions',
              localField: '_id',
              foreignField: 'userId',
              as: 'sessions',
            },
          },
          {$unwind: '$sessions'},
          {$match: {'sessions.sessionToken': sessionToken, active: true}},
          {
            $project: {
              userId: '_id',
              username: 1,
              languageType: 1,
            },
          },
        ])
        .limit(1)
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
        {
          _id: userId,
        },
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

      if (!success.matchedCount) throw new UserNotFoundError({data: {activationToken}});
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
      const updatedUser = await connection.collection('users').updateOne(
        {_id: userId, resetToken},
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
