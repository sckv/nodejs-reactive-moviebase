import React, { useRef, useState } from 'react';
// import { useDispatch, useSelector, connect } from 'react-redux';
import { Grid, Card, CardHeader, CardContent, TextField, InputAdornment, CardActions, Button } from '@material-ui/core';
import LoginIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import RegIcon from '@material-ui/icons/HowToReg';
import EmailIcon from '@material-ui/icons/Email';
import { useDispatch } from 'react-redux';
import { loginAction } from '@src/store/actions/auth.actions';
import { registerAction } from '@src/store/actions/common.actions';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { makeStyles } from '@material-ui/styles';

export const LoginPage = () => {
  const loginUsernameRef = useRef<HTMLInputElement>();
  const loginPasswordRef = useRef<HTMLInputElement>();

  const registerUsernameRef = useRef<HTMLInputElement>();
  const registerEmailRef = useRef<HTMLInputElement>();
  const registerPasswordRef = useRef<HTMLInputElement>();
  const registerPasswordRepeatRef = useRef<HTMLInputElement>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const dispatch = useDispatch();

  const classes = useStyles();

  const checkPasswords = () => {
    if (!registerPasswordRepeatRef.current!.value) return;
    console.log(
      'checkoing passwords',
      registerPasswordRef.current!.value,
      registerPasswordRepeatRef.current!.value,
      registerPasswordRef.current!.value === registerPasswordRepeatRef.current!.value,
    );
    setPasswordsMatch(registerPasswordRef.current!.value === registerPasswordRepeatRef.current!.value);
  };

  return (
    <Grid container={true} spacing={10} className={classes.container}>
      <Grid item={true} xs={12} sm={6}>
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
              onClick={() =>
                dispatch(
                  loginAction({
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
      <Grid item={true} xs={12} sm={6}>
        <Card>
          <CardHeader avatar={<RegIcon />} title="Registration" subheader="Username, email and password are needed" />
          <CardContent className={classes.formCard}>
            <TextField
              className={classes.input}
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
              className={classes.input}
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
              className={classes.input}
              inputRef={registerPasswordRef}
              variant="standard"
              type="password"
              placeholder="Password"
              error={!passwordsMatch}
              onKeyUp={checkPasswords}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              className={classes.input}
              inputRef={registerPasswordRepeatRef}
              variant="standard"
              type="password"
              placeholder="Repeat password"
              error={!passwordsMatch}
              label={!passwordsMatch ? 'Passwords do not match' : null}
              onKeyUp={checkPasswords}
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
                if (!passwordsMatch) return dispatch(NotifyActions.error('Passwords do not match.'));
                if (!registerUsernameRef.current!.value) return dispatch(NotifyActions.error('Username is empty.'));
                if (!registerEmailRef.current!.value) return dispatch(NotifyActions.error('Email is empty.'));

                dispatch(
                  registerAction({
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

const useStyles = makeStyles({
  formCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '60%',
    minWidth: 160,
    margin: 25,
  },
  container: {
    padding: 15,
    width: '100%',
    margin: 0,
  },
});
