import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// import isEqual from 'react-fast-compare';
import { fetchUserData } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { UserFull } from 'types/user-controlling.services';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userData = useSelector(UserDataSelectors.userData, shallowEqual);

  useEffect(() => {
    !userData && dispatch(fetchUserData(match.params.username));
    userData && userData.username !== match.params.username && dispatch(fetchUserData(match.params.username));
  }, [match]);
  console.log('userData', userData);
  return (
    <Grid container={true} spacing={7} className={classes.grid}>
      <Grid item={true} xs={12} sm={7}>
        <Card className={classes.card}>
          <CardHeader title={'User data'} />
          <CardContent>
            <Typography>Username: {userData.username}</Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader title={'Movies data'} />
          <CardContent>
            {userData.movies && userData.movies.length ? (
              <List component="nav">
                {invoke(userData.movies, 'map', (movie: UserFull['movies'][0], idx: number) => {
                  <ListItem button={true} key={`mov+${idx}`}>
                    <ListItemText primary={movie.movie.title} secondary={movie.movie.year} />
                    <Typography>Comnment: {movie.comment}</Typography>
                    <Typography>Rated: {movie.rating}</Typography>
                  </ListItem>;
                })}
              </List>
            ) : (
              <Typography color="secondary">No rated movies</Typography>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader title={'Lists data'} />
          <CardContent>
            {userData.lists && userData.lists.length ? (
              <List component="nav">
                {invoke(userData.lists, 'map', (list: UserFull['lists'][0], idx: number) => {
                  <ListItem key={`mov+${idx}`}>
                    <ListItemText primary={list.title} secondary={list.description} />
                    {invoke(list.movies, 'map', (mov: typeof list.movies[0], idx2: number) => (
                      <img key={`poster-${idx2}`} src={mov.poster} />
                    ))}
                  </ListItem>;
                })}
              </List>
            ) : (
              <Typography color="secondary">No lists</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
      <Grid item={true} xs={12} sm={5}>
        <Card className={classes.card}>
          <CardHeader title={'Followers'} />
        </Card>
        <Card className={classes.card}>
          <CardHeader title={'Follows'} />
        </Card>
      </Grid>
    </Grid>
  );
};

export const UserPage = connect()(withRouter(UserPageBase));

const useStyles = makeStyles({
  grid: {
    padding: 25,
    width: '100%',
    margin: 0,
  },
  card: {
    marginBottom: 15,
  },
});
