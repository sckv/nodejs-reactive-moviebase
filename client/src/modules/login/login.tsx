import React, { useRef, useState } from 'react';
// import { useDispatch, useSelector, connect } from 'react-redux';
import { Grid, Card, CardHeader, CardContent, TextField, InputAdornment, CardActions, Button } from '@material-ui/core';
import LoginIcon from '@material-ui/icons/VpnKeyTwoTone';
import AccountCircleIcon from '@material-ui/icons/AccountCircleTwoTone';
import LockIcon from '@material-ui/icons/LockTwoTone';
import RegIcon from '@material-ui/icons/HowToRegTwoTone';
import EmailIcon from '@material-ui/icons/EmailTwoTone';

export const Login = () => {
  const loginUsernameRef = useRef<HTMLInputElement>();
  const loginPasswordRef = useRef<HTMLInputElement>();

  const registerUsernameRef = useRef<HTMLInputElement>();
  const registerEmailRef = useRef<HTMLInputElement>();
  const registerPasswordRef = useRef<HTMLInputElement>();
  const registerPasswordRepeatRef = useRef<HTMLInputElement>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);

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
            <Button variant="contained">Login</Button>
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
              error={!passwordsMatch}
              onKeyPress={checkPasswords}
              placeholder="Repeat password"
            />
          </CardContent>
          <CardActions>
            <Button variant="contained">Register</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};
