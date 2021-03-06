import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { ListEntry } from 'types/listing.services';
import { ListsApi } from '@src/api/lists.api';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { push } from 'connected-react-router';
import { fetchUserData, UserDataActions } from '@src/store/actions/user-data.actions';

export enum ListActionTypes {
  addListData = '@@LIST/ADD_LIST_DATA',
  addListsData = '@@LIST/ADD_MULTIPLE_LISTS',
  removeMovieFromCurrent = '@@LIST/REMOVE_MOVIE_FROM_CURRENT',
  clearListData = '@@LIST/CLEAR_LIST_DATA',
  clearListsData = '@@LIST/CLEAR_LISTS_DATA',
}

export type ListAction$Add = ActionRich<typeof ListActionTypes.addListData, ListEntry>;
export type ListAction$AddLists = ActionRich<typeof ListActionTypes.addListsData, Partial<ListEntry[]>>;
export type ListAction$RemoveMovieFromCurrent = ActionRich<typeof ListActionTypes.removeMovieFromCurrent, string>;
export type ListAction$Clear = Action<typeof ListActionTypes.clearListData>;
export type ListAction$ClearLists = Action<typeof ListActionTypes.clearListsData>;

export type ListActionsUnion =
  | ListAction$Clear
  | ListAction$Add
  | ListAction$AddLists
  | ListAction$ClearLists
  | ListAction$RemoveMovieFromCurrent;

export const ListsActions = {
  addListData: (payload: ListEntry): ListAction$Add => ({
    type: ListActionTypes.addListData,
    payload,
  }),
  addListsData: (payload: Partial<ListEntry[]>): ListAction$AddLists => ({
    type: ListActionTypes.addListsData,
    payload,
  }),
  removeListCurrent: (payload: string): ListAction$RemoveMovieFromCurrent => ({
    type: ListActionTypes.removeMovieFromCurrent,
    payload,
  }),
  removeMovieFromCurrent: (payload: string): ListAction$RemoveMovieFromCurrent => ({
    type: ListActionTypes.removeMovieFromCurrent,
    payload,
  }),
  clearListsData: (): ListAction$ClearLists => ({ type: ListActionTypes.clearListsData }),
  clearListData: (): ListAction$Clear => ({ type: ListActionTypes.clearListData }),
};

export const fetchListData = ({
  listId,
  goTo = false,
}: {
  listId: string;
  goTo?: boolean;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let listData: ListEntry = {} as any;
  let request;
  if (listId) request = await ListsApi.getList(listId);

  if (request && request.data && request.status === 200) {
    listData = request.data;
    dispatch(ListsActions.addListData(listData));

    goTo && dispatch(push(`/list/${listId}`));
  }
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
  username?: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.create(listData);
  if (request && request.ok) {
    dispatch(NotifyActions.success('List created'));
    listData.username && dispatch(fetchUserData(listData.username));
  } else dispatch(NotifyActions.error('List creation error'));
};

export const modifyList = ({
  listId,
  refetch,
  ...listData
}: {
  title: string;
  description: string;
  isPrivate: boolean;
  listId: string;
  refetch?: boolean;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.modifyList(listId, listData);

  if (request && request.ok) {
    dispatch(NotifyActions.success('List modified'));
    refetch && dispatch(fetchListData({ listId }));
  } else dispatch(NotifyActions.error('List modification error'));
};

export const deleteList = (listId: string): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.deleteList(listId);

  if (request && request.ok) {
    dispatch(NotifyActions.success('List deleted'));
    dispatch(UserDataActions.removeListFromCurrent(listId));
    dispatch(push('/'));
  } else dispatch(NotifyActions.error('List deletion error'));
};

export const removeMovieFromList = ({
  listId,
  movieId,
}: {
  movieId: string;
  listId: string;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const request = await ListsApi.removeFromList(listId, movieId);

  if (request && request.ok) {
    dispatch(ListsActions.removeMovieFromCurrent(movieId));
    dispatch(NotifyActions.success('Movie removed'));
  } else dispatch(NotifyActions.error('Movie removing error'));
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
