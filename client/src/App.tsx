import { Global } from '@emotion/core';
import { Typography } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { AppLoadingSquare, AppLoadingWrapper, globalStyles, ThemedCircular } from '@src/App.styles';
import { store } from '@src/store/create-store';
import { HeaderBar } from '@src/ui/header-bar';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { lightGreen } from '@material-ui/core/colors';
import { ErrorHandler } from '@src/ui/error-handler';
import { Router } from '@src/Routes';
import { Notification } from '@src/ui/notification/notification';
import throttle from 'lodash/throttle';
import { saveState } from '@src/utils/persist-state';

const throttled = throttle(fn => fn(), 1000);
export const App = () => {
  const [resolvedStore, setStore] = useState<Store>(null as any);

  useEffect(() => {
    const awaitForStore = async () => {
      const resolved = await store();
      resolved.subscribe(() => {
        const { router, ...other } = resolved.getState();
        throttled(() => saveState({ ...other }));
      });
      console.log('resolved store>> ', resolved);
      setStore(resolved);
    };
    awaitForStore();
  }, []);

  // useStreamFetch(() => MoviesApi.searchStream({ sort: 'latest' }) as any, setMoviesData);

  // TODO: fix typings

  // console.log('data is>>>', moviesData);
  // console.log('rendered>> ', rendered);

  if (resolvedStore) {
    return (
      <ErrorHandler>
        <Provider store={resolvedStore}>
          <ThemeProvider theme={theme}>
            <Global styles={globalStyles} />
            <div className="background-wrapper" />
            <Notification />
            <HeaderBar />
            <Router />
          </ThemeProvider>
        </Provider>
      </ErrorHandler>
    );
  }
  return (
    <AppLoadingWrapper>
      <AppLoadingSquare>
        <ThemedCircular />
        <Typography>Accediendo a la aplicación....</Typography>
      </AppLoadingSquare>
    </AppLoadingWrapper>
  );
};

const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: blue,
  },
});
