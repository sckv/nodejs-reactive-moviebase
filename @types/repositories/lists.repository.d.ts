declare module 'types/lists.repository' {
  import {ObjectID} from 'bson';

  type CreateListData = {
    title: string;
    description: string;
    private: boolean;
    userId: ObjectID;
  };

  type RemoveMovieData = {
    listId: ObjectID;
    movieId: ObjectID;
  };

  type AddMovieToList = {
    listId: ObjectID;
    movieId: ObjectID;
    rate: 1 | 2 | 3 | 4 | 5;
    commentary: string;
  };
}
