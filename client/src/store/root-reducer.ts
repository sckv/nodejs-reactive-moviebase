import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers, Reducer } from 'redux';

export const reducers = (history: History): Reducer => {
  const appReducers: Reducer = (state, action) => {
    if (action.type === {}) state = undefined;
    const combi = combineReducers({
      router: connectRouter(history) as any,
    });
    return combi(state, action);
  };
  return (state, action) => appReducers(state, action);
};
