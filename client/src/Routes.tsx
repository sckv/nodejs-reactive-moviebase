import React from 'react';
import { Route, Switch, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';

import { ConnectedRouter } from 'connected-react-router';
import { HomePage } from '@src/modules/home-page/home-page';
import { RouteProps } from 'react-router';
import { history } from '@src/store/create-store';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { PageNotFound } from '@src/ui/page-not-found';
import { ListPage } from '@src/modules/list-page/list-page';
import { UserPage } from '@src/modules/user-page/user-page';
import { LoginPage } from '@src/modules/login-page/login-page';
import { MoviePage } from '@src/modules/movie-page/movie-page';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { RegistrationActivation } from '@src/ui/registration-activation';
import { RegistrationDone } from '@src/ui/registration-done';
import { UserPanel } from '@src/modules/user-panel/user-panel';

export const Router = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path="/" component={HomePage} />
      <GuardUnAuthRoute exact={true} path="/login" component={LoginPage} />
      <GuardUnAuthRoute exact={true} path="/registration-ok" component={RegistrationDone} />
      <GuardAuthRoute exact={true} path="/panel" component={UserPanel} />
      <GuardUnAuthRoute exact={true} path="/activate/:token" component={RegistrationActivation} />
      <GuardUnAuthRoute exact={true} path="/restore/:token" component={HomePage} />
      <Route exact={true} path="/user/:username" component={UserPage} />
      <Route exact={true} path="/user/:username/lists" component={HomePage} />
      <Route exact={true} path="/user/:username/list/:listId" component={ListPage} />
      <Route exact={true} path="/user/:username/follows" component={HomePage} />
      <Route exact={true} path="/user/:username/followers" component={HomePage} />
      <Route exact={true} path="/user/:username/followers" component={HomePage} />
      <Route exact={true} path="/user/:username/movies" component={HomePage} />
      <Route exact={true} path="/movie/:movieId" component={MoviePage} />
      <Route component={PageNotFound} />
    </Switch>
  </ConnectedRouter>
);

const GuardAuthRouteBase = ({ location, match, staticContext, ...props }: RouteComponentProps<any> & RouteProps) => {
  const auth = useSelector(AuthSelectors.auth, shallowEqual);
  const dispatch = useDispatch();
  if (!auth.userId) {
    dispatch(NotifyActions.error('No access.'));
    return <Redirect to="/" />;
  }
  return <Route {...props} />;
};

const GuardAuthRoute = withRouter(GuardAuthRouteBase);

const GuardUnAuthRouteBase = ({ location, match, staticContext, ...props }: RouteComponentProps<any> & RouteProps) => {
  const auth = useSelector(AuthSelectors.auth, shallowEqual);
  const dispatch = useDispatch();
  if (auth.userId) {
    dispatch(NotifyActions.error('No access.'));
    return <Redirect to="/" />;
  }
  return <Route {...props} />;
};

const GuardUnAuthRoute = withRouter(GuardUnAuthRouteBase);
