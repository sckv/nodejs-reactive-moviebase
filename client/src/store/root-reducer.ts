import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { AppStoreState } from '@src/store/store';
import { AuthReducer } from '@src/store/reducers/auth.reducer';
import { MoviesReducer } from '@src/store/reducers/movies.reducer';
import { NotificationReducer } from '@src/store/reducers/notification.reducer';
import { ListsReducer } from '@src/store/reducers/lists.reducer';
import { UserDataReducer } from '@src/store/reducers/user-data.reducer';

export const reducers = (history: History): Reducer => {
  const appReducers: Reducer = (state, action) => {
    if (action.type === {}) state = undefined;
    const combi = combineReducers<AppStoreState>({
      router: connectRouter(history),
      auth: AuthReducer,
      movies: MoviesReducer,
      notification: NotificationReducer,
      lists: ListsReducer,
      users: UserDataReducer,
    });
    return combi(state, action);
  };
  return (state, action) => appReducers(state, action);
};
