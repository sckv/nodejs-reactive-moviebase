import { Reducer } from 'redux';
import { MovieRequest } from 'types/movies-requesting.services';
import { MovieActionsUnion, MovieActionTypes } from '@src/store/actions/movies.actions';
import { Selector } from 'react-redux';
import { AppStoreState } from '@src/store/store';

export type MoviesReducerState = { current: MovieRequest; movies: MovieRequest[] };

const initialState = { current: {} as any, movies: [] };

export const MoviesReducer: Reducer<MoviesReducerState, MovieActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case MovieActionTypes.addMoviesData:
      return { ...state, movies: action.payload };
    case MovieActionTypes.addMovieData:
      return { ...state, current: action.payload };
    case MovieActionTypes.clearMovieData:
      return { ...state, current: {} } as typeof state;
    default:
      return state;
  }
};

export const MoviesSelector: Selector<AppStoreState, MoviesReducerState['movies']> = state => state.movies.movies;

export const MovieSelector: Selector<AppStoreState, MovieRequest> = state => state.movies.current;
