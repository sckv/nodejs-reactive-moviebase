import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { MovieRequest } from 'types/movies-requesting.services';
import { ThunkAction } from 'redux-thunk';
import { MoviesApi } from '@src/api/movies.api';
import { NotifyActions } from '@src/store/actions/notification.actions';

export enum MovieActionTypes {
  addMovieData = '@@MOVIE/ADD_MOVIE_DATA',
  addMoviesData = '@@MOVIE/ADD_MOVIES_DATA',
  clearMovieData = '@@MOVIE/CLEAR_MOVIE_DATA',
}

export type MovieAction$Add = ActionRich<typeof MovieActionTypes.addMovieData, MovieRequest>;
export type MovieAction$AddMovies = ActionRich<typeof MovieActionTypes.addMoviesData, MovieRequest[]>;
export type MovieAction$Clear = Action<typeof MovieActionTypes.clearMovieData>;

export type MovieActionsUnion = MovieAction$Clear | MovieAction$Add | MovieAction$AddMovies;

export const MoviesActions = {
  addMovieData: (payload: MovieRequest): MovieAction$Add => ({
    type: MovieActionTypes.addMovieData,
    payload,
  }),
  addMoviesData: (payload: MovieRequest[]): MovieAction$AddMovies => ({
    type: MovieActionTypes.addMoviesData,
    payload,
  }),
  clearMovieData: (): MovieAction$Clear => ({ type: MovieActionTypes.clearMovieData }),
};

export const fetchMovieData = ({
  movieId,
  ttid,
}: {
  movieId?: string;
  ttid?: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let movieData: MovieRequest = {} as any;
  let request;
  if (movieId) {
    request = await MoviesApi.getById(movieId);
  } else if (ttid) {
    request = await MoviesApi.getByTtid(ttid);
  }

  if (request && request.data) movieData = request.data;

  dispatch(MoviesActions.addMovieData(movieData));
};

export const searchMovies = (
  criteria: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const response = await MoviesApi.searchCriteria(criteria);

  if (response && response.data) dispatch(MoviesActions.addMoviesData(response.data));
  else dispatch(NotifyActions.error('Error retrieving movies from database.'));
};
