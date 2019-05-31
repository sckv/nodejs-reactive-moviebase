import { Reducer } from 'redux';
import { MovieRequest } from 'types/movies-requesting.services';
import { MovieActionsUnion, MovieActionTypes } from '@src/store/actions/movies.actions';
import { AppStoreState } from '@src/store/store';

export type MoviesReducerState = { current: MovieRequest; movies: MovieRequest[] };

const initialState = { current: {} as any, movies: [] };

export const MoviesReducer: Reducer<MoviesReducerState, MovieActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  console.log('action payload>>>', (action as any).payload);
  switch (action.type) {
    case MovieActionTypes.addMoviesData:
      return { ...state, movies: action.payload };
    case MovieActionTypes.addMovieData:
      return { ...state, current: action.payload };
    case MovieActionTypes.removeSingleMovie:
      return { ...state, movies: state.movies.filter(mv => (mv._id as any) !== action.payload) };
    case MovieActionTypes.clearMovieData:
      return { ...state, current: {} } as typeof state;
    default:
      return state;
  }
};

export const MoviesSelectors = {
  movies: (state: AppStoreState) => state.movies.movies,
  movie: (state: AppStoreState) => state.movies.current,
};
