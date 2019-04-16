declare module 'types/lists.repository' {
  import {ObjectID} from 'bson';
  import {MovieRating} from 'types/Movie.model';

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
    rate: MovieRating;
    commentary: string;
  }
}
