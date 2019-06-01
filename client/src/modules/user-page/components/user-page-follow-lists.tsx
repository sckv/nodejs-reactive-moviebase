import React from 'react';
import { List, ListItem, ListItemIcon, Typography, ListItemText } from '@material-ui/core';
import { UserFollower } from 'types/user-controlling.services';
import { useDispatch } from 'react-redux';
import invoke from 'lodash/invoke';
import PersonIcon from '@material-ui/icons/Person';

type Props = {
  follows: UserFollower[];
  action: any;
};
export const UserPageFollowList = ({ follows, action }: Props) => {
  const dispatch = useDispatch();

  return (
    <List component="div">
      {invoke(follows, 'map', (follow: UserFollower, idx: number) => (
        <ListItem key={`follow+${idx}`} button={true} onClick={() => dispatch(action(follow.username, true))}>
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
  );
};
