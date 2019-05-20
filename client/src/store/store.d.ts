import { RouterState } from 'connected-react-router';
import { AuthReducerState } from '@src/store/reducers/auth.reducer';
import { MovieReducerState } from '@src/store/reducers/movie.reducer';
import { NotificationReducerState } from '@src/store/reducers/notification.reducer';

export interface AppStoreState {
  router: RouterState;
  auth: AuthReducerState;
  movie: MovieReducerState;
  notification: NotificationReducerState;
}

export type Action<T> = {
  readonly type: T;
};

export type ActionRich<T, P> = {
  readonly type: T;
  payload: P;
};
