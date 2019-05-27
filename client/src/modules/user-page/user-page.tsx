import React from 'react';
import { connect, useDispatch } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const dispatch = useDispatch();
  return <div>User Page</div>;
};

export const UserPage = connect()(withRouter(UserPageBase));
