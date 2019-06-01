import React, { useEffect, useState, useRef } from 'react';
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
  Container,
  Menu,
  TextField,
  Switch,
  Divider,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/styles';
import { fetchUserData, unfollowUser, followUser } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { UserFull } from 'types/user-controlling.services';
import { fetchListData, createList } from '@src/store/actions/lists.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { fetchMovieData } from '@src/store/actions/movies.actions';

import { UserPageFollowList } from '@src/modules/user-page/components/user-page-follow-lists';
import { UserPageRatedMovies } from '@src/modules/user-page/components/user-page-rated-movies';
import { UserPageSearch } from '@src/modules/user-page/components/user-page-search';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const { username } = match.params;
  const classes = useStyles({});
  const dispatch = useDispatch();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const userData = useSelector(UserDataSelectors.userData, shallowEqual);
  const authData = useSelector(AuthSelectors.auth, shallowEqual);

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
        <Button color="primary" onClick={() => dispatch(unfollowUser(userData._id!, username))}>
          Unfollow
        </Button>
      );
    return (
      <Button color="primary" onClick={() => dispatch(followUser(userData._id!, username))}>
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
      <Grid container={true} spacing={3} className={classes.grid}>
        <Grid item={true} xs={12} sm={12} md={12}>
          <UserPageSearch />
        </Grid>
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
                    <>
                      <Button
                        color="primary"
                        aria-owns={anchorEl ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                      >
                        Create new list
                      </Button>
                      <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                        <div className={classes.listCreateDialog}>
                          <Typography variant="h6" component="span">
                            New list
                          </Typography>
                          <TextField label="Title" inputRef={titleRef} className={classes.listCreateField} />
                          <TextField
                            label="Description"
                            inputRef={descriptionRef}
                            className={classes.listCreateField}
                          />
                          <div className={classes.listCreateSwitchContainer}>
                            <Typography component="span">Is Private</Typography>
                            <Switch
                              checked={switchCheck}
                              onChange={e => setSwitch(e.target.checked)}
                              value="checked"
                              color="primary"
                            />
                          </div>
                          <Button
                            variant="contained"
                            color="primary"
                            className={classes.listCreateButton}
                            onClick={handleCreate}
                          >
                            Create
                          </Button>
                        </div>
                      </Menu>
                    </>
                  ) : null}
                </div>
              }
            />
            <CardContent>
              {userData.lists && userData.lists.length ? (
                <List component="div">
                  {invoke(userData.lists, 'map', (list: UserFull['lists'][0], idx: number) => (
                    <ListItem
                      button={true}
                      onClick={() => dispatch(fetchListData({ listId: list._id, goTo: true }))}
                      key={`mov+${idx}`}
                    >
                      <ListItemText primary={list.title} secondary={list.description} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography component="span" color="secondary">
                  No lists
                </Typography>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader title={'Movies data'} />
            <CardContent>
              {userData.ratedMovies && userData.ratedMovies.length ? (
                <UserPageRatedMovies action={fetchMovieData} movies={userData.ratedMovies} />
              ) : (
                <Typography color="secondary" component="span">
                  No rated movies
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={5}>
          <Card className={classes.card}>
            <CardHeader title={'Followers'} />
            <CardContent>
              {userData.followers && userData.followers.length ? (
                <UserPageFollowList action={fetchUserData} follows={userData.followers} />
              ) : (
                <Typography color="secondary">No followers</Typography>
              )}
            </CardContent>
          </Card>
          <Card className={classes.card}>
            <CardHeader title={'Follows'} />
            <CardContent>
              {userData.follows && userData.follows.length ? (
                <UserPageFollowList action={fetchUserData} follows={userData.follows} />
              ) : (
                <Typography color="secondary">No follows</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export const UserPage = connect()(withRouter(UserPageBase));

const useStyles = makeStyles({
  grid: {
    marginTop: 15,
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
