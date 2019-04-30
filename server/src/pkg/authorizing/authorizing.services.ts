import {mongoConnection} from '@src/database';
import {InvalidPasswordError} from '@src/errors/application-errors/invalid-password';
import {AuthRepository} from '@src/pkg/storage/mongo/auth.repository';
import {generateToken} from '@src/utils/generate-token';
import bcrypt from 'bcrypt';
import {NewPasswordObject} from 'types/auth.repository';
import {LoginObject, LoginResponseObject} from 'types/authorizing.services';
import {Db} from 'mongodb';

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
    logout: ({sessionId}: {sessionId: string}): Promise<boolean> => {
      return AuthRepo.closeSession(sessionId);
    },
    getSession: ({sessionToken}: {sessionToken: string}) => {
      return AuthRepo.getSession(sessionToken);
    },
    generateActivationToken: async ({userId}: {userId: string}) => {
      return AuthRepo.setActivationPublicToken({
        userId,
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
    reSetNewPassword: async ({userId, password, resetToken}: NewPasswordObject) => {
      return AuthRepo.setPassword({userId, password, resetToken});
    },
  };
};
