import { Container, Grid, Typography } from '@material-ui/core';
import { MoviesApi } from '@src/api/movies.api';
import { MovieCard } from '@src/modules/home-page/components/home-movie-tile';
import { useStreamFetch } from '@src/utils/use-stream-fetch';

import React, { useState, useEffect } from 'react';
import { MovieRequestThin } from 'types/movies-requesting.services';
import { SearchMoviesObject } from 'types/movies.repository';
import invoke from 'lodash/invoke';

type Props = {
  sort: SearchMoviesObject['sort'];
  children?: never;
};

export const HomePage = (props: Props) => {
  const [movies, setMovies] = useState<MovieRequestThin[]>([]);
  const [sort, setSort] = useState<SearchMoviesObject['sort']>('latest');
  useStreamFetch(() => MoviesApi.searchStream({ sort }) as any, setMovies);
  useEffect(() => {
    if (props.sort) setSort(props.sort);
  }, [props.sort]);

  return (
    <Container>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={9}>
          <Typography variant="h6">Browse movies stored in the database</Typography>
          {invoke(movies, 'map', (m: MovieRequestThin, idx: number) => {
            return <MovieCard {...m} key={(m._id as any) || idx} />;
          })}
        </Grid>
      </Grid>
    </Container>
  );
};
