import {RouteController} from 'types/utils';
import {asyncWrapper} from '@src/utils';
import * as ListingHandlers from '@src/handlers/listing.handlers';
import {AuthRouteGuard} from '@src/utils/authorization-guard';

const index: RouteController = app => {
  app.route('/:listId/add-to').patch(asyncWrapper(AuthRouteGuard(ListingHandlers.addMovie)));
  app.route('/:listId/remove-from').post(asyncWrapper(AuthRouteGuard(ListingHandlers.removeMovie)));
  app.route('/:userId/get').get(asyncWrapper(ListingHandlers.getByUserId));
  app.route('/:listId').patch(asyncWrapper(AuthRouteGuard(ListingHandlers.modifyList)));
  app.route('/:listId').get(asyncWrapper(ListingHandlers.getList));
  app.route('/').post(asyncWrapper(AuthRouteGuard(ListingHandlers.createList)));
  app.route('/:listId').delete(asyncWrapper(AuthRouteGuard(ListingHandlers.deleteList)));
};

export = index;
