import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@src/store/create-store';
import { Store } from 'redux';
import { Global } from '@emotion/core';
import { Typography } from '@material-ui/core';
import { AppLoadingWrapper, AppLoadingSquare, ThemedCircular, globalStyles } from '@src/App.styles';
import { useStreamFetch } from '@src/utils/use-stream-fetch';
import { MoviesApi } from '@src/api/movies.api';
import { HeaderBar } from '@src/ui/header-bar';

let rendered = 0;
export const App = () => {
  const [resolvedStore, setStore] = useState<Store>(null as any);
  const [moviesData, setMoviesData] = useState<any>([]);

  rendered++;
  useEffect(() => {
    const awaitForStore = async () => {
      const resolved = await store();
      console.log('resolved store>> ', resolved);
      setStore(resolved);
    };
    awaitForStore();
  }, []);

  useStreamFetch(() => MoviesApi.searchStream({ sort: 'latest' }) as any, setMoviesData);

  // TODO: fix typings

  console.log('data is>>>', moviesData);
  console.log('rendered>> ', rendered);

  if (resolvedStore) {
    return (
      <Provider store={resolvedStore}>
        <Global styles={globalStyles} />
        <HeaderBar />
        <div>HELLO</div>
      </Provider>
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
