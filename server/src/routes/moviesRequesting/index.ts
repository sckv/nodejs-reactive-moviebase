import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as MoviesHandler from '@src/handlers/movies-requesting.handlers';

const index: RouteController = app => {
  app.route('/movies').get(asyncWrapper(MoviesHandler.searchMovie));
  app.route('/movies/:movieId').get(asyncWrapper(MoviesHandler.getMovieById));
  app.route('/movies/:ttid/by-ttid').get(asyncWrapper(MoviesHandler.getMovieByTtid));
};

export = index;
