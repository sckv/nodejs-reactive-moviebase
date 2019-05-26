import { RouterState, CallHistoryMethodAction } from 'connected-react-router';
import { AuthReducerState } from '@src/store/reducers/auth.reducer';
import { MoviesReducerState } from '@src/store/reducers/movies.reducer';
import { NotificationReducerState } from '@src/store/reducers/notification.reducer';
import { AuthActionsUnion } from '@src/store/actions/auth.actions';
import { MovieActionsUnion } from '@src/store/actions/movies.actions';
import { NotifyActionsUnion } from '@src/store/actions/notification.actions';
import { ListsReducerState } from '@src/store/reducers/lists.reducer';

export interface AppStoreState {
  router: RouterState;
  auth: AuthReducerState;
  movies: MoviesReducerState;
  notification: NotificationReducerState;
  lists: ListsReducerState;
}

export type ActionsUnion =
  | AuthActionsUnion
  | MovieActionsUnion
  | NotifyActionsUnion
  | ListActionsUnion
  | CallHistoryMethodAction<[string, any?]>;

export type Action<T> = {
  readonly type: T;
};

export type ActionRich<T, P> = {
  readonly type: T;
  payload: P;
};
