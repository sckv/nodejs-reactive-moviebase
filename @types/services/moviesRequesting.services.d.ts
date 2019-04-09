declare module 'types/moviesRequesting.services' {
  import {ObjectID} from 'bson';

  interface MovieObject {
    _id: ObjectID;
    title: string;
    year: number;
    data: {
      plot: string;
      description: string;
      poster: string;
    };
  }

  interface MovieThinObject {
    _id: ObjectID;
    title: string;
    year: number;
    data: {
      poster: string;
    };
  }

  interface MovieSlimObject {
    _id: ObjectID;
    title: string;
    data: {
      poster: string;
    };
  }
}
