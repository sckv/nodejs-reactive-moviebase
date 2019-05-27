import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { ListEntry } from 'types/listing.services';
import { ListsApi } from '@src/api/lists.api';
import { NotifyActions } from '@src/store/actions/notification.actions';

export enum ListActionTypes {
  addListData = '@@LIST/ADD_LIST_DATA',
  addListsData = '@@LIST/ADD_MULTIPLE_LISTS',
  clearListData = '@@LIST/CLEAR_LIST_DATA',
  clearListsData = '@@LIST/CLEAR_LISTS_DATA',
}

export type ListAction$Add = ActionRich<typeof ListActionTypes.addListData, ListEntry>;
export type ListAction$AddLists = ActionRich<typeof ListActionTypes.addListsData, ListEntry[]>;
export type ListAction$Clear = Action<typeof ListActionTypes.clearListData>;
export type ListAction$ClearLists = Action<typeof ListActionTypes.clearListsData>;

export type ListActionsUnion = ListAction$Clear | ListAction$Add | ListAction$AddLists | ListAction$ClearLists;

export const ListsActions = {
  addListData: (payload: ListEntry): ListAction$Add => ({
    type: ListActionTypes.addListData,
    payload,
  }),
  addListsData: (payload: ListEntry[]): ListAction$AddLists => ({
    type: ListActionTypes.addListsData,
    payload,
  }),
  clearListsData: (): ListAction$ClearLists => ({ type: ListActionTypes.clearListsData }),
  clearListData: (): ListAction$Clear => ({ type: ListActionTypes.clearListData }),
};

export const fetchListData = (
  listId: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let listData: ListEntry = {} as any;
  let request;
  if (listId) request = await ListsApi.getList(listId);

  if (request && request.data) listData = request.data;

  dispatch(ListsActions.addListData(listData));
};

export const fetchUserListsData = (
  userId: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let listsData: ListEntry[] = [];
  let request;
  if (userId) request = await ListsApi.getUserLists(userId);

  if (request && request.data) listsData = request.data;

  dispatch(ListsActions.addListsData(listsData));
};

export const createList = (listData: {
  title: string;
  description: string;
  isPrivate: boolean;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.create(listData);

  if (request && request.ok) dispatch(NotifyActions.success('List created'));
  else dispatch(NotifyActions.error('List creation error'));
};

export const patchList = ({
  listId,
  ...listData
}: {
  title: string;
  description: string;
  isPrivate: boolean;
  listId: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.modifyList(listId, listData);

  if (request && request.ok) dispatch(NotifyActions.success('List modified'));
  else dispatch(NotifyActions.error('List modification error'));
};

export const deleteList = (listId: string): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.deleteList(listId);

  if (request && request.ok) dispatch(NotifyActions.success('List deleted'));
  else dispatch(NotifyActions.error('List deletion error'));
};

export const removeMovieFromList = ({
  listId,
  movieId,
}: {
  movieId: string;
  listId: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.removeFromList(listId, movieId);

  if (request && request.ok) dispatch(NotifyActions.success('List modified'));
  else dispatch(NotifyActions.error('List modification error'));
};

export const addMovieToList = ({
  listId,
  ...movieData
}: {
  movieId: string;
  commentary?: string;
  rate?: number;
  listId: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.addToList(listId, movieData);

  if (request && request.ok) dispatch(NotifyActions.success('Movie added to list'));
  else dispatch(NotifyActions.error('Movie addition to list error'));
};
