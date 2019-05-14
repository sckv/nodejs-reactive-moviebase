declare module 'types/Movie.model' {
  import {LanguageType} from 'types/User.model';
  import {ObjectId} from 'bson';

  type MovieRating = 1 | 2 | 3 | 4 | 5;

  interface Movie {
    _id: ObjectId;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    data: {
      [k in LanguageType]: {
        plot: string;
        description: string;
      }
    };
    ratedBy: Array<{
      userId: ObjectId;
      comment: string;
      rate: MovieRating;
    }>;
    hits: number;
    createdAt: Date;
  }
}
