import React from 'react';
import { Typography } from '@material-ui/core';

import styled from '@emotion/styled';

export const PasswordRestoreDone = () => (
  <Container>
    <Typography component="div" variant="h4">
      You have successfully restored your password. <br />
      Please login again.
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
