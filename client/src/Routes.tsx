import React from 'react';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';
import { HomePage } from '@src/modules/home-page/home-page';
import { AuthSelector } from '@src/store/reducers/auth.reducer';
import { RouteProps } from 'react-router';
import { history } from '@src/store/create-store';
import { NotifyActions } from '@src/store/actions/notification.actions';

export const Router = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path="/" component={HomePage} />
      <GuardUnAuthRoute exact={true} path="/login" component={HomePage} />
      <GuardAuthRoute exact={true} path="/panel" component={HomePage} />
      <GuardUnAuthRoute exact={true} path="/activate/:token" component={HomePage} />
      <GuardUnAuthRoute exact={true} path="/restore/:token" component={HomePage} />
      <Route exact={true} path="/user/:username" component={HomePage} />
      <Route exact={true} path="/user/:username/lists" component={HomePage} />
      <Route exact={true} path="/user/:username/list/:listId" component={HomePage} />
      <Route exact={true} path="/user/:username/follows" component={HomePage} />
      <Route exact={true} path="/user/:username/followers" component={HomePage} />
      <Route exact={true} path="/user/:username/followers" component={HomePage} />
      <Route exact={true} path="/user/:username/movies" component={HomePage} />
      <Route exact={true} path="/movie/:movieId" component={HomePage} />
    </Switch>
  </ConnectedRouter>
);

const GuardAuthRouteBase = ({ location, match, staticContext, ...props }: RouteComponentProps<any> & RouteProps) => {
  const auth = useSelector(AuthSelector, shallowEqual);
  const dispatch = useDispatch();
  if (!auth.userId) {
    dispatch(NotifyActions.error('No access.'));
    return <Redirect to={location} />;
  }
  return <Route {...props} />;
};

const GuardAuthRoute = withRouter(GuardAuthRouteBase);

const GuardUnAuthRouteBase = ({ location, match, staticContext, ...props }: RouteComponentProps<any> & RouteProps) => {
  const auth = useSelector(AuthSelector, shallowEqual);
  const dispatch = useDispatch();
  if (auth.userId) {
    dispatch(NotifyActions.error('No access.'));
    return <Redirect to={location} />;
  }
  return <Route {...props} />;
};

const GuardUnAuthRoute = withRouter(GuardUnAuthRouteBase);
