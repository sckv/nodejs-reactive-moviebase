import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { useFetch } from '@src/utils/use-fetch';
import { MoviesApi } from '@src/api/movies.api';
import { Grid, Card, CardHeader, Typography, CardContent, CardMedia, Divider } from '@material-ui/core';
import invoke from 'lodash/invoke';
import { MovieRequest } from 'types/movies-requesting.services';

const OBJECT_ID_LENGTH = 25;

const MoviePageBase = ({ match }: RouteComponentProps<{ movieId: string }>) => {
  const { movieId } = match.params;

  const MovieData = () => {
    if (!movieId) return null;
    const { data } = useFetch<MovieRequest>(() =>
      movieId.length === OBJECT_ID_LENGTH ? (MoviesApi.getById(movieId) as any) : (MoviesApi.getByTtid(movieId) as any),
    );
    if (data)
      return (
        <Grid container={true} spacing={8}>
          <Grid item={true} xs={7}>
            <Card>
              <CardHeader title={data.title} subheader={data.year} />
              <CardContent>
                <Typography>{data.plot}</Typography>
                <Typography>{data.description}</Typography>
                <Typography>Average rating: {data.averageRate}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={5}>
            <Card draggable={false}>
              <CardMedia image={data.poster} />
            </Card>
          </Grid>
          <Grid item={true} xs={12}>
            {data.rate && (
              <Card>
                <CardContent>
                  <Typography>Rate: {data.rate}</Typography>
                  <Typography>Comment: {data.comment}</Typography>
                </CardContent>
              </Card>
            )}
            <Card>
              {invoke(data.ratedBy, 'map', (item: MovieRequest['ratedBy'][0]) => (
                <Divider>
                  <Typography>{item.comment}</Typography>
                  <Typography>{item.rate}</Typography>
                </Divider>
              ))}
            </Card>
          </Grid>
        </Grid>
      );
    return null;
  };
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <MovieData />
    </Suspense>
  );
};

export const MoviePage = connect()(withRouter(MoviePageBase));
