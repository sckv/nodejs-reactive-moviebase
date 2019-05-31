import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { UserFull, UserThin } from 'types/user-controlling.services';
import { UsersApi } from '@src/api/users.api';
import { LanguageType } from 'types/User.model';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { push } from 'connected-react-router';

export enum UserDataActionTypes {
  addUserData = '@@USER/ADD_USER_DATA',
  addUserSearchListData = '@@USER/ADD_USER_SEARCH_LIST_DATA',
  removeListFromCurrent = '@@USER/REMOVE_LIST_FROM_CURRENT',
  clearUserData = '@@USER/CLEAR_USER_DATA',
  clearUserSearchListData = '@@USER/CLEAR_USER_SEARCH_LIST_DATA',
}

export type UserDataAction$Add = ActionRich<typeof UserDataActionTypes.addUserData, Partial<UserFull>>;
export type UserDataAction$AddListData = ActionRich<
  typeof UserDataActionTypes.addUserSearchListData,
  Partial<UserThin[]>
>;

export type UserDataAction$RemoveListFromCurrent = ActionRich<typeof UserDataActionTypes.removeListFromCurrent, string>;
export type UserDataAction$Clear = Action<typeof UserDataActionTypes.clearUserData>;
export type UserDataAction$ClearListData = Action<typeof UserDataActionTypes.clearUserSearchListData>;

export type UserDataActionsUnion =
  | UserDataAction$Clear
  | UserDataAction$Add
  | UserDataAction$AddListData
  | UserDataAction$ClearListData
  | UserDataAction$RemoveListFromCurrent;

export const UserDataActions = {
  addUserData: (payload: Partial<UserFull>): UserDataAction$Add => ({
    type: UserDataActionTypes.addUserData,
    payload,
  }),
  addSearchListData: (payload: Partial<UserThin[]>): UserDataAction$AddListData => ({
    type: UserDataActionTypes.addUserSearchListData,
    payload,
  }),
  removeListFromCurrent: (payload: string): UserDataAction$RemoveListFromCurrent => ({
    type: UserDataActionTypes.removeListFromCurrent,
    payload,
  }),
  clearUserData: (): UserDataAction$Clear => ({ type: UserDataActionTypes.clearUserData }),
  clearListData: (): UserDataAction$ClearListData => ({ type: UserDataActionTypes.clearUserSearchListData }),
};

// THUNKS

export const fetchUserData = (
  username: string,
  goTo: boolean = false,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let request;
  if (username)
    request = await UsersApi.getUserData({ username, pd: true, ld: true, md: true, followers: true, follows: true });

  if (request && request.data && request.status === 200) {
    dispatch(UserDataActions.addUserData(request.data));
    if (goTo) dispatch(push(`/user/${username}`));
  } else if (request) dispatch(NotifyActions.error((request.data as any).message));
};

export const fetchUserDataCustom = ({
  username,
  pd = false,
  ld = false,
  md = false,
  followers = false,
  follows = false,
  goTo = false,
}: {
  username: string;
  pd?: boolean;
  ld?: boolean;
  md?: boolean;
  followers?: boolean;
  follows?: boolean;
  goTo?: boolean;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  let request;
  if (username) request = await UsersApi.getUserData({ username, pd, ld, md, followers, follows });

  if (request && request.data && request.status === 200) {
    dispatch(UserDataActions.addUserData(request.data));
    if (goTo) dispatch(push(`/user/${username}`));
  } else if (request) dispatch(NotifyActions.error((request.data as any).message));
};

export const searchUsers = (
  username: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  dispatch(UserDataActions.clearListData());

  const response = await UsersApi.search(username);

  if (response && response.data) dispatch(UserDataActions.addSearchListData(response.data));
  else dispatch(NotifyActions.error('Error retrieving users from database.'));
};

export const modifyUser = ({
  password,
  language,
}: {
  password?: string;
  language?: LanguageType;
}): ThunkAction<void, AppStoreState, void, ActionsUnion> => async (dispatch, getState) => {
  const self = AuthSelectors.auth(getState());
  const response = await UsersApi.modify(self.userId, { password, language });

  if (response && response.ok) dispatch(NotifyActions.success('User data updated.'));
  else dispatch(NotifyActions.error('Error retrieving users from database.'));
};

export const followUser = (userId: string): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const response = await UsersApi.follow(userId);

  if (response && response.ok) dispatch(NotifyActions.success('User followed.'));
  else dispatch(NotifyActions.error('Error following user.'));
};

export const unfollowUser = (
  userId: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  const response = await UsersApi.unfollow(userId);

  if (response && response.ok) dispatch(NotifyActions.success('User unfollowed.'));
  else dispatch(NotifyActions.error('Error unfollowing user.'));
};
