declare module 'types/movies-requesting.services' {
  import {MongoObjectID} from 'types/utils';
  import {MovieRating} from 'types/Movie.model';

  interface MovieRequest {
    _id: MongoObjectID;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    rate: string[];
    comment: string[];
    data: {
      plot: string;
      description: string;
    };
    ratedBy: Array<{
      userId: MongoObjectID;
      comment: string;
      rate: MovieRating;
    }>;
    score?: number;
    averageRate: number;
  }

  interface MovieRequestThin {
    _id: MongoObjectID;
    ttid: string;
    title: string;
    year: number;
    poster: string;
    score?: number;
    averageRate: number;
  }
}
