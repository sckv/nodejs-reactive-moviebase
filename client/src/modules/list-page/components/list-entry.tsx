import React from 'react';
import { Card, CardHeader, Avatar, CardContent, Typography, IconButton } from '@material-ui/core';
import { MovieRequestSlim } from 'types/movies-requesting.services';
import { makeStyles } from '@material-ui/styles';
import { fetchMovieData } from '@src/store/actions/movies.actions';
import { useDispatch, connect, useSelector, shallowEqual } from 'react-redux';
import CloseIcon from '@material-ui/icons/Close';
import { removeMovieFromList } from '@src/store/actions/lists.actions';
import { ListsSelectors } from '@src/store/reducers/lists.reducer';

type Props = { editable: boolean } & MovieRequestSlim;

const ListEntryBase = ({ title, poster, rate, _id, editable }: Props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const currentList = useSelector(ListsSelectors.current, shallowEqual);
  return (
    <Card className={classes.mainCard}>
      <CardHeader
        title={
          <div className={classes.titleContainer}>
            <div
              className={classes.avatarContainer}
              onClick={() => dispatch(fetchMovieData({ movieId: _id as any, goTo: true }))}
            >
              <Avatar src={poster} title={title} />
              <span>{title}</span>
            </div>
            {editable ? (
              <IconButton
                onClick={() => dispatch(removeMovieFromList({ listId: currentList._id, movieId: _id as any }))}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </div>
        }
      />
      <CardContent>
        <Typography component="span" variant="h5">
          Personal rate: {rate}
        </Typography>{' '}
      </CardContent>
    </Card>
  );
};

export const ListEntry = connect()(ListEntryBase);

const useStyles = makeStyles({
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& span': {
      marginLeft: 15,
    },
    cursor: 'pointer',
  },
  mainCard: {
    marginBottom: 15,
  },
});
