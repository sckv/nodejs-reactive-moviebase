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
  ListItemText,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { fetchUserData, unfollowUser, followUser } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { UserFull, UserFollower } from 'types/user-controlling.services';
import { fetchListData } from '@src/store/actions/lists.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const userData = useSelector(UserDataSelectors.userData, shallowEqual);
  const authData = useSelector(AuthSelectors.auth, shallowEqual);

  useEffect(() => {
    !userData && dispatch(fetchUserData(match.params.username));
    userData && userData.username !== match.params.username && dispatch(fetchUserData(match.params.username));
  }, [match]);

  const isSelf = () => authData.username === userData.username;

  const isFollowable = () => {
    if (!userData || !authData || !authData.username) return null;
    if (isSelf()) return null;
    if (userData.followers && userData.followers.some(el => el.username === authData.username))
      return (
        <Button color="primary" onClick={() => dispatch(unfollowUser(userData._id!))}>
          Unfollow
        </Button>
      );
    return (
      <Button color="primary" onClick={() => dispatch(followUser(userData._id!))}>
        Follow
      </Button>
    );
  };

  console.log('userData', userData);
  return (
    <Grid container={true} spacing={7} className={classes.grid}>
      <Grid item={true} xs={12} sm={7}>
        <Card className={classes.card}>
          <CardHeader
            title={
              <div className={classes.cardTitleWButton}>
                <span>User data</span>
                {isFollowable()}
              </div>
            }
          />
          <CardContent>
            <Typography>Username: {userData.username}</Typography>
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader
            title={
              <div className={classes.cardTitleWButton}>
                <span>Lists data</span>
                {isSelf() ? <Button color="primary">Create new list</Button> : null}
              </div>
            }
          />
          <CardContent>
            {userData.lists && userData.lists.length ? (
              <List component="nav">
                {invoke(userData.lists, 'map', (list: UserFull['lists'][0], idx: number) => {
                  <ListItem
                    onClick={() => dispatch(fetchListData({ listId: list._id, goTo: true }))}
                    key={`mov+${idx}`}
                  >
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
        <Card>
          <CardHeader title={'Movies data'} />
          <CardContent>
            {userData.ratedMovies && userData.ratedMovies.length ? (
              <List component="nav">
                {invoke(userData.ratedMovies, 'map', (movie: UserFull['ratedMovies'][0], idx: number) => {
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
      </Grid>
      <Grid item={true} xs={12} sm={5}>
        <Card className={classes.card}>
          <CardHeader title={'Followers'} />
          <CardContent>
            {userData.followers && userData.followers.length ? (
              <List component="nav">
                {invoke(userData.followers, 'map', (follower: UserFollower, idx: number) => {
                  <ListItem key={`follwr+${idx}`}>
                    <ListItemText primary={follower.username} onClick={() => fetchUserData(follower.username, true)} />
                  </ListItem>;
                })}
              </List>
            ) : (
              <Typography color="secondary">No followers</Typography>
            )}
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader title={'Follows'} />
          <CardContent>
            {userData.follows && userData.follows.length ? (
              <List component="nav">
                {invoke(userData.follows, 'map', (follow: UserFollower, idx: number) => {
                  <ListItem key={`follow+${idx}`}>
                    <ListItemText primary={follow.username} onClick={() => fetchUserData(follow.username, true)} />
                  </ListItem>;
                })}
              </List>
            ) : (
              <Typography color="secondary">No follows</Typography>
            )}
          </CardContent>
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
  cardTitleWButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
