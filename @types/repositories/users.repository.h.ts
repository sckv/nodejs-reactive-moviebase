declare module 'types/users.repository' {
  import {LanguageType} from 'types/User.model';
  import {MongoObjectID} from 'types/utils';
  import {ObjectId} from 'bson';

  interface RegisterUserObject {
    username: string;
    password: string;
    email: string;
  }

  interface SearchUsersObject {
    username?: string;
    page: number;
  }

  type GetUserObject = {
    userId?: ObjectId;
    username?: string;
    selfId: ObjectId;
    page: number;
    personalData?: boolean;
    moviesData?: boolean;
    listsData?: boolean;
    followers?: boolean;
    follows?: boolean;
  };

  interface ModifyUserObject {
    userId: ObjectId;
    password?: string;
    language?: LanguageType;
  }
}
