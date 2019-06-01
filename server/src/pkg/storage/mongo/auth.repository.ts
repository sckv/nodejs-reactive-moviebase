import { Db, ObjectId } from 'mongodb';
import {
  SessionObject,
  NewPasswordObject,
  NewSessionObject,
  SetActivationTokenObject,
  SetRecoveryTokenObject,
} from 'types/auth.repository';

import { UserNotFoundError } from '@src/errors/domain-errors/user-not-found';
import { ErrorsList } from '@src/errors/errors-list';
import { SessionNotSetError } from '@src/errors/domain-errors/session-not-set';
import { SessionDoNotExistError } from '@src/errors/domain-errors/session-do-not-exist';
import { User, LanguageType } from 'types/User.model';
import { Session } from 'types/Session.model';

export const AuthRepository = (connection: Db) => {
  return {
    getPasswordByUsername: async (username: string): Promise<{ password: string }> => {
      const user = await connection.collection('users').findOne<{ password: string }>(
        { username, active: true },
        {
          projection: {
            password: 1,
          },
        },
      );
      if (!user) throw new UserNotFoundError({ data: { username }, message: ErrorsList.USER_NOT_FOUND });
      return { password: user.password };
    },

    setSession: async ({
      username,
      sessionToken,
    }: NewSessionObject): Promise<{ userId: ObjectId; language: LanguageType }> => {
      const user = await connection
        .collection<User>('users')
        .findOne<Pick<User, '_id' | 'language'>>({ username, active: true }, { projection: { _id: 1, language: 1 } });

      if (!user) throw new UserNotFoundError({ data: { username } });
      const { _id, language } = user;

      const session = await connection.collection<Session>('sessions').updateOne(
        {
          userId: _id,
          token: sessionToken,
        },
        {
          $currentDate: {
            lastModified: true,
            createdAt: { $type: 'date' },
          },
        },
        { upsert: true },
      );
      if (!session.result)
        throw new SessionNotSetError({ data: { username, sessionToken }, message: ErrorsList.SESSION_NOT_SET });

      return { userId: _id, language };
    },

    closeSession: async (sessionToken: string): Promise<boolean> => {
      const success = await connection.collection<Session>('sessions').updateOne(
        {
          $and: [{ token: { $eq: sessionToken } }, { sessionClosed: { $exists: false } }],
        },
        {
          $currentDate: {
            lastModified: true,
            sessionClosed: { $type: 'date' },
          },
        },
      );
      if (!success.matchedCount) throw new SessionDoNotExistError({ data: { sessionToken } });
      return true;
    },

    getSession: async (sessionToken: string): Promise<SessionObject> => {
      const sessionObject = await connection
        .collection<User>('users')
        .aggregate<SessionObject>([
          { $match: { active: true } },
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
          { $unwind: '$sessions' },
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
      if (!sessionObject) throw new SessionDoNotExistError({ data: { sessionToken } });

      return sessionObject;
    },

    setActivationPublicToken: async ({
      userId,
      activationToken,
    }: SetActivationTokenObject): Promise<{ activationToken: string }> => {
      const success = await connection.collection<User>('users').updateOne(
        { $and: [{ _id: { $eq: userId } }, { active: { $eq: false } }] },
        {
          $set: { activationToken },
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.matchedCount) throw new UserNotFoundError({ data: { userId } });
      return { activationToken };
    },

    activate: async (activationToken: string): Promise<{ username: string; email: string }> => {
      const success = await connection.collection<User>('users').findOneAndUpdate(
        { activationToken, active: false },
        {
          $set: { active: true },
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.ok) throw new UserNotFoundError({ data: { activationToken } });
      return { username: success.value.username, email: success.value.email };
    },

    setRecoveryPublicToken: async ({
      recoveryToken,
      email,
    }: SetRecoveryTokenObject): Promise<{ recoveryToken: string; username: string }> => {
      const success = await connection.collection<User>('users').updateOne(
        { email },
        {
          $set: { recoveryToken },
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!success.matchedCount) throw new UserNotFoundError({ data: { email } });

      const { username } = await connection
        .collection<User>('users')
        .findOne({ email }, { projection: { username: 1 } });
      return { recoveryToken, username };
    },

    matchRecoveryAndSetResetToken: async ({
      recoveryToken,
      resetToken,
    }: {
      recoveryToken: string;
      resetToken: string;
    }): Promise<{ resetToken: string }> => {
      const result = await connection.collection<User>('users').findOneAndUpdate(
        { recoveryToken },
        {
          $set: {
            resetToken,
          },
        },
      );

      if (!result.ok) throw new UserNotFoundError({ data: { recoveryToken } });
      return { resetToken };
    },

    setPassword: async ({ userId, password, resetToken }: NewPasswordObject): Promise<boolean> => {
      let option;
      if (userId) option = { _id: userId };
      if (resetToken) option = { resetToken };
      const updatedUser = await connection.collection('users').updateOne(
        // {$or: [{_id: {$eq: userId}}, {resetToken: {$eq: resetToken}}]},
        option,
        {
          $set: { password },
          $currentDate: {
            lastModified: true,
          },
        },
      );

      if (!updatedUser.matchedCount) throw new UserNotFoundError({ data: { userId } });
      return true;
    },
  };
};
