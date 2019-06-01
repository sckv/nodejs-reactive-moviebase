import React from 'react';
import { List, ListItem, Typography, ListItemText, ListItemAvatar, Avatar } from '@material-ui/core';
import { UserMovies } from 'types/user-controlling.services';
import { useDispatch } from 'react-redux';
import invoke from 'lodash/invoke';

type Props = {
  movies: UserMovies['ratedMovies'];
  action: any;
};
export const UserPageRatedMovies = ({ movies, action }: Props) => {
  const dispatch = useDispatch();

  return (
    <List component="div">
      {invoke(movies, 'map', ({ _id, comment, poster, title, rate }: UserMovies['ratedMovies'][0], idx: number) => (
        <ListItem button={true} key={`mov+${idx}`} onClick={() => dispatch(action({ movieId: _id, goTo: true }))}>
          <ListItemAvatar>
            <Avatar alt={title} src={poster} />
          </ListItemAvatar>
          <ListItemText
            primary={title}
            secondary={
              <div>
                <Typography component="p">Comment: {comment}</Typography>
                <Typography component="p">Rated: {rate}</Typography>
              </div>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
