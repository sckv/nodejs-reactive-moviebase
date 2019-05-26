import React, { Suspense } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { UsersApi } from '@src/api/users.api';
import { createStyles, makeStyles } from '@material-ui/styles';
import { Theme, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckIcon from '@material-ui/icons/CheckTwoTone';
import FailIcon from '@material-ui/icons/CloseTwoTone';

import styled from '@emotion/styled';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
);

const RegistrationActivationBase = ({ match }: RouteComponentProps<{ token: string }>) => {
  const classes = useStyles();

  const ActivationComponent = async () => {
    const activationResponse = await UsersApi.activate(match.params.token);
    if (activationResponse && activationResponse.ok)
      return (
        <Typography>
          Your account have been activated! <CheckIcon style={{ color: 'green' }} />
        </Typography>
      );
    return (
      <Typography>
        Error ocurred during your activation! <FailIcon style={{ color: 'red' }} />
      </Typography>
    );
  };
  return (
    <Container>
      <Suspense fallback={<CircularProgress className={classes.progress} color="secondary" />}>
        {ActivationComponent()}
      </Suspense>
    </Container>
  );
};

export const RegistrationActivation = withRouter(RegistrationActivationBase);

const Container = styled.div`
  height: 95vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;
