import { ActionRich, Action } from '@src/store/store';
import { MovieRequest } from 'types/movies-requesting.services';

export enum MovieActionTypes {
  addMovieData = '@@MOVIE/ADD_MOVIE_DATA',
  clearMovieData = '@@MOVIE/CLEAR_MOVIE_DATA',
}

export type MovieAction$Login = ActionRich<typeof MovieActionTypes.addMovieData, MovieRequest>;
export type MovieAction$Clear = Action<typeof MovieActionTypes.clearMovieData>;
export type MovieActionsUnion = MovieAction$Clear | MovieAction$Login;

export const AuthActions = {
  addMovieData: (payload: MovieRequest): MovieAction$Login => ({
    type: MovieActionTypes.addMovieData,
    payload,
  }),
  clearMovieData: (): MovieAction$Clear => ({ type: MovieActionTypes.clearMovieData }),
};
