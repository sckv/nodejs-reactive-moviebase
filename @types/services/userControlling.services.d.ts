import {ListThinObject} from 'types/listing.services';

declare module 'types/userControlling.services' {
  import {ObjectID} from 'bson';
  import {MovieSlimObject} from 'types/moviesRequesting.services';

  interface UserObject {
    _id: ObjectID;
    username: string;
  }

  interface UserPrivateObject extends UserObject {
    email: string;
    language: 'en' | 'es';
  }

  type UserFollower = {
    _id: ObjectID;
    avatar: string;
    username: string;
  };

  interface UserMovies {
    movies: Array<{
      movie: MovieSlimObject;
      rating: 1 | 2 | 3 | 4 | 5;
      comment: string;
    }>;
  }

  interface UserLists {
    lists: ListThinObject[];
  }

  interface UserFullObject extends UserObject, UserMovies, UserLists {
    followers: UserFollower[];
    follows: UserFollower[];
  }
}
