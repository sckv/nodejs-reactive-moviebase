import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as ListingHandlers from '@src/handlers/listing.handlers';
import {AuthRouteGuard} from '@src/utils/authorization-guard';

const index: RouteController = app => {
  app.route('/lists/:listId/add-to').patch(asyncWrapper(AuthRouteGuard(ListingHandlers.addMovie)));
  app.route('/lists/:listId/remove-from').post(asyncWrapper(AuthRouteGuard(ListingHandlers.removeMovie)));
  app.route('/lists/:userId/get').get(asyncWrapper(ListingHandlers.getByUserId));
  app.route('/lists/:listId').patch(asyncWrapper(AuthRouteGuard(ListingHandlers.modifyList)));
  app.route('/lists/:listId').get(asyncWrapper(ListingHandlers.getList));
  app.route('/lists').post(asyncWrapper(AuthRouteGuard(ListingHandlers.createList)));
  app.route('/lists/:listId').delete(asyncWrapper(AuthRouteGuard(ListingHandlers.deleteList)));
};

export = index;
