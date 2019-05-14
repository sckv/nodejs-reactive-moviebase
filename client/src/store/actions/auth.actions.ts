import { LoginResponseObject } from 'types/authorizing.services';
import { ActionRich, Action } from '@src/store/store';

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
