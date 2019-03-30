import {RouteController} from '@src/types';

export const index: RouteController = app => {
  app.route('/index').get((_, res) => {
    res.sendStatus(200);
  });
  app.route('/index').post((_, res) => {
    res.sendStatus(200);
  });
};