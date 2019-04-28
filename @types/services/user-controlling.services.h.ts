declare module 'types/user-controlling.services' {
  import {MovieSlim} from 'types/movies-requesting.services';
  import {ListEntryThin} from 'types/listing.services';

  interface User {
    _id: string;
    username: string;
  }

  interface UserPrivate extends User {
    email: string;
    language: 'en' | 'es';
  }

  type UserFollower = {
    _id: string;
    avatar: string;
    username: string;
  };

  interface UserMovies {
    movies: Array<{
      movie: MovieSlim;
      rating: 1 | 2 | 3 | 4 | 5;
      comment: string;
    }>;
  }

  interface UserLists {
    lists: ListEntryThin[];
  }

  interface UserFull extends User, UserMovies, UserLists {
    followers: UserFollower[];
    follows: UserFollower[];
  }
}
