import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {
  LoginObject,
  LoginResponseObject,
  SessionObject,
  RecoveryResponseObject,
  NewPasswordObject,
} from 'types/auth.repository';

export const AuthRepository = (connection: MongoClient) => {
  return {
    login: async (loginData: LoginObject): Promise<LoginResponseObject> => {
      return;
    },
    logout: async (sessionId: ObjectID): Promise<boolean> => {
      return;
    },
    getSession: async (token: string): Promise<SessionObject> => {
      return;
    },
    generateActivationPublicToken: async (userId: ObjectID): Promise<{activationToken: string}> => {
      return;
    },
    activate: async (activationToken: string): Promise<boolean> => {
      return;
    },
    generateRecoveryPublicToken: async (email: string): Promise<{recoveryToken: string}> => {
      return;
    },
    recover: async (recoveryToken: string): Promise<RecoveryResponseObject> => {
      return;
    },
    setNewPassword: async (newPasswordData: NewPasswordObject): Promise<boolean> => {
      return;
    },
  };
};
