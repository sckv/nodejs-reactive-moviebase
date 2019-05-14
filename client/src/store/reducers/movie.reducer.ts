import { Reducer } from 'redux';
import { MovieRequest } from 'types/movies-requesting.services';
import { MovieActionsUnion, MovieActionTypes } from '@src/store/actions/movie.actions';

export type MovieReducerState = MovieRequest;

const initialState = {} as MovieRequest;

export const MovieReducer: Reducer<MovieReducerState, MovieActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case MovieActionTypes.addMovieData:
      return { ...action.payload };
    case MovieActionTypes.clearMovieData:
      return {} as typeof state;
    default:
      return state;
  }
};
