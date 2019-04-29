declare module 'types/user-controlling.services' {
  import {MovieSlim} from 'types/movies-requesting.services';
  import {ListEntryThin} from 'types/listing.services';

  interface UserThin {
    _id: string;
    username: string;
  }

  interface UserPrivate extends UserThin {
    email: string;
    language: 'en' | 'es';
  }

  type UserFollower = {
    _id: string;
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

  interface UserFull extends UserThin, UserMovies, UserLists {
    followers: UserFollower[];
    follows: UserFollower[];
  }

  type RegistrationObject = {
    email: string;
    password: string;
    username: string;
  };
}
