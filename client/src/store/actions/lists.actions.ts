import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { ListEntry } from 'types/listing.services';
import { ListsApi } from '@src/api/lists.api';

export enum ListActionTypes {
  addListData = '@@LIST/ADD_LIST_DATA',
  addListsData = '@@LIST/ADD_MULTIPLE_LISTS',
  clearListData = '@@LIST/CLEAR_LIST_DATA',
}

export type ListAction$Add = ActionRich<typeof ListActionTypes.addListData, ListEntry>;
export type ListAction$AddLists = ActionRich<typeof ListActionTypes.addListsData, ListEntry[]>;
export type ListAction$Clear = Action<typeof ListActionTypes.clearListData>;
export type ListActionsUnion = ListAction$Clear | ListAction$Add | ListAction$AddLists;

export const ListActions = {
  addListData: (payload: ListEntry): ListAction$Add => ({
    type: ListActionTypes.addListData,
    payload,
  }),
  addListsData: (payload: ListEntry[]): ListAction$AddLists => ({
    type: ListActionTypes.addListsData,
    payload,
  }),
  clearListData: (): ListAction$Clear => ({ type: ListActionTypes.clearListData }),
};

export const fetchListData = (
  listId: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let listData: ListEntry = {} as any;
  let request;
  if (listId) request = await ListsApi.getList(listId);

  if (request && request.data) listData = request.data;

  dispatch(ListActions.addListData(listData));
};

export const fetchUserListsData = (
  userId: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let listsData: ListEntry[] = [];
  let request;
  if (userId) request = await ListsApi.getUserLists(userId);

  if (request && request.data) listsData = request.data;

  dispatch(ListActions.addListsData(listsData));
};
