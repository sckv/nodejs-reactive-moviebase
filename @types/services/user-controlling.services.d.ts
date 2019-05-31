declare module 'types/user-controlling.services' {
  import { MovieRequestThin } from 'types/movies-requesting.services';
  import { ListEntryThin } from 'types/listing.services';
  import { LanguageType } from 'types/User.model';
  import { MongoObjectID } from 'types/utils';

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
    ratedMovies: Array<{
      title: string;
      poster: string;
      rate: 1 | 2 | 3 | 4 | 5;
      comment: string;
      _id: MongoObjectID;
    }>;
  }

  interface UserLists {
    lists: ListEntryThin[];
  }

  interface UserFull extends UserThin, UserMovies, UserLists, UserPrivate {
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
