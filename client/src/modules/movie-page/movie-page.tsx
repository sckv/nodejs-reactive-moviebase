import React, { Suspense, useEffect } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Card, CardHeader, Typography, CardContent, CardMedia, Divider, Paper } from '@material-ui/core';
import invoke from 'lodash/invoke';
import { MovieRequest } from 'types/movies-requesting.services';
import { MoviesSelectors } from '@src/store/reducers/movies.reducer';
import { fetchMovieData } from '@src/store/actions/movies.actions';
import { makeStyles } from '@material-ui/styles';

const OBJECT_ID_LENGTH = 24;

const MoviePageBase = ({ match }: RouteComponentProps<{ movieId: string }>) => {
  const { movieId } = match.params;

  const classes = useStyles();
  const dispatch = useDispatch();
  const movieData = useSelector(MoviesSelectors.movie, shallowEqual);

  useEffect(() => {
    console.log('movie id', movieId, movieId.length);
    dispatch(fetchMovieData(OBJECT_ID_LENGTH === movieId.length ? { movieId } : { ttid: movieId }));
  }, [movieId]);

  const MovieData = () => {
    if (!movieData) return null;
    else
      return (
        <Grid container={true} spacing={5} className={classes.grid}>
          <Grid item={true} xs={12} md={7}>
            <Card className={classes.mainCard}>
              <Paper>
                <CardHeader title={movieData.title} subheader={movieData.year} />
                <CardContent>
                  <Typography>{movieData.plot}</Typography>
                  <Typography>{movieData.description}</Typography>
                  <Typography>Average rating: {movieData.averageRate}</Typography>
                </CardContent>
              </Paper>
            </Card>
            {movieData.rate && (
              <Card>
                <CardContent>
                  <Typography>Rate: {movieData.rate}</Typography>
                  <Typography>Comment: {movieData.comment}</Typography>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent>
                {movieData.ratedBy && movieData.ratedBy.length
                  ? invoke(movieData.ratedBy, 'map', (item: MovieRequest['ratedBy'][0]) => (
                      <Divider>
                        <Typography>{item.comment}</Typography>
                        <Typography>{item.rate}</Typography>
                      </Divider>
                    ))
                  : 'No ratings'}{' '}
              </CardContent>
            </Card>
          </Grid>
          <Grid item={true} xs={12} md={5}>
            <Card draggable={false} className={classes.imageCard}>
              <CardMedia image={movieData.poster} style={{ height: '85vh' }} />
            </Card>
          </Grid>
        </Grid>
      );
  };

  return (
    <Suspense fallback={<div>Loading....</div>}>
      <MovieData />
    </Suspense>
  );
};

export const MoviePage = connect()(withRouter(MoviePageBase));

const useStyles = makeStyles({
  grid: {
    padding: 25,
    // margin: 0,
    width: '100%',
    margin: 0,
  },
  mainCard: {
    marginBottom: 20,
  },
  imageCard: {
    maxWidth: 510,
    margin: 'auto',
  },
});
