import { RouterState } from 'connected-react-router';
import { AuthReducerState } from '@src/store/reducers/auth.reducer';
import { MovieReducerState } from '@src/store/reducers/movie.reducer';

export interface AppStoreState {
  router: RouterState;
  auth: AuthReducerState;
  movie: MovieReducerState;
}

export type Action<T> = {
  readonly type: T;
};

export type ActionRich<T, P> = {
  readonly type: T;
  payload: P;
};
