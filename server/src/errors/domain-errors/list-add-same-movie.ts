import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class AddToListAddedMovieError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.MOVIE_ALREADY_ADDED_TO_LIST);
    this.message = ErrorsList.MOVIE_ALREADY_ADDED_TO_LIST;
    this.data = data;
  }
}
