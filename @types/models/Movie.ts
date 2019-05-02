declare module 'types/Movie.model' {
  import {LanguageType} from 'types/User.model';
  import {MongoObjectID} from 'types/utils';

  type MovieRating = 1 | 2 | 3 | 4 | 5;

  interface Movie {
    _id: MongoObjectID;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    data: Array<
      {
        [k in LanguageType]: {
          plot: string;
          description: string;
        }
      }
    >;
    ratedBy: Array<{
      userId: MongoObjectID;
      comment: string;
      rate: MovieRating;
    }>;
    hits: number;
    createdAt: Date;
  }
}
