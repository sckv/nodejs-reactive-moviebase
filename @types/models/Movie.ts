declare module 'types/Movie.model' {
  import {ObjectID} from 'bson';
  import {_UserId, LanguageType} from 'types/User.model';

  type _MovieId = ObjectID;
  type MovieRating = 1 | 2 | 3 | 4 | 5;

  interface Movie {
    _id: ObjectID;
    ttid: string;
    title: string;
    year: number;
    data: Array<
      {
        [k in LanguageType]: {
          plot: string;
          description: string;
          poster: string;
        }
      }
    >;
    ratedBy: Array<{
      userId: _UserId;
      comment: string;
      rate: MovieRating;
    }>;
    hits: number;
    createdAt: Date;
  }
}
