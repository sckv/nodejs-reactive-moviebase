import { Global } from '@emotion/core';
import { Typography } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
// import { MoviesApi } from '@src/api/movies.api';
import { AppLoadingSquare, AppLoadingWrapper, globalStyles, ThemedCircular } from '@src/App.styles';
import { store } from '@src/store/create-store';
import { HeaderBar } from '@src/ui/header-bar';
// import { useStreamFetch } from '@src/utils/use-stream-fetch';
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
// import { hot } from 'react-hot-loader';
import { lightGreen } from '@material-ui/core/colors';
import { ErrorHandler } from '@src/ui/error-handler';
import { Router } from '@src/Routes';

// const rendered = 0;
export const App = () => {
  const [resolvedStore, setStore] = useState<Store>(null as any);
  // const [moviesData, setMoviesData] = useState<any>([]);

  // rendered++;
  useEffect(() => {
    const awaitForStore = async () => {
      const resolved = await store();
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

// export default App;
