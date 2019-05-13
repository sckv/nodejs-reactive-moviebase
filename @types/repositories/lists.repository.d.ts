declare module 'types/lists.repository' {
  import {MovieRating} from 'types/Movie.model';
  import {ObjectId} from 'bson';

  interface CreateListObject {
    title: string;
    description: string;
    isPrivate: boolean;
    selfId: ObjectId;
  }

  interface RemoveMovieObject {
    selfId: ObjectId;
    listId: ObjectId;
    movieId: ObjectId;
  }

  interface AddMovieToListObject {
    selfId: ObjectId;
    listId: ObjectId;
    movieId: ObjectId;
    rate: MovieRating;
    commentary: string;
  }
}
