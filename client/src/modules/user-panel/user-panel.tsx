import React from 'react';
import { connect, useDispatch } from 'react-redux';

const UserPanelBase = () => {
  const dispatch = useDispatch();
  return <div>User Panel</div>;
};

export const UserPanel = connect()(UserPanelBase);
