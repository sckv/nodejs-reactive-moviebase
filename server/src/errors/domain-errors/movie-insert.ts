import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class MovieInsertError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.MOVIE_INSERT);
    this.message = ErrorsList.MOVIE_INSERT;
    this.data = data;
  }
}
