import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { LoginCard } from '@src/modules/login-page/components/login-card';
import { RegistrationCard } from '@src/modules/login-page/components/registration-card';
import React from 'react';

export const LoginPage = () => {
  const classes = useLoginStyles();

  return (
    <Container className="container">
      <Grid container={true} spacing={10} className={classes.container}>
        <Grid item={true} xs={12} sm={6}>
          <LoginCard />
        </Grid>
        <Grid item={true} xs={12} sm={6}>
          <RegistrationCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export const useLoginStyles = makeStyles({
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
    padding: 0,
    width: '100%',
    margin: 0,
  },
});
