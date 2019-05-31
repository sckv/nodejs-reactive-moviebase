import React, { useEffect, useState, useRef } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
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
  Container,
  Menu,
  TextField,
  Switch,
  Avatar,
  ListItemAvatar,
  Divider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { fetchUserData, unfollowUser, followUser } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { UserFull, UserFollower } from 'types/user-controlling.services';
import { fetchListData, createList } from '@src/store/actions/lists.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { fetchMovieData } from '@src/store/actions/movies.actions';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const { username } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const userData = useSelector(UserDataSelectors.userData);
  const authData = useSelector(AuthSelectors.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [switchCheck, setSwitch] = useState<boolean>(false);

  useEffect(() => {
    !userData && dispatch(fetchUserData(username));
    userData && userData.username !== username && dispatch(fetchUserData(username));
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCreate = () => {
    if (!titleRef.current!.value) return dispatch(NotifyActions.error('No title for the list'));
    dispatch(
      createList({
        title: titleRef.current!.value.trim(),
        description: (descriptionRef.current!.value || '').trim(),
        isPrivate: switchCheck,
        username,
      }),
    );
    handleClose();
  };

  return (
    <Container className="container">
      <Grid container={true} spacing={7} className={classes.grid}>
        <Grid item={true} xs={12} sm={12} md={7}>
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
              <div className={classes.userDataEntry}>
                <span style={{ marginRight: 15 }}>Username: </span>
                <Typography variant="h6" component="span">
                  {' '}
                  {userData.username}
                </Typography>
              </div>
              {userData.email && (
                <>
                  {' '}
                  <Divider />
                  <div className={classes.userDataEntry}>
                    <span style={{ marginRight: 15 }}>Email: </span>
                    <Typography variant="h6" component="span">
                      {' '}
                      {userData.email}
                    </Typography>
                  </div>
                </>
              )}
              {userData.language && (
                <>
                  <Divider />
                  <div className={classes.userDataEntry}>
                    <span style={{ marginRight: 15 }}>Language: </span>
                    <Typography variant="h6" component="span">
                      {' '}
                      {userData.language}
                    </Typography>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardHeader
              title={
                <div className={classes.cardTitleWButton}>
                  <span>Lists data</span>
                  {isSelf() ? (
                    <Button
                      color="primary"
                      aria-owns={anchorEl ? 'simple-menu' : undefined}
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      Create new list
                    </Button>
                  ) : null}
                </div>
              }
            />
            <CardContent>
              {console.log(userData.lists)}
              {userData.lists && userData.lists.length ? (
                <List component="div">
                  {invoke(userData.lists, 'map', (list: UserFull['lists'][0], idx: number) => (
                    <ListItem
                      button={true}
                      onClick={() => dispatch(fetchListData({ listId: list._id, goTo: true }))}
                      key={`mov+${idx}`}
                    >
                      {console.log('list item>>', list)}
                      <ListItemText primary={list.title} secondary={list.description} />
                      {list.movies && list.movies.length ? (
                        invoke(list.movies, 'map', (mov: typeof list.movies[0], idx2: number) => (
                          <img key={`poster-${idx2}`} src={mov.poster} />
                        ))
                      ) : (
                        <Typography>No movies in the list</Typography>
                      )}
                    </ListItem>
                  ))}
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
                <List component="div">
                  {invoke(userData.ratedMovies, 'map', (movie: UserFull['ratedMovies'][0], idx: number) => (
                    <ListItem
                      button={true}
                      key={`mov+${idx}`}
                      onClick={() => dispatch(fetchMovieData({ movieId: movie._id, goTo: true }))}
                    >
                      <ListItemAvatar>
                        <Avatar alt={movie.title} src={movie.poster} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={movie.title}
                        secondary={
                          <div>
                            <Typography>Comment: {movie.comment}</Typography>
                            <Typography>Rated: {movie.rate}</Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="secondary">No rated movies</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={5}>
          <Card className={classes.card}>
            <CardHeader title={'Followers'} />
            <CardContent>
              {userData.followers && userData.followers.length ? (
                <List component="div">
                  {invoke(userData.followers, 'map', (follower: UserFollower, idx: number) => (
                    <ListItem
                      key={`follwr+${idx}`}
                      button={true}
                      onClick={() => dispatch(fetchUserData(follower.username, true))}
                    >
                      <ListItemText
                        primary={
                          <Typography component="span" variant="h6">
                            {follower.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
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
                <List component="div">
                  {invoke(userData.follows, 'map', (follow: UserFollower, idx: number) => (
                    <ListItem
                      key={`follow+${idx}`}
                      button={true}
                      onClick={() => dispatch(fetchUserData(follow.username, true))}
                    >
                      <ListItemText
                        primary={
                          <Typography component="span" variant="h6">
                            {follow.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="secondary">No follows</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <div className={classes.listCreateDialog}>
          <Typography variant="h6" component="span">
            New list
          </Typography>
          <TextField label="Title" inputRef={titleRef} className={classes.listCreateField} />
          <TextField label="Description" inputRef={descriptionRef} className={classes.listCreateField} />
          <div className={classes.listCreateSwitchContainer}>
            <Typography component="span">Is Private</Typography>
            <Switch checked={switchCheck} onChange={e => setSwitch(e.target.checked)} value="checked" color="primary" />
          </div>
          <Button variant="contained" color="primary" className={classes.listCreateButton} onClick={handleCreate}>
            Create
          </Button>
        </div>
      </Menu>
    </Container>
  );
};

export const UserPage = connect()(withRouter(UserPageBase));

const useStyles = makeStyles({
  grid: {
    padding: 0,
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
  userDataEntry: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listCreateDialog: {
    height: 250,
    width: 200,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    '& span:nth-child(1)': {
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  },
  listCreateField: {
    margin: '7px 0px',
  },
  listCreateSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    textTransform: 'initial',
  },
  listCreateButton: {
    margin: '7px 0px',
  },
});
