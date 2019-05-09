declare module 'types/user-controlling.services' {
  import {MovieRequestThin} from 'types/movies-requesting.services';
  import {ListEntryThin} from 'types/listing.services';
  import {LanguageType} from 'types/User.model';
  import {MongoObjectID} from 'types/utils';

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
      movie: MovieRequestThin;
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

  interface ModifyUserObjectService {
    userId: MongoObjectID;
    password?: string;
    language?: LanguageType;
  }
}
