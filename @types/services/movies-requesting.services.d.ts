declare module 'types/movies-requesting.services' {
  import { MongoObjectID } from 'types/utils';
  import { MovieRating } from 'types/Movie.model';
  import { ObjectId } from 'bson';

  interface MovieRequest {
    _id: ObjectId;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    rate: string[];
    comment: string[];
    plot: string;
    description: string;
    ratedBy: Array<{
      userId: ObjectId;
      comment: string;
      rate: MovieRating;
    }>;
    score?: number;
    averageRate: number;
  }

  interface MovieRequestThin {
    _id: ObjectId;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    plot: string;
    rate: number;
    score?: number;
    averageRate?: number;
  }

  interface MovieRequestSlim {
    _id: ObjectId;
    title: string;
    poster: string;
    rate: number;
  }
}
