import { Reducer } from 'redux';
import { AppStoreState } from '@src/store/store';
import { UserFull, UserThin } from 'types/user-controlling.services';
import { UserDataActionTypes, UserDataActionsUnion } from '@src/store/actions/user-data.actions';

export type UserDataReducerState = { current: Partial<UserFull>; searchList?: Partial<UserThin[]> };

const initialState: UserDataReducerState = {
  current: {},
  // searchList: [],
};

export const UserDataReducer: Reducer<UserDataReducerState, UserDataActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case UserDataActionTypes.addUserData:
      return { ...state, current: action.payload };
    case UserDataActionTypes.addUserSearchListData:
      return { ...state, searchList: action.payload };
    case UserDataActionTypes.removeListFromCurrent:
      return {
        ...state,
        current: { ...state.current, lists: state.current.lists!.filter(list => list._id !== action.payload) },
      };
    case UserDataActionTypes.clearUserData:
      return { ...state, current: {} } as typeof state;
    case UserDataActionTypes.clearUserSearchListData:
      return { ...state, searchList: undefined } as typeof state;
    default:
      return state;
  }
};

export const UserDataSelectors = {
  searchList: (state: AppStoreState) => state.users.searchList,
  userData: (state: AppStoreState) => state.users.current,
  userCurrentMovieLists: (state: AppStoreState) => state.users.current.lists,
};
