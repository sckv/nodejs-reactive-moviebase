import React from 'react';
import { connect, useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { AuthSelector } from '@src/store/reducers/auth.reducer';

const UserPageBase = ({ match }: RouteComponentProps<{ username: string }>) => {
  const auth = useSelector(AuthSelector);
  return <div>User Page</div>;
};

export const UserPage = connect()(withRouter(UserPageBase));
