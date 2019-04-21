declare module 'types/listing.services' {
  import {ObjectID} from 'bson';
  import {MovieThin} from 'types/movies-requesting.services';

  interface ListEntry {
    _id: ObjectID;
    title: string;
    description: string;
    private: boolean;
    movies: MovieThin[];
  }

  interface ListEntryThin {
    _id: ObjectID;
    title: string;
    description: string;
    movies: Array<{poster: string}>;
  }
}
