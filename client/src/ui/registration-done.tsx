import React from 'react';
import { Typography } from '@material-ui/core';

import styled from '@emotion/styled';

export const RegistrationDone = () => (
  <Container>
    <Typography component="div" variant="h4">
      You have successfully registered, we sent a message to your email. <br />
      Please activate your account.
    </Typography>
  </Container>
);

const Container = styled.div`
  height: calc(100vh - 50px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
