declare module 'types/listing.services' {
  import {ObjectID} from 'bson';
  import {MovieThinObject} from 'types/moviesRequesting.services';

  interface ListObject {
    _id: ObjectID;
    title: string;
    description: string;
    private: boolean;
    movies: MovieThinObject[];
  }

  interface ListThinObject {
    _id: ObjectID;
    title: string;
    description: string;
    movies: Array<{poster: string}>;
  }
}
