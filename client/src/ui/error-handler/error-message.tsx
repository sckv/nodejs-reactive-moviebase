import {Button} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from '@emotion/styled';

export const ErrorMessage = () => {
  return (
    <Div>
      <div style={{display: 'flex', flexDirection: 'column', height: 100, margin: 'auto'}}>
        <Typography variant="h3" style={{textAlign: 'center', marginBottom: 10}}>
          Ha sucedido un error.
        </Typography>
        <Button variant="outlined" component="a" href={'/'}>
          Volver a la página de inicio
        </Button>
      </div>
    </Div>
  );
};

const Div = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
  width: 900px;
  height: 500px;
`;
