import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { history } from '@src/store/create-store';
import { HomePage } from '@src/modules/home-page/home-page';

export const Router = () => {
  <ConnectedRouter history={history}>
    <Switch>
      <Route exact={true} path="/home" component={HomePage} />
    </Switch>
  </ConnectedRouter>;
};
