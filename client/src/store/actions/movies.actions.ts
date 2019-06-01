import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { MovieRequest } from 'types/movies-requesting.services';
import { ThunkAction } from 'redux-thunk';
import { MoviesApi } from '@src/api/movies.api';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { push } from 'connected-react-router';

export enum MovieActionTypes {
  addMovieData = '@@MOVIE/ADD_MOVIE_DATA',
  addMoviesData = '@@MOVIE/ADD_MOVIES_DATA',
  removeSingleMovie = '@@MOVIE/REMOVE_SINGLE',
  clearMovieData = '@@MOVIE/CLEAR_MOVIE_DATA',
}

export type MovieAction$Add = ActionRich<typeof MovieActionTypes.addMovieData, MovieRequest>;
export type MovieAction$AddMovies = ActionRich<typeof MovieActionTypes.addMoviesData, MovieRequest[]>;
export type MovieAction$RemoveSingle = ActionRich<typeof MovieActionTypes.removeSingleMovie, string>;
export type MovieAction$Clear = Action<typeof MovieActionTypes.clearMovieData>;

export type MovieActionsUnion = MovieAction$Clear | MovieAction$Add | MovieAction$AddMovies | MovieAction$RemoveSingle;

export const MoviesActions = {
  addMovieData: (payload: MovieRequest): MovieAction$Add => ({
    type: MovieActionTypes.addMovieData,
    payload,
  }),
  addMoviesData: (payload: MovieRequest[]): MovieAction$AddMovies => ({
    type: MovieActionTypes.addMoviesData,
    payload,
  }),
  removeSingle: (payload: string): MovieAction$RemoveSingle => ({
    type: MovieActionTypes.removeSingleMovie,
    payload,
  }),
  clearMovieData: (): MovieAction$Clear => ({ type: MovieActionTypes.clearMovieData }),
};

export const fetchMovieData = ({
  movieId,
  ttid,
  goTo = false,
}: {
  movieId?: string;
  ttid?: string;
  goTo?: boolean;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let request;
  if (movieId) {
    request = await MoviesApi.getById(movieId);
  } else if (ttid) {
    request = await MoviesApi.getByTtid(ttid);
  }

  if (request && request.data) {
    dispatch(MoviesActions.addMovieData(request.data));
    goTo && dispatch(push(`/movie/${movieId}`));
  }
};

export const searchMovies = (
  criteria: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const response = await MoviesApi.searchCriteria(criteria);

  if (response && response.data) dispatch(MoviesActions.addMoviesData(response.data));
  else dispatch(NotifyActions.error('Error retrieving movies from database.'));
};
