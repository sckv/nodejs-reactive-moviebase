import {mongoConnection} from '@src/database';
import {AuthRepository} from '@src/pkg/storage/mongo/auth.repository';
import bcrypt from 'bcrypt';
import {LoginResponseObject, LoginObject} from 'types/authorizing.services';
import {promisify} from 'util';
import crypto from 'crypto';
import {InvalidPasswordError} from '@src/domain-errors/invalid-password';
import {ObjectID} from 'bson';
import {UsersRepository} from '@src/pkg/storage/mongo/users.repository';
import {GetUserObject} from 'types/users.repository';
import {UserPrivate} from 'types/user-controlling.services';

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
        throw new InvalidPasswordError({message: "Passwords don't match"});
      }
    },
    logout: ({sessionId}: {sessionId: ObjectID}): Promise<boolean> => {
      return AuthRepo.closeSession(sessionId);
    },
    getSession: ({sessionToken}: {sessionToken: string}) => {
      return AuthRepo.getSession(sessionToken);
    },
    generateActivationToken: async ({userId}: {userId: ObjectID}) => {
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

const generateToken = async (length: number = 76) => {
  const randomBuffer = await promisify(crypto.randomBytes)(length);
  return randomBuffer.toString('hex');
};
