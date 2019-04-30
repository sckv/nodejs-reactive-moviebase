declare module 'types/User.model' {
  import {MongoObjectID} from 'types/utils';

  type LanguageType = 'es' | 'en';

  interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    language: LanguageType;
    follows: MongoObjectID[];
    ratedMovies: MongoObjectID[];
    lists: Array<{
      _id: string;
      title: string;
      description: string;
      private: boolean;
      movies: MongoObjectID[];
    }>;
    active: boolean;
    activationToken?: string;
    recoveryToken?: string;
    resetToken?: string;
    createdAt: Date;
    modifiedAt: Date;
  }
}
