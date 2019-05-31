import React, { Suspense, useEffect } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  Grid,
  Card,
  CardHeader,
  Typography,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Container,
  CardActions,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import invoke from 'lodash/invoke';
import { MovieRequest } from 'types/movies-requesting.services';
import { MoviesSelectors } from '@src/store/reducers/movies.reducer';
import { fetchMovieData } from '@src/store/actions/movies.actions';
import { makeStyles } from '@material-ui/styles';
import { AddToListMenu } from '@src/modules/movie-page/components/add-to-list-button';

const OBJECT_ID_LENGTH = 24;

const MoviePageBase = ({ match }: RouteComponentProps<{ movieId: string }>) => {
  const { movieId } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const movieData = useSelector(MoviesSelectors.movie, shallowEqual);

  useEffect(() => {
    dispatch(fetchMovieData(OBJECT_ID_LENGTH === movieId.length ? { movieId } : { ttid: movieId }));
  }, [movieId]);

  return (
    <Container className="container">
      <Grid container={true} spacing={5} className={classes.grid}>
        <Grid item={true} xs={12} md={7}>
          <Card className={classes.mainCard}>
            <Paper>
              <CardHeader
                title={
                  <div className={classes.cardTitleWButton}>
                    <span>{movieData.title}</span>
                  </div>
                }
                subheader={movieData.year + ' - ' + movieData.description}
              />
              <CardContent>
                <Typography component="p" style={{ marginBottom: 10 }}>
                  {movieData.plot}
                </Typography>
                <Divider />
                <Typography component="p" style={{ marginTop: 10 }}>
                  Average rating: {movieData.averageRate}
                </Typography>
              </CardContent>
              <CardActions style={{ flexDirection: 'row-reverse' }}>
                <AddToListMenu isRated={Boolean(movieData.rate && movieData.rate.length)} />
              </CardActions>
            </Paper>
          </Card>
          {movieData.rate && movieData.rate.length ? (
            <Card className={classes.mainCard}>
              <CardContent>
                <Typography>My rate: {movieData.rate}</Typography>
                <Typography>Comment: {movieData.comment}</Typography>
              </CardContent>
            </Card>
          ) : null}
          <Card>
            <CardHeader title="Users ratings" />
            <CardContent>
              {movieData.ratedBy && movieData.ratedBy.length
                ? invoke(movieData.ratedBy, 'map', (item: MovieRequest['ratedBy'][0]) => (
                    <ListItem>
                      <ListItemText primary={item.comment} secondary={`Rating: ${item.rate}`} />
                      {/* <Typography>{item.comment}</Typography>
                      <Typography>{item.rate}</Typography> */}
                    </ListItem>
                  ))
                : 'No ratings'}
            </CardContent>
          </Card>
        </Grid>
        <Grid item={true} xs={12} md={5}>
          <Card draggable={false} className={classes.imageCard}>
            <CardMedia image={movieData.poster} style={{ height: '85vh' }} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export const MoviePage = connect()(withRouter(MoviePageBase));

const useStyles = makeStyles({
  grid: {
    padding: 0,
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
  cardTitleWButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
