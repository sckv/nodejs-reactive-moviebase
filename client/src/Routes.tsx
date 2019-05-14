import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '@src/store/create-store';
import { HomePage } from '@src/modules/home-page/home-page';

export const Router = () => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path="/" component={HomePage} />
    </Switch>
  </ConnectedRouter>
);
