declare module 'types/lists.repository' {
  import {ObjectID} from 'bson';

  interface CreateListObject {
    title: string;
    description: string;
    private: boolean;
    userId: ObjectID;
  }

  interface RemoveMovieObject {
    listId: ObjectID;
    movieId: ObjectID;
  }

  interface AddMovieToListObject {
    listId: ObjectID;
    movieId: ObjectID;
    rate: 1 | 2 | 3 | 4 | 5;
    commentary: string;
  }
}
