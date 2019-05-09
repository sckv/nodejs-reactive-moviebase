import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as AuthHandlers from '@src/handlers/authorizing.handlers';
import {AuthRouteGuard} from '@src/utils/authorization-guard';
const index: RouteController = app => {
  app.route('/auth/login').post(asyncWrapper(AuthHandlers.login));
  app.route('/auth/logout').post(asyncWrapper(AuthRouteGuard(AuthHandlers.logout)));
  app.route('/auth/forgot').post(asyncWrapper(AuthHandlers.forgot));
  app.route('/auth/check-recovery/:token').post(asyncWrapper(AuthHandlers.checkRecoveryToken));
  app.route('/auth/reset-password/:token').post(asyncWrapper(AuthHandlers.resetPassword));
};

export = index;
