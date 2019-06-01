import { Reducer } from 'redux';
import { NotifyActionTypes, NotifyActionsUnion } from '@src/store/actions/notification.actions';
import { AppStoreState } from '@src/store/store';
import { Selector } from 'react-redux';

export type NotificationReducerState = {
  message: string;
  timeout?: number;
  status: 'warning' | 'notify' | 'success' | 'error';
};

// TODO: notifications reducer
const initialState = {} as NotificationReducerState;

export const NotificationReducer: Reducer<NotificationReducerState, NotifyActionsUnion> = (
  state = initialState,
  action,
) => {
  if (!action) return state;
  switch (action.type) {
    case NotifyActionTypes.error:
      return { ...action.payload };
    case NotifyActionTypes.notify:
      return { ...action.payload };
    case NotifyActionTypes.warning:
      return { ...action.payload };
    case NotifyActionTypes.success:
      return { ...action.payload };
    case NotifyActionTypes.close:
      return {} as typeof state;
    default:
      return state;
  }
};

export const NotificationSelector: Selector<AppStoreState, NotificationReducerState> = state => state.notification;
