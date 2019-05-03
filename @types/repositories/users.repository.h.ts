declare module 'types/users.repository' {
  import {LanguageType} from 'types/User.model';
  import {MongoObjectID} from 'types/utils';

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
    userId?: MongoObjectID;
    username?: string;
    selfId: MongoObjectID;
    page: number;
    personalData?: boolean;
    moviesData?: boolean;
    listsData?: boolean;
    followers?: boolean;
    follows?: boolean;
  };

  interface ModifyUserObject {
    userId: MongoObjectID;
    password?: string;
    language?: LanguageType;
  }
}
