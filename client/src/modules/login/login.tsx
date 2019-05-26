import React, { useRef, useState } from 'react';
// import { useDispatch, useSelector, connect } from 'react-redux';
import { Grid, Card, CardHeader, CardContent, TextField, InputAdornment, CardActions, Button } from '@material-ui/core';
import LoginIcon from '@material-ui/icons/VpnKeyTwoTone';
import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import LockIcon from '@material-ui/icons/LockTwoTone';
import RegIcon from '@material-ui/icons/HowToRegTwoTone';
import EmailIcon from '@material-ui/icons/EmailTwoTone';
import { useDispatch } from 'react-redux';
import { LoginActionThunk } from '@src/store/actions/auth.actions';
import { RegisterThunkAction } from '@src/store/actions/common.actions';
import { NotifyActions } from '@src/store/actions/notification.actions';

export const Login = () => {
  const loginUsernameRef = useRef<HTMLInputElement>();
  const loginPasswordRef = useRef<HTMLInputElement>();

  const registerUsernameRef = useRef<HTMLInputElement>();
  const registerEmailRef = useRef<HTMLInputElement>();
  const registerPasswordRef = useRef<HTMLInputElement>();
  const registerPasswordRepeatRef = useRef<HTMLInputElement>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const dispatch = useDispatch();

  const checkPasswords = () => {
    if (!registerPasswordRepeatRef.current!.value) return;
    setPasswordsMatch(registerPasswordRef.current!.value === registerPasswordRepeatRef.current!.value);
  };

  return (
    <Grid container={true} spacing={10}>
      <Grid item={true} xs={6}>
        <Card>
          <CardHeader avatar={<LoginIcon />} title="Login" subheader="Username and password are needed" />
          <CardContent>
            <TextField
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
              onClick={() =>
                dispatch(
                  LoginActionThunk({
                    username: loginUsernameRef.current!.value,
                    password: loginPasswordRef.current!.value,
                  }),
                )
              }
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </Grid>
      <Grid item={true} xs={6}>
        <Card>
          <CardHeader avatar={<RegIcon />} title="Registration" subheader="Username, email and password are needed" />
          <CardContent>
            <TextField
              inputRef={registerUsernameRef}
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
              inputRef={registerEmailRef}
              variant="standard"
              type="email"
              placeholder="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              inputRef={registerPasswordRef}
              variant="standard"
              type="password"
              placeholder="Password"
              error={!passwordsMatch}
              onKeyPress={checkPasswords}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              inputRef={registerPasswordRepeatRef}
              variant="standard"
              type="password"
              placeholder="Repeat password"
              error={!passwordsMatch}
              label={!passwordsMatch ? 'Passwords do not match' : null}
              onKeyPress={checkPasswords}
            />
          </CardContent>
          <CardActions>
            <Button
              variant="contained"
              onClick={() => {
                if (!passwordsMatch) return dispatch(NotifyActions.error('Passwords do not match.'));
                if (!registerUsernameRef.current!.value) return dispatch(NotifyActions.error('Username is empty.'));
                if (!registerEmailRef.current!.value) return dispatch(NotifyActions.error('Email is empty.'));

                dispatch(
                  RegisterThunkAction({
                    email: registerEmailRef.current!.value,
                    password: registerPasswordRef.current!.value,
                    username: registerUsernameRef.current!.value,
                  }),
                );
              }}
            >
              Register
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};
