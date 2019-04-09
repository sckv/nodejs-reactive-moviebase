import {ObjectID} from 'bson';
import {MongoClient} from 'mongodb';
import {LoginObject, LoginResponseObject, SessionObject, RecoveryResponseObject} from 'types/auth.repository';

export const AuthRepository = (connection: MongoClient) => {
  return {
    login: async (loginData: LoginObject): Promise<LoginResponseObject> => {},
    logout: async (sessionId: ObjectID): Promise<boolean> => {},
    getSession: async (token: string): Promise<SessionObject> => {},
    generateActivationPublicToken: async (userId: ObjectID): Promise<{activationToken: string}> => {},
    activate: async (activationToken: string): Promise<boolean> => {},
    generateRecoveryPublicToken: async (email: string): Promise<{recoveryToken: string}> => {},
    recover: async (recoveryToken: string): Promise<RecoveryResponseObject> => {},
    setNewPassword: async (newPasswordData: NewPasswordObject): Promise<boolean> => {},
  };
};
