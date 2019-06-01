import { Card, CardHeader, InputBase, Menu, MenuItem, Theme } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { fetchUserData, searchUsers, UserDataActions } from '@src/store/actions/user-data.actions';
import { UserDataSelectors } from '@src/store/reducers/user-data.reducer';
import { MenuItemContainer, ThemedCircularProgress } from '@src/ui/header-bar';
import invoke from 'lodash/invoke';
import React, { useEffect, useRef, useState } from 'react';
import { connect, shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { makeStyles, createStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core/styles';

const UserPageSearchBase = () => {
  const dispatch = useDispatch();
  const classes = useStyles({});

  const usersList = useSelector(UserDataSelectors.searchList, shallowEqual);
  const [query, setQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const [debouncedQuery] = useDebounce(query, 700);
  const handleMenuClose = (usrnm: string) => {
    setQuery('');
    setMenuOpen(false);
    inputRef.current!.blur();
    dispatch(UserDataActions.clearSearchListData());
    typeof usrnm === 'string' && dispatch(fetchUserData(usrnm, true));
  };
  useEffect(() => {
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

  return (
    <Card>
      <CardHeader
        title={
          <div className={classes.searchFieldContainer}>
            <span>Find new users </span>
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
          </div>
        }
      />
    </Card>
  );
};

export const UserPageSearch = connect()(UserPageSearchBase);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
        width: 250,
        '&:focus': {
          width: 350,
        },
      },
    },
  }),
);
