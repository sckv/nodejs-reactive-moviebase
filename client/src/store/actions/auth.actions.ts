import { LoginResponseObject } from 'types/authorizing.services';
import { ActionRich, Action, AppStoreState } from '@src/store/store';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { AuthApi } from '@src/api/auth.api';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { push } from 'connected-react-router';

export enum AuthActionTypes {
  addLoginData = '@@AUTH/ADD_LOGIN_DATA',
  clearLoginData = '@@AUTH/CLEAR_LOGIN_DATA',
}

export type AuthAction$Login = ActionRich<
  typeof AuthActionTypes.addLoginData,
  LoginResponseObject & { userId: string }
>;
export type AuthAction$Clear = Action<typeof AuthActionTypes.clearLoginData>;
export type AuthActionsUnion = AuthAction$Clear | AuthAction$Login;

export const AuthActions = {
  addLoginData: (payload: LoginResponseObject & { userId: string }): AuthAction$Login => ({
    type: AuthActionTypes.addLoginData,
    payload,
  }),
  clearLoginData: (): AuthAction$Clear => ({ type: AuthActionTypes.clearLoginData }),
};

export const loginAction = (loginData: {
  username: string;
  password: string;
}): ThunkAction<void, AppStoreState, null, AnyAction> => async (dispatch, getState) => {
  if (AuthSelectors.auth(getState()).username)
    return dispatch(NotifyActions.error(`Can't login. Already logged as ${AuthSelectors.auth(getState()).username}`));

  const authData = await AuthApi.login(loginData);
  if (authData && authData.ok) {
    dispatch(push('/'));
    dispatch(AuthActions.addLoginData({ ...(authData.data as any) }));
    dispatch(NotifyActions.success(`Successfully authoirized as ${authData.data.username}`));
  } else dispatch(NotifyActions.error(`Error authorizing as ${loginData.username}`));
  return;
};

export const logoutAction = (): ThunkAction<void, AppStoreState, null, AnyAction> => async (dispatch, getState) => {
  if (!AuthSelectors.auth(getState()).username)
    return dispatch(NotifyActions.error(`Can't logout. Already logged out.`));
  dispatch(NotifyActions.success('Successfully logged out'));

  dispatch(push('/'));
  dispatch(AuthActions.clearLoginData());
  await AuthApi.logout();
  // if (logoutData && logoutData.ok) {

  // } else dispatch(NotifyActions.error('Error logging out'));
  return;
};
