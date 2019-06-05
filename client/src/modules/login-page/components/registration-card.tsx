import { Button, Card, CardActions, CardContent, CardHeader, InputAdornment, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import RegIcon from '@material-ui/icons/HowToReg';
import LockIcon from '@material-ui/icons/Lock';
import { useLoginStyles } from '@src/modules/login-page/login-page';
import { NotifyActions } from '@src/store/actions/notification.actions';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerAction } from '@src/store/actions/common.actions';
import { AuthApi } from '@src/api/auth.api';

export const RegistrationCard = () => {
  const registerUsernameRef = useRef<HTMLInputElement>();
  const registerEmailRef = useRef<HTMLInputElement>();
  const registerPasswordRef = useRef<HTMLInputElement>();
  const registerPasswordRepeatRef = useRef<HTMLInputElement>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [forgetMode, setForgetMode] = useState(false);

  const recoveryEmailRef = useRef<HTMLInputElement>();

  const dispatch = useDispatch();

  const classes = useLoginStyles();

  const checkPasswords = () => {
    if (!registerPasswordRepeatRef.current!.value) return;
    setPasswordsMatch(registerPasswordRef.current!.value === registerPasswordRepeatRef.current!.value);
  };
  return (
    <>
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
              if (
                !registerEmailRef.current!.value &&
                !registerPasswordRef.current!.value &&
                !registerUsernameRef.current!.value
              )
                return dispatch(NotifyActions.error("Regitration fields can't be empty."));
              if (!passwordsMatch) return dispatch(NotifyActions.error('Regitration passwords do not match.'));
              if (!registerUsernameRef.current!.value)
                return dispatch(NotifyActions.error('Regitration username is empty.'));
              if (!registerEmailRef.current!.value) return dispatch(NotifyActions.error('Regitration email is empty.'));

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
          <div style={{ flexGrow: 1 }} />
          <Button variant={forgetMode ? 'outlined' : 'contained'} onClick={() => setForgetMode(!forgetMode)}>
            Forgot Password?
          </Button>
        </CardActions>
      </Card>
      {forgetMode ? (
        <Card style={{ marginTop: 15 }}>
          <CardHeader
            title={
              <>
                <span style={{ marginRight: 15 }}>Your email</span>
                <TextField type="email" inputRef={recoveryEmailRef} />
              </>
            }
          />
          <CardActions>
            <Button
              variant="contained"
              onClick={() => {
                if (!recoveryEmailRef.current!.value) dispatch(NotifyActions.error("Recovery email can't be empty."));
                else {
                  AuthApi.forgot(recoveryEmailRef.current!.value);
                  dispatch(NotifyActions.success('Recovery link is sent to your email if it is right.'));
                }
              }}
            >
              Recover password
            </Button>
          </CardActions>
        </Card>
      ) : null}
    </>
  );
};
