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
  Avatar,
  ListItemAvatar,
  Divider,
  InputBase,
  MenuItem,
  ListItemIcon,
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { makeStyles, createStyles, styled as muiStyled } from '@material-ui/styles';
import {
  fetchUserData,
  unfollowUser,
  followUser,
  searchUsers,
  UserDataActions,
} from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import invoke from 'lodash/invoke';
import { UserFull, UserFollower } from 'types/user-controlling.services';
import { fetchListData, createList } from '@src/store/actions/lists.actions';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { fetchMovieData } from '@src/store/actions/movies.actions';
import PersonIcon from '@material-ui/icons/Person';
import { fade, Theme } from '@material-ui/core/styles';
import { useDebounce } from 'use-debounce';
import styled from '@emotion/styled';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const { username } = match.params;
  const classes = useStyles({});
  const dispatch = useDispatch();

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);

  const userData = useSelector(UserDataSelectors.userData, shallowEqual);
  const authData = useSelector(AuthSelectors.auth, shallowEqual);
  const usersList = useSelector(UserDataSelectors.searchList, shallowEqual);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [switchCheck, setSwitch] = useState<boolean>(false);

  useEffect(() => {
    !userData && dispatch(fetchUserData(username));
    userData && userData.username !== username && dispatch(fetchUserData(username));
  }, [match]);

  // const [list, setList] = useState<MovieRequest[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedQuery] = useDebounce(query, 700);

  const handleMenuClose = (usrnm: string) => {
    setQuery('');
    setMenuOpen(false);
    inputRef.current!.blur();
    console.log('getting by username', usrnm);
    dispatch(UserDataActions.clearSearchListData());
    typeof usrnm === 'string' && dispatch(fetchUserData(usrnm, true));
  };

  useEffect(() => {
    console.log('enter for seearching>>>', debouncedQuery, usersList);

    if (debouncedQuery && !usersList) {
      dispatch(searchUsers(debouncedQuery));
      setIsSearching(true);
    }
    if (debouncedQuery && usersList) {
      usersList.length && setMenuOpen(true);
      setIsSearching(false);
      !usersList.length && dispatch(UserDataActions.clearSearchListData());
    }
  }, [debouncedQuery, usersList]);

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
          <Card>
            <CardHeader
              title={
                <div className={classes.searchFieldContainer}>
                  <span>Find new users: </span>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <PersonIcon />
                    </div>
                    <InputBase
                      ref={inputRef}
                      value={query}
                      aria-owns={isMenuOpen ? 'movies-list' : undefined}
                      placeholder="Search for a user"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      endAdornment={isSearching ? <ThemedCircularProgress size={25} color="secondary" /> : null}
                      onChange={e => setQuery(e.target.value)}
                    />
                    <Menu
                      id="movies-list"
                      anchorEl={inputRef.current}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={isMenuOpen}
                      onClose={handleMenuClose}
                    >
                      {invoke(usersList, 'map', (usr: any, idx: number) => (
                        <MenuItem onClick={() => handleMenuClose(usr.username)} key={(usr.username as any) + idx}>
                          <MenuItemContainer>
                            <span>{usr.username}</span>
                          </MenuItemContainer>
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
                  {/* <TextField
                    style={{ marginLeft: 20, minWidth: 250 }}
                    InputProps={{ style: { height: 40 } }}
                    variant="outlined"
                  /> */}
                </div>
              }
            />
          </Card>
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
                            <Typography component="span">Comment: {movie.comment}</Typography>
                            <Typography component="span">Rated: {movie.rate}</Typography>
                          </div>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
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
                <List component="div">
                  {invoke(userData.followers, 'map', (follower: UserFollower, idx: number) => (
                    <ListItem
                      key={`follwr+${idx}`}
                      button={true}
                      onClick={() => dispatch(fetchUserData(follower.username, true))}
                    >
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
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
                      <ListItemIcon>
                        <PersonIcon />
                      </ListItemIcon>
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    searchFieldContainer: {
      height: 40,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.25),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(7),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 7),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 150,
        '&:focus': {
          width: 250,
        },
      },
    },
  }),
);
const ThemedCircularProgress = muiStyled(CircularProgress)({
  position: 'absolute',
  right: 5,
});

const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  span {
    justify-self: center;
    align-self: center;
  }
  div {
    width: 50px;
    margin-right: 8px;
    display: flex;
  }
  img {
    height: 50px;
  }
`;
