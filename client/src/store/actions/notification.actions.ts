import { ActionRich, Action } from '@src/store/store';
import { NotificationReducerState } from '@src/store/reducers/notification.reducer';

export enum NotifyActionTypes {
  warning = '@@NOTIF/WARNING',
  notify = '@@NOTIF/NOTIFY',
  success = '@@NOTIF/SUCCESS',
  error = '@@NOTIF/ERROR',
  close = '@@NOTIF/CLOSE',
}

export type NotifyAction$Warning = ActionRich<typeof NotifyActionTypes.warning, NotificationReducerState>;
export type NotifyAction$Notify = ActionRich<typeof NotifyActionTypes.notify, NotificationReducerState>;
export type NotifyAction$Success = ActionRich<typeof NotifyActionTypes.success, NotificationReducerState>;
export type NotifyAction$Error = ActionRich<typeof NotifyActionTypes.error, NotificationReducerState>;

export type NotifyAction$Close = Action<typeof NotifyActionTypes.close>;
export type NotifyActionsUnion =
  | NotifyAction$Warning
  | NotifyAction$Notify
  | NotifyAction$Success
  | NotifyAction$Error
  | NotifyAction$Close;

export const NotifyActions = {
  success: (message: string, timeout?: number): NotifyAction$Success => ({
    type: NotifyActionTypes.success,
    payload: { message, timeout, status: 'success' },
  }),
  warning: (message: string, timeout?: number): NotifyAction$Warning => ({
    type: NotifyActionTypes.warning,
    payload: { message, timeout, status: 'warning' },
  }),
  notify: (message: string, timeout?: number): NotifyAction$Notify => ({
    type: NotifyActionTypes.notify,
    payload: { message, timeout, status: 'notify' },
  }),
  error: (message: string, timeout?: number): NotifyAction$Error => ({
    type: NotifyActionTypes.error,
    payload: { message, timeout, status: 'error' },
  }),
  close: (): NotifyAction$Close => ({
    type: NotifyActionTypes.close,
  }),
};
