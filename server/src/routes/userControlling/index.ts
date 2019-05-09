import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as UsersControlling from '@src/handlers/users-controlling.handlers';
import {AuthRouteGuard} from '@src/utils/authorization-guard';

const index: RouteController = app => {
  app.route('/users/activate/:token').post(asyncWrapper(UsersControlling.activate));
  app.route('/users/register').post(asyncWrapper(UsersControlling.register));
  app.route('/users/:userId').post(asyncWrapper(UsersControlling.getUserData));
  app.route('/users/:userId').patch(asyncWrapper(AuthRouteGuard(UsersControlling.modifyUser)));
  app.route('/users/follow').post(asyncWrapper(UsersControlling.followUser));
  app.route('/users/unfollow').post(asyncWrapper(UsersControlling.unfollowUser));
  app.route('/users').get(asyncWrapper(UsersControlling.searchUsers));
};

export = index;
