import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class MovieNotFoundError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.MOVIE_NOT_FOUND);
    this.message = ErrorsList.MOVIE_NOT_FOUND;
    this.data = data;
  }
}
