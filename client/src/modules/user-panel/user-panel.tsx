import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import {
  Container,
  Card,
  Grid,
  CardHeader,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { modifyUser } from '@src/store/actions/user-data.actions';

const UserPanelBase = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const authData = useSelector(AuthSelectors.auth, shallowEqual);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const passwordRef = useRef<HTMLInputElement>(null);
  const repeatPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLanguage(authData.language);
  }, []);

  const handleSave = () => {
    if (passwordRef.current!.value && passwordRef.current!.value !== repeatPasswordRef.current!.value)
      dispatch(NotifyActions.error('Passwords do not match'));
    else {
      dispatch(modifyUser({ language, password: passwordRef.current!.value }));
    }
  };
  return (
    <Container className="container">
      <Grid container={true} spacing={3} className={classes.grid}>
        <Grid item={true} xs={12}>
          <Card>
            <CardHeader
              title={
                <div className={classes.titleContainer}>
                  <span>User panel</span>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save data
                  </Button>
                </div>
              }
            />
          </Card>
        </Grid>
        <Grid item={true} xs={12}>
          <Card>
            <CardHeader title="Change Password" />
            <CardContent>
              <div className={classes.passwordContainer}>
                <TextField type="password" label="Password" inputRef={passwordRef} />
                <TextField type="password" label="Repeat password" inputRef={repeatPasswordRef} />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item={true} xs={12}>
          <Card>
            <CardHeader title="Change Language" />
            <CardContent>
              <div className={classes.langugeContainer}>
                <FormControl style={{ width: '100%' }}>
                  <InputLabel htmlFor="list">Movies plot language</InputLabel>
                  <Select
                    value={language}
                    onChange={e => setLanguage(e.target.value as any)}
                    inputProps={{
                      name: 'listId',
                      id: 'list',
                    }}
                  >
                    <MenuItem value={'en'}>EN</MenuItem> <MenuItem value={'es'}>ES</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export const UserPanel = connect()(UserPanelBase);

const useStyles = makeStyles({
  grid: {
    marginTop: 15,
  },
  langugeContainer: {
    width: 250,
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: 250,
    justifyContent: 'center',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
