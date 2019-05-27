import { Container, Grid, Card, CardHeader } from '@material-ui/core';
import { MoviesApi } from '@src/api/movies.api';
import { MovieCard } from '@src/modules/home-page/components/home-movie-tile';
import { useStreamFetch } from '@src/utils/use-stream-fetch';

import React, { useState, useEffect } from 'react';
import { MovieRequestThin } from 'types/movies-requesting.services';
import { SearchMoviesObject } from 'types/movies.repository';
import invoke from 'lodash/invoke';
import { useSelector, shallowEqual } from 'react-redux';
import { MoviesSelectors } from '@src/store/reducers/movies.reducer';
import { makeStyles } from '@material-ui/styles';

type Props = {
  sort: SearchMoviesObject['sort'];
  children?: never;
};

export const HomePage = (props: Props) => {
  const movies = useSelector(MoviesSelectors.movies, shallowEqual);
  const [sort, setSort] = useState<SearchMoviesObject['sort']>('latest');
  const classes = useStyles();

  useStreamFetch(() => MoviesApi.searchStream({ sort }) as any);

  useEffect(() => {
    if (props.sort) setSort(props.sort);
  }, [props.sort]);

  return (
    <Container>
      <Grid container={true} spacing={3}>
        <Grid item={true} xs={9}>
          <Card className={classes.title}>
            <CardHeader title="Browse movies stored in the database" />
          </Card>
          {invoke(movies, 'map', (m: MovieRequestThin, idx: number) => {
            return <MovieCard {...m} key={(m._id as any) || idx} />;
          })}
        </Grid>
      </Grid>
    </Container>
  );
};

const useStyles = makeStyles({
  title: {
    marginTop: 15,
  },
});
