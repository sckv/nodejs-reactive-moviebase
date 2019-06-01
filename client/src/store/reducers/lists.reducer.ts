import { Reducer } from 'redux';
import { ListEntry } from 'types/listing.services';
import { ListActionTypes, ListActionsUnion } from '@src/store/actions/lists.actions';
import { AppStoreState } from '@src/store/store';

export type ListsReducerState = {
  lists: Partial<ListEntry[]>;
  current: ListEntry;
};

const initialState = { current: {} as any, lists: [] };

export const ListsReducer: Reducer<ListsReducerState, ListActionsUnion> = (state = initialState, action) => {
  if (!action) return state;
  switch (action.type) {
    case ListActionTypes.addListsData:
      return { ...state, lists: action.payload };
    case ListActionTypes.addListData:
      return { ...state, current: action.payload };
    case ListActionTypes.removeMovieFromCurrent:
      return {
        ...state,
        current: { ...state.current, movies: state.current.movies.filter(mv => (mv._id as any) !== action.payload) },
      };
    case ListActionTypes.clearListData:
      return { ...state, current: {} } as typeof state;
    default:
      return state;
  }
};

export const ListsSelectors = {
  lists: (state: AppStoreState) => state.lists.lists,
  current: (state: AppStoreState) => state.lists.current,
};
