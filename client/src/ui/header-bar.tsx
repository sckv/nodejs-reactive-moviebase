import styled from '@emotion/styled';
import { Button, Menu, MenuItem, Tooltip } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { Theme } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import SearchIcon from '@material-ui/icons/Search';
import { createStyles, makeStyles, styled as muiStyled } from '@material-ui/styles';
import { MoviesApi } from '@src/api/movies.api';
import { AuthSelectors } from '@src/store/reducers/auth.reducer';
import { push } from 'connected-react-router';
import invoke from 'lodash/invoke';
import React, { useEffect, useRef, useState } from 'react';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { MovieRequest, MovieRequestThin } from 'types/movies-requesting.services';
import { useDebounce } from 'use-debounce';
import { fetchUserData } from '@src/store/actions/user-data.actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
      cursor: 'pointer',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
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
    userData: {
      width: 200,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    userDataTitle: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    userDataTitleUsername: {
      cursor: 'pointer',
      marginLeft: 10,
      color: 'whitesmoke',
      fontSize: theme.typography.h6.fontSize,
    },
  }),
);

export const HeaderBarBase = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [list, setList] = useState<MovieRequest[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedQuery] = useDebounce(query, 700);

  const authData = useSelector(AuthSelectors.auth, shallowEqual);

  const handleMenuClose = (ttid: string) => {
    setQuery('');
    setMenuOpen(false);
    inputRef.current!.blur();
    console.log('getting by ttid');
    MoviesApi.getByTtid(ttid).then(res => (res ? dispatch(push(`/movie/${ttid}`)) : null));
  };

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      MoviesApi.searchCriteria(debouncedQuery).then(res => {
        setIsSearching(false);
        if (res && res.ok) {
          setList(res.data);
          setMenuOpen(true);
        }
      });
    }
  }, [debouncedQuery]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography
            onClick={e => {
              e.preventDefault();
              dispatch(push('/'));
            }}
            className={classes.title}
            variant="h6"
            style={{ color: 'whitesmoke' }}
            noWrap={true}
          >
            Reactive Moviebase
          </Typography>
          {authData && authData.username && (
            <div className={classes.userData}>
              <Typography className={classes.userDataTitle} component="div">
                <Tooltip title="User Profile" placement="bottom">
                  <IconButton
                    onClick={() => dispatch(fetchUserData(authData.username, true))}
                    color="default"
                    size="medium"
                  >
                    <PersonIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="User Panel" placement="bottom">
                  <span onClick={() => dispatch(push('/panel'))} className={classes.userDataTitleUsername}>
                    {authData.username}
                  </span>
                </Tooltip>
              </Typography>
              <Typography>Language: {authData.language.toUpperCase()}</Typography>
            </div>
          )}
          {!authData ||
            (!authData.username && (
              <div className={classes.userData}>
                <Typography>
                  <Button onClick={() => dispatch(push('/login'))}>Login or Register</Button>
                </Typography>
              </div>
            ))}
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              ref={inputRef}
              value={query}
              aria-owns={isMenuOpen ? 'movies-list' : undefined}
              placeholder="Search for a movie…"
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
              {invoke(list, 'map', (li: MovieRequestThin, idx: number) => (
                <MenuItem onClick={() => handleMenuClose(li.ttid)} key={(li._id as any) || idx}>
                  <MenuItemContaioner>
                    <div>
                      <img src={li.poster} />
                    </div>
                    <span>
                      {li.title} - {li.year}
                    </span>
                  </MenuItemContaioner>
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export const HeaderBar = connect()(HeaderBarBase);

const MenuItemContaioner = styled.div`
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

const ThemedCircularProgress = muiStyled(CircularProgress)({
  position: 'absolute',
  right: 5,
});
