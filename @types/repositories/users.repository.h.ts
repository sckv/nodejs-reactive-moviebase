declare module 'types/users.repository' {
  import {MongoObjectID} from 'types/utils';

  interface RegisterUserObject {
    username: string;
    password: string;
    email: string;
  }

  interface SearchUsersObject {
    username?: string;
  }

  interface GetUserObject {
    userId: MongoObjectID;
    selfId: MongoObjectID;
    personalData?: boolean;
    moviesData?: boolean;
    listsData?: boolean;
    followers?: boolean;
    follows?: boolean;
  }

  interface ModifyUserObject {
    userId: MongoObjectID;
    password?: string;
  }
}
