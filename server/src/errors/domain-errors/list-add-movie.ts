import {ErrorProps} from 'types/utils';
import {ErrorsList} from '@src/errors/errors-list';

export class AddingMovieToListError extends Error {
  data: {[k: string]: any};
  constructor({data}: ErrorProps) {
    super(ErrorsList.ADDING_MOVIE_TO_LIST);
    this.message = ErrorsList.ADDING_MOVIE_TO_LIST;
    this.data = data;
  }
}
