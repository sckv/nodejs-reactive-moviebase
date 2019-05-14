import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';
import { AppStoreState } from '@src/store/store';
import { AuthReducer } from '@src/store/reducers/auth.reducer';
import { MovieReducer } from '@src/store/reducers/movie.reducer';


export const reducers = (history: History): Reducer => {
  const appReducers: Reducer = (state, action) => {
    if (action.type === {}) state = undefined;
    const combi = combineReducers<AppStoreState>({
      router: connectRouter(history),
      auth: AuthReducer,
      movie: MovieReducer,
    });
    return combi(state, action);
  };
  return (state, action) => appReducers(state, action);
};
