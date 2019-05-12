import { env } from '@src/global/env';
import { reducers } from '@src/store/root-reducer';
import { loadState } from '@src/utils/persist-state';
import { routerMiddleware } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';
import { applyMiddleware, compose, createStore, DeepPartial } from 'redux';
import thunk from 'redux-thunk';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
    __REACT_DEVTOOLS_GLOBAL_HOOK__: any;
  }
}

export const history = createHistory();

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && env !== 'production'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const middlewares = [thunk, routerMiddleware(history)];
export let dispatcher = (_: any) => _;
export const makeDispatcher = (dispatch: any) => {
  if (dispatch && typeof dispatch === 'function') dispatcher = dispatch;
  else dispatcher = (...args: any) => console.log('NO_DISPATCH_INSTANTIATED', args);
};

export const store = async () => {
  const persistentStore = (await loadState()) as DeepPartial<{}>;
  let logger;
  if (env !== 'production') {
    const { createLogger } = await import('redux-logger');
    logger = createLogger({ collapsed: true });
  }
  if (logger) middlewares.push(logger);
  const newStore = createStore(
    reducers(history) as any,
    persistentStore !== null ? persistentStore : {},
    composeEnhancers(applyMiddleware(...middlewares)),
  );
  makeDispatcher(newStore.dispatch);
  return newStore;
};
