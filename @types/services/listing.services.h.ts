declare module 'types/listing.services' {
  import {MovieRequestThin} from 'types/movies-requesting.services';

  interface ListEntry {
    _id: string;
    title: string;
    description: string;
    private: boolean;
    movies: MovieRequestThin[];
  }

  interface ListEntryThin {
    _id: string;
    title: string;
    description: string;
    movies: Array<{poster: string}>;
  }
}
