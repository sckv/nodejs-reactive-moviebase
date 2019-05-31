import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationSelector, NotificationReducerState } from '@src/store/reducers/notification.reducer';
import { Snackbar } from '@material-ui/core';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { CustomSnackbar } from '@src/ui/notification/snackbar-content';

export const Notification = () => {
  const dispatch = useDispatch();
  const notificationState = useSelector(NotificationSelector, shallowEqual);
  const [local, setLocal] = useState<NotificationReducerState | null>(null);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (notificationState.message) {
      setLocal(notificationState);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [notificationState]);
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={local ? local.timeout || 7000 : 7000}
      onClose={() => dispatch(NotifyActions.close())}
      open={open}
      ContentProps={{ 'aria-describedby': 'message-id' }}
    >
      <CustomSnackbar
        variant={local ? local.status : 'notify'}
        message={local ? local.message : 'Generic mssage'}
        onClose={() => dispatch(NotifyActions.close())}
      />
    </Snackbar>
  );
  // else return null;
};
