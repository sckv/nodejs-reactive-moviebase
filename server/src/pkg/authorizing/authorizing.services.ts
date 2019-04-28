import {mongoConnection} from '@src/database';
import {AuthRepository} from '@src/pkg/storage/mongo/auth.repository';
import bcrypt from 'bcrypt';
import {LoginResponseObject, LoginObject} from 'types/authorizing.services';

import {InvalidPasswordError} from '@src/errors/application-errors/invalid-password';
import {UsersRepository} from '@src/pkg/storage/mongo/users.repository';
import {GetUserObject} from 'types/users.repository';
import {UserPrivate} from 'types/user-controlling.services';
import {generateToken} from '@src/utils/generate-token';

const SALT_ROUNDS = 10;
const SESSION_TOKEN_LENGTH = 76;
const ACTIVATION_RESET_TOKEN_LENGTH = 96;

export const AuthServices = async () => {
  const connection = await mongoConnection;
  const AuthRepo = AuthRepository(connection);
  const UsersRepo = UsersRepository(connection);
  return {
    login: async ({username, password}: LoginObject): Promise<LoginResponseObject> => {
      // const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
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
  };
};
