declare module 'types/listing.services' {
  import {MovieThin} from 'types/movies-requesting.services';

  interface ListEntry {
    _id: string;
    title: string;
    description: string;
    private: boolean;
    movies: MovieThin[];
  }

  interface ListEntryThin {
    _id: string;
    title: string;
    description: string;
    movies: Array<{poster: string}>;
  }
}
