declare module 'types/listing.services' {
  import { MovieRequestSlim } from 'types/movies-requesting.services';

  interface ListEntry {
    _id: string;
    username: string;
    title: string;
    description: string;
    private: boolean;
    movies: MovieRequestSlim[];
  }

  interface ListEntryThin {
    _id: string;
    title: string;
    description: string;
    movies: Array<{ poster: string }>;
  }
}
