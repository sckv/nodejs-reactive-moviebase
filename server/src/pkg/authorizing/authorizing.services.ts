import {mongoConnection} from '@src/database';
import {InvalidPasswordError} from '@src/errors/application-errors/invalid-password';
import {AuthRepository} from '@src/pkg/storage/mongo/auth.repository';
import {generateToken} from '@src/utils/generate-token';
import bcrypt from 'bcrypt';
import {LoginObject, LoginResponseObject} from 'types/authorizing.services';
import {Db, ObjectId} from 'mongodb';
import {createObjectId} from '@src/utils/create-objectid';
import {MongoObjectID} from 'types/utils';

const SESSION_TOKEN_LENGTH = 76;
const ACTIVATION_RESET_TOKEN_LENGTH = 96;

// We let injectable mongoclientDB ONLY for testing purposes
export const AuthServices = async (mc?: Db) => {
  const AuthRepo = AuthRepository(mc || mongoConnection);
  // const UsersRepo = UsersRepository(connection);
  return {
    login: async ({username, password}: LoginObject): Promise<LoginResponseObject> => {
      const userPassword = await AuthRepo.getPasswordByUsername(username);

      if (await bcrypt.compare(password, userPassword.password)) {
        const sessionToken = await generateToken(SESSION_TOKEN_LENGTH);
        const {userId} = await AuthRepo.setSession({username, sessionToken});
        return {userId, token: sessionToken};
      } else {
        throw new InvalidPasswordError({
          data: {
            username,
            password,
          },
        });
      }
    },
    logout: ({sessionId}: {sessionId: string | ObjectId}): Promise<boolean> => {
      return AuthRepo.closeSession(createObjectId(sessionId));
    },
    getSession: ({sessionToken}: {sessionToken: string}) => {
      return AuthRepo.getSession(sessionToken);
    },
    generateActivationToken: async ({userId}: {userId: string | ObjectId}) => {
      return AuthRepo.setActivationPublicToken({
        userId: createObjectId(userId),
        activationToken: await generateToken(ACTIVATION_RESET_TOKEN_LENGTH),
      });
    },
    generateRecoveryToken: async ({email}: {email: string}) => {
      return AuthRepo.setRecoveryPublicToken({
        email,
        recoveryToken: await generateToken(ACTIVATION_RESET_TOKEN_LENGTH),
      });
    },
    checkRecoveryAndSetResetToken: async ({recoveryToken}: {recoveryToken: string}) => {
      return AuthRepo.matchRecoveryAndSetResetToken({
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
      return AuthRepo.setPassword({userId: createObjectId(userId), password, resetToken});
    },
  };
};
