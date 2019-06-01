import { LanguageType } from 'types/User.model';
import { Reducer } from 'redux';
import { AuthActionTypes, AuthActionsUnion } from '@src/store/actions/auth.actions';
import { AppStoreState } from '@src/store/store';

export type AuthReducerState = {
  userId: string;
  language: LanguageType;
  username: string;
};

const initialState = {} as AuthReducerState;

export const AuthReducer: Reducer<AuthReducerState, AuthActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case AuthActionTypes.addLoginData: {
      const { language, userId, username } = action.payload;
      return { ...{ language, userId, username } };
    }
    case AuthActionTypes.clearLoginData:
      return {} as typeof state;
    default:
      return state;
  }
};

export const AuthSelectors = { auth: (state: AppStoreState) => state.auth };
