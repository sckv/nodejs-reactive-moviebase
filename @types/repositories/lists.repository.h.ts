declare module 'types/lists.repository' {
  import {MovieRating} from 'types/Movie.model';
  import {MongoObjectID} from 'types/utils';

  interface CreateListObject {
    title: string;
    description: string;
    private: boolean;
    userId: MongoObjectID;
  }

  interface RemoveMovieObject {
    listId: MongoObjectID;
    movieId: MongoObjectID;
  }

  interface AddMovieToListObject {
    listId: MongoObjectID;
    movieId: MongoObjectID;
    rate: MovieRating;
    commentary: string;
  }
}
