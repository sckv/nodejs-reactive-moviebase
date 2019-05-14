import { RouteController } from 'types/utils';
import { asyncWrapper } from '@src/utils';
import * as UsersControlling from '@src/handlers/users-controlling.handlers';
import { AuthRouteGuard } from '@src/utils/authorization-guard';

const index: RouteController = app => {
  app.route('/activate/:token').post(asyncWrapper(UsersControlling.activate));
  app.route('/register').post(asyncWrapper(UsersControlling.register));
  app.route('/user').post(asyncWrapper(UsersControlling.getUserData));
  app.route('/:userId').patch(asyncWrapper(AuthRouteGuard(UsersControlling.modifyUser)));
  app.route('/follow').post(asyncWrapper(UsersControlling.followUser));
  app.route('/unfollow').post(asyncWrapper(UsersControlling.unfollowUser));
  app.route('/').get(asyncWrapper(UsersControlling.searchUsers));
};

export = index;
