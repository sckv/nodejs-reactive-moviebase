declare module 'types/User.model' {
  import {MongoObjectID} from 'types/utils';
  import {ObjectId} from 'bson';

  type LanguageType = 'es' | 'en';

  interface User {
    _id: ObjectId;
    username: string;
    password: string;
    email: string;
    language: LanguageType;
    follows: ObjectId[];
    followers: ObjectId[];
    ratedMovies: ObjectId[];
    lists: Array<{
      _id: string;
      title: string;
      description: string;
      private: boolean;
      movies: ObjectId[];
    }>;
    active: boolean;
    activationToken?: string;
    recoveryToken?: string;
    resetToken?: string;
    createdAt: Date;
  }
}
