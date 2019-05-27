import { Reducer } from 'redux';
import { Selector } from 'react-redux';
import { AppStoreState } from '@src/store/store';
import { UserFull, UserThin } from 'types/user-controlling.services';
import { UserDataActionTypes, UserDataActionsUnion } from '@src/store/actions/user-data.actions';

export type UserDataReducerState = { current: Partial<UserFull>; searchList: Partial<UserThin[]> };

const initialState: UserDataReducerState = {
  current: {},
  searchList: [],
};

export const UserDataReducer: Reducer<UserDataReducerState, UserDataActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case UserDataActionTypes.addUserData:
      return { ...state, users: action.payload };
    case UserDataActionTypes.addUserSearchListData:
      return { ...state, searchList: action.payload };
    case UserDataActionTypes.clearUserData:
      return { ...state, current: {} } as typeof state;
    case UserDataActionTypes.clearUserSearchListData:
      return { ...state, searchList: {} } as typeof state;
    default:
      return state;
  }
};

export const UserDataSelectors: { [k: string]: Selector<AppStoreState, any> } = {
  searchList: state => state.users.searchList,
  userData: state => state.users.current,
};
