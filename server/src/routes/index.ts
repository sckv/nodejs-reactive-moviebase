import {RouteController} from 'types/utils';

const index: RouteController = app => {
  app.route('/health').get((_, res) => {
    res.sendStatus(200);
  });
  app.route('/health').post((request, res) => {
    res.status(200).send(request.body);
    // res.sendStatus(200);
  });
};
export = index;
