import React, { useEffect, useState } from 'react';
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
  const classes = useStyles({});
  const [activated, setActivated] = useState<'yes' | 'no' | null>(null);
  useEffect(() => {
    if (match) ActivationComponent();
  }, [match]);

  const ActivationComponent = async () => {
    const activationResponse = await UsersApi.activate(match.params.token);
    if (activationResponse && activationResponse.ok) setActivated('yes');
    else setActivated('no');
  };
  return (
    <Container>
      <Typography component="div" variant="h4">
        {typeof activated === null && <CircularProgress className={classes.progress} color="secondary" />}
        {activated === 'yes' && (
          <>
            Your account have been activated! <CheckIcon style={{ color: 'green' }} />
          </>
        )}

        {activated === 'no' && (
          <>
            An error ocurred during your activation! <FailIcon style={{ color: 'red' }} />
          </>
        )}
      </Typography>
    </Container>
  );
};

export const RegistrationActivation = withRouter(RegistrationActivationBase);

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
