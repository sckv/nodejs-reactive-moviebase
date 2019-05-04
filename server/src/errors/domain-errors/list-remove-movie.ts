import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class RemovingMovieFromListError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.REMOVING_MOVIE_FROM_LIST);
    this.message = ErrorsList.REMOVING_MOVIE_FROM_LIST;
    this.data = data;
  }
}
