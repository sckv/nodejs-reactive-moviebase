import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {
  SessionObject,
  RecoveryResponseObject,
  NewPasswordObject,
  NewSessionObject,
  SetActivationTokenObject,
  SetRecoveryTokenObject,
} from 'types/auth.repository';

export const AuthRepository = (connection: MongoClient) => {
  return {
    /**
     * @throws UserNotFoundError
     */
    getPasswordByUsername: async (username: string): Promise<{password: string}> => {
      return;
    },
    /**
     * @throws SessionNotSetError
     */
    setSession: async ({username, sessionToken}: NewSessionObject): Promise<{userId: ObjectID}> => {
      return;
    },
    /**
     * @throws SessionNotClosedError, SessionDoNotExistError
     */
    closeSession: async (sessionId: ObjectID): Promise<boolean> => {
      return;
    },
    /**
     * @throws SessionDoNotExistError
     */
    getSession: async (sessionToken: string): Promise<SessionObject> => {
      return;
    },
    /**
     * @throws UserNotFoundError
     */
    setActivationPublicToken: async ({userId, activationToken}: SetActivationTokenObject): Promise<boolean> => {
      return;
    },
    /**
     * @throws UserNotFoundError
     */
    activate: async (activationToken: string): Promise<boolean> => {
      return;
    },
    /**
     * @throws UserNotFoundError
     */
    setRecoveryPublicToken: async ({recoveryToken, email}: SetRecoveryTokenObject): Promise<boolean> => {
      return;
    },
    /**
     * @throws UserNotFoundError
     */
    recover: async (recoveryToken: string): Promise<RecoveryResponseObject> => {
      return;
    },
    /**
     * @throws UserNotFoundError
     */
    setPassword: async (newPasswordData: NewPasswordObject): Promise<boolean> => {
      return;
    },
  };
};
