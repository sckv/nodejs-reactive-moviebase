import React, { useState, useEffect, useRef } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { createStyles, makeStyles, styled as muiStyled } from '@material-ui/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { Theme } from '@material-ui/core/styles';
import { MovieRequestThin } from 'types/movies-requesting.services';
import { MoviesApi } from '@src/api/movies.api';
import { useDebounce } from 'use-debounce';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MenuItem, Menu } from '@material-ui/core';
import invoke from 'lodash/invoke';
import styled from '@emotion/styled';

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
  }),
);

export const HeaderBar = () => {
  const classes = useStyles();
  const [list, setList] = useState<MovieRequestThin[]>([]);
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [debouncedQuery] = useDebounce(query, 400);

  const handleMenuClose = () => {
    setQuery('');
    setMenuOpen(false);
    inputRef.current!.blur();
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
          <Typography className={classes.title} variant="h6" style={{ color: 'whitesmoke' }} noWrap={true}>
            Reactive Moviebase
          </Typography>
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
              // endAdornment={<ThemedCircularProgress size={25} color="secondary" />}
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
                <MenuItem onClick={handleMenuClose} key={(li._id as any) || idx}>
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
