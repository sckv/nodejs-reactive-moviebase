import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as AuthHandlers from '@src/handlers/authorizing.handlers';
import {AuthRouteGuard} from '@src/utils/authorization-guard';

const index: RouteController = app => {
  app.route('/login').post(asyncWrapper(AuthHandlers.login));
  app.route('/logout').post(asyncWrapper(AuthRouteGuard(AuthHandlers.logout)));
  app.route('/forgot').post(asyncWrapper(AuthHandlers.forgot));
  app.route('/check-recovery/:token').post(asyncWrapper(AuthHandlers.checkRecoveryToken));
  app.route('/reset-password/:token').post(asyncWrapper(AuthHandlers.resetPassword));
};

export = index;
