declare module 'types/User.model' {
  import {ObjectID} from 'bson';
  import {_MovieId} from 'types/Movie.model';

  type _UserId = ObjectID;
  type LanguageType = 'es' | 'en';

  interface User {
    _id: ObjectID;
    username: string;
    password: string;
    email: string;
    language: LanguageType;
    follows: _UserId[];
    ratedMovies: _MovieId[];
    lists: Array<{
      _id: ObjectID;
      title: string;
      description: string;
      private: boolean;
      movies: _MovieId[];
    }>;
    activationToken?: string;
    recoveryToken?: string;
    resetToken?: string;
    createdAt: Date;
    modifiedAt: Date;
  }
}
