declare module 'types/movies-requesting.services' {
  import {ObjectID} from 'bson';

  interface Movie {
    _id: ObjectID;
    ttid: string;
    title: string;
    year: number;
    data: {
      plot: string;
      description: string;
      poster: string;
    };
  }

  interface MovieThin {
    _id: ObjectID;
    ttid: string;
    title: string;
    year: number;
    data: {
      poster: string;
    };
  }

  interface MovieSlim {
    _id: ObjectID;
    ttid: string;
    title: string;
    data: {
      poster: string;
    };
  }
}
