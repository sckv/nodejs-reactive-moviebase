import styled from '@emotion/styled';
import {
  InputAdornment,
  TextField,
  Theme,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import LockIcon from '@material-ui/icons/Lock';
import { createStyles, makeStyles } from '@material-ui/styles';
import { AuthApi } from '@src/api/auth.api';
import React, { useEffect, useRef, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotifyActions } from '@src/store/actions/notification.actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: { margin: theme.spacing(2) },
    middleBox: {
      display: 'flex',
      flexDirection: 'column',
    },
    input: {
      margin: '10px 0',
    },
  }),
);

const PasswordRestoreBase = ({ match }: RouteComponentProps<{ token: string }>) => {
  const { token } = match.params;
  const classes = useStyles({});
  const [resetToken, setResetToken] = useState<string | null>(null);

  const registerPasswordRef = useRef<HTMLInputElement>();
  const registerPasswordRepeatRef = useRef<HTMLInputElement>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const dispatch = useDispatch();
  const checkPasswords = () => {
    if (!registerPasswordRepeatRef.current!.value) return;
    setPasswordsMatch(registerPasswordRef.current!.value === registerPasswordRepeatRef.current!.value);
  };

  useEffect(() => {
    if (match) CheckToken();
  }, [match]);

  const CheckToken = async () => {
    const restoreResponse = await AuthApi.checkRecoveryToken(token);
    if (restoreResponse && restoreResponse.ok) setResetToken(restoreResponse.data.resetToken);
  };
  return (
    <Container>
      <Typography component="div" variant="h4">
        {!resetToken && <CircularProgress className={classes.progress} color="secondary" />}
        {resetToken && (
          <Card>
            <CardHeader title="Set new password" />
            <CardContent className={classes.middleBox}>
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
                  if (passwordsMatch) {
                    AuthApi.setNewPassword(resetToken, registerPasswordRef.current!.value);
                    dispatch(NotifyActions.success("If everything's ok, just login with your new password"));
                  }
                }}
              >
                Reset password
              </Button>
            </CardActions>
          </Card>
        )}
      </Typography>
    </Container>
  );
};

export const PasswordRestore = withRouter(PasswordRestoreBase);

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
