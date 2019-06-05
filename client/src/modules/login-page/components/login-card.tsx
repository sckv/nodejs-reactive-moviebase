import { Button, Card, CardActions, CardContent, CardHeader, InputAdornment, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import LoginIcon from '@material-ui/icons/VpnKey';
import { useLoginStyles } from '@src/modules/login-page/login-page';
import { loginAction } from '@src/store/actions/auth.actions';
import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NotifyActions } from '@src/store/actions/notification.actions';

export const LoginCard = () => {
  const loginUsernameRef = useRef<HTMLInputElement>();
  const loginPasswordRef = useRef<HTMLInputElement>();
  const classes = useLoginStyles();
  const dispatch = useDispatch();

  return (
    <Card>
      <CardHeader avatar={<LoginIcon />} title="Login" subheader="Username and password are needed" />
      <CardContent className={classes.formCard}>
        <TextField
          className={classes.input}
          inputRef={loginUsernameRef}
          variant="standard"
          type="text"
          placeholder="Username"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          className={classes.input}
          inputRef={loginPasswordRef}
          variant="standard"
          type="password"
          placeholder="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
          }}
        />
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          onClick={() => {
            if (!loginUsernameRef.current!.value && !loginPasswordRef.current!.value)
              return dispatch(NotifyActions.error("Login fields can't be empty."));
            if (!loginUsernameRef.current!.value) return dispatch(NotifyActions.error('Login username is empty.'));
            if (!loginPasswordRef.current!.value) return dispatch(NotifyActions.error('Login assword is empty.'));

            dispatch(
              loginAction({
                username: loginUsernameRef.current!.value,
                password: loginPasswordRef.current!.value,
              }),
            );
          }}
        >
          Login
        </Button>
      </CardActions>
    </Card>
  );
};
