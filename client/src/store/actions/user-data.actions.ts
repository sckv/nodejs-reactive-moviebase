import { ActionRich, Action, AppStoreState, ActionsUnion } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { UserFull, UserThin } from 'types/user-controlling.services';
import { UsersApi } from '@src/api/users.api';
import { LanguageType } from 'types/User.model';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';

export enum UserDataActionTypes {
  addUserData = '@@USER/ADD_USER_DATA',
  addUserSearchListData = '@@USER/ADD_USER_SEARCH_LIST_DATA',
  clearUserData = '@@USER/CLEAR_USER_DATA',
  clearUserSearchListData = '@@USER/CLEAR_USER_SEARCH_LIST_DATA',
}

export type UserDataAction$Add = ActionRich<typeof UserDataActionTypes.addUserData, Partial<UserFull>>;
export type UserDataAction$AddListData = ActionRich<
  typeof UserDataActionTypes.addUserSearchListData,
  Partial<UserThin[]>
>;
export type UserDataAction$Clear = Action<typeof UserDataActionTypes.clearUserData>;
export type UserDataAction$ClearListData = Action<typeof UserDataActionTypes.clearUserSearchListData>;

export type UserDataActionsUnion =
  | UserDataAction$Clear
  | UserDataAction$Add
  | UserDataAction$AddListData
  | UserDataAction$ClearListData;

export const UserDataActions = {
  addUserData: (payload: Partial<UserFull>): UserDataAction$Add => ({
    type: UserDataActionTypes.addUserData,
    payload,
  }),
  addSearchListData: (payload: Partial<UserThin[]>): UserDataAction$AddListData => ({
    type: UserDataActionTypes.addUserSearchListData,
    payload,
  }),
  clearUserData: (): UserDataAction$Clear => ({ type: UserDataActionTypes.clearUserData }),
  clearListData: (): UserDataAction$ClearListData => ({ type: UserDataActionTypes.clearUserSearchListData }),
};

// THUNKS

export const fetchUserData = (
  username: string,
): ThunkAction<void, AppStoreState, void, ActionsUnion> => async dispatch => {
  dispatch(UserDataActions.clearUserData());
  let userData: Partial<UserFull> = {} as any;
  let request;
  if (username)
    request = await UsersApi.getUserData({ username, pd: true, ld: true, md: true, followers: true, follows: true });

  if (request && request.data) userData = request.data;

  dispatch(UserDataActions.addUserData(userData));
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
