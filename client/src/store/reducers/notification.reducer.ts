// import { Reducer } from 'redux';
// import { NotifyActionTypes } from '@src/store/actions/notification.actions';

export type NotificationReducerState = {
  message: string;
  timeout?: number;
  status: 'warning' | 'notify' | 'success' | 'error';
};

// TODO: notifications reducer
// const initialState = {} as NotificationReducerState;

// export const MovieReducer: Reducer<NotificationReducerState> = (state = initialState, action) => {
//   if (!action) return state;
//   switch (action.type) {
//     case NotifyActionTypes.error
//|| NotifyActionTypes.notify || NotifyActionTypes.warning || NotifyActionTypes.success:
//       return { ...action.payload };
//     case NotifyActionTypes.close:
//       return {} as typeof state;
//     default:
//       return state;
//   }
// };
