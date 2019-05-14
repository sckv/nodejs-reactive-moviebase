import { mongoConnection } from '@src/database';
import { InvalidPasswordError } from '@src/errors/application-errors/invalid-password';
import { AuthRepository } from '@src/pkg/storage/mongo/auth.repository';
import { generateToken } from '@src/utils/generate-token';
import bcrypt from 'bcrypt';
import { LoginObject, LoginResponseObject } from 'types/authorizing.services';
import { Db, ObjectId } from 'mongodb';
import { createObjectId } from '@src/utils/create-objectid';
import { MongoObjectID } from 'types/utils';
import { CacheServices } from '@src/pkg/cache/cache.services';

const SESSION_TOKEN_LENGTH = 76;
const ACTIVATION_RESET_TOKEN_LENGTH = 96;

// We let injectable mongoclientDB ONLY for testing purposes
export const AuthServices = (mc?: Db) => {
  const AuthRepo = AuthRepository(mc || mongoConnection);
  // const UsersRepo = UsersRepository(connection);
  return {
    login: async ({ username, password }: LoginObject): Promise<LoginResponseObject> => {
      const userPassword = await AuthRepo.getPasswordByUsername(username);

      if (await bcrypt.compare(password, userPassword.password)) {
        const sessionToken = await generateToken(SESSION_TOKEN_LENGTH);
        const { userId, language } = await AuthRepo.setSession({ username, sessionToken });
        await CacheServices.setSession({ userId, sessionToken, language });
        return { userId, token: sessionToken, language, username };
      } else {
        throw new InvalidPasswordError({
          data: {
            username,
            password,
          },
        });
      }
    },
    logout: async ({ sessionToken }: { sessionToken: string }): Promise<boolean> => {
      await AuthRepo.closeSession(sessionToken);
      return await CacheServices.clearSession(sessionToken);
    },
    getSession: ({ sessionToken }: { sessionToken: string }) => {
      return AuthRepo.getSession(sessionToken);
    },
    activate: (activationToken: string) => {
      return AuthRepo.activate(activationToken);
    },
    generateActivationToken: async ({ userId }: { userId: string | ObjectId }) => {
      return await AuthRepo.setActivationPublicToken({
        userId: createObjectId(userId),
        activationToken: await generateToken(ACTIVATION_RESET_TOKEN_LENGTH),
      });
    },
    generateRecoveryToken: async ({ email }: { email: string }) => {
      return await AuthRepo.setRecoveryPublicToken({
        email,
        recoveryToken: await generateToken(ACTIVATION_RESET_TOKEN_LENGTH),
      });
    },
    checkRecoveryAndSetResetToken: async ({ recoveryToken }: { recoveryToken: string }) => {
      return await AuthRepo.matchRecoveryAndSetResetToken({
        recoveryToken,
        resetToken: await generateToken(ACTIVATION_RESET_TOKEN_LENGTH),
      });
    },
    reSetNewPassword: async ({
      userId,
      password,
      resetToken,
    }: {
      resetToken?: string;
      userId?: ObjectId | MongoObjectID;
      password: string;
    }) => {
      return AuthRepo.setPassword({ userId: createObjectId(userId), password, resetToken });
    },
  };
};
