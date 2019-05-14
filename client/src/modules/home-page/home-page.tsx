import { Container, Grid, Typography } from '@material-ui/core';
import { MoviesApi } from '@src/api/movies.api';
import { MovieCard } from '@src/modules/home-page/components/home-movie-tile';
import { useStreamFetch } from '@src/utils/use-stream-fetch';
import React, { useState, forwardRef } from 'react';
import { MovieRequestThin } from 'types/movies-requesting.services';
import { SearchMoviesObject } from 'types/movies.repository';
import invoke from 'lodash/invoke';
import Slide from '@material-ui/core/Slide';

let oldMoviesLength = 0;
export const HomePage = () => {
  const [movies, setMovies] = useState<MovieRequestThin[]>([]);
  const [sort, setSort] = useState<SearchMoviesObject['sort']>('latest');
  useStreamFetch(() => MoviesApi.searchStream({ sort }) as any, setMovies);
  const render = (
    <Container>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={9}>
          <Typography>Browse movies stored in the database</Typography>
          {invoke(movies, 'map', (m: MovieRequestThin, idx: number) => {
            if (movies.length > oldMoviesLength && oldMoviesLength !== 0 && idx === movies.length - 1) {
              const Forwarded = forwardRef((props, ref) => (
                <MovieCard {...m} key={(m._id as any) || idx} {...props} forwardedRef={ref} />
              ));
              return (
                <Slide timeout={700} appear={true} in={true} direction="right" key={m._id as any} mountOnEnter={true}>
                  <Forwarded />
                </Slide>
              );
            }
            return <MovieCard {...m} key={(m._id as any) || idx} />;
          })}
        </Grid>
        <Grid item={true} xs={3}>
          asd
        </Grid>
      </Grid>
    </Container>
  );

  oldMoviesLength = movies.length;

  return render;
};
