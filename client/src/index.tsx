import React from 'react';
import ReactDOM from 'react-dom';
import { App } from '@src/App';
import { env } from '@src/global/env';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: blue,
  },
});

const renderer = env === 'production' ? ReactDOM.hydrate : ReactDOM.render;

renderer(
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>,
  document.getElementById('app'),
);
