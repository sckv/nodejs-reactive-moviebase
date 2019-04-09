declare module 'types/users.repository' {
  import {ObjectID} from 'bson';

  type RegisterUserObject = {
    username: string;
    password: string;
    email: string;
  };

  type SearchUsersObject = {
    username?: string;
  };

  type GetUserObject = {
    userId: ObjectID;
    selfId: ObjectID;
    personalData?: boolean;
    moviesData?: boolean;
    listsData?: boolean;
    followers?: boolean;
    follows?: boolean;
  };

  type ModifyUserObject = {
    userId: ObjectID;
    password?: string;
  };
}
