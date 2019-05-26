import { Reducer } from 'redux';
import { ListEntry } from 'types/listing.services';
import { ListActionTypes } from '@src/store/actions/lists.actions';

export type ListsReducerState = {
  lists: ListEntry[];
  current: ListEntry;
};

const initialState = { current: {} as any, lists: [] };

export const ListsReducer: Reducer<ListsReducerState, any> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case ListActionTypes.addListsData:
      return { ...state, lists: action.payload };
    case ListActionTypes.addListData:
      return { ...state, current: action.payload };
    case ListActionTypes.clearListData:
      return { ...state, current: {} } as typeof state;
    default:
      return state;
  }
};
