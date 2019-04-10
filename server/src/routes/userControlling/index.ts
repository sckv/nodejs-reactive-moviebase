import {RouteController} from 'types/utils';

const index: RouteController = app => {
  app.route('/index').get((_, res) => {
    res.sendStatus(200);
  });
  app.route('/index').post((_, res) => {
    res.sendStatus(200);
  });
};

export = index;
