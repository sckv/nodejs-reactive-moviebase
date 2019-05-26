import { ThunkAction } from 'redux-thunk';
import { AppStoreState, ActionsUnion } from '@src/store/store';
import { AuthSelector } from '@src/store/reducers/auth.reducer';
import { NotifyActions } from '@src/store/actions/notification.actions';
import { UsersApi } from '@src/api/users.api';
import { push } from 'connected-react-router';

export const RegisterThunkAction = (registryData: {
  username: string;
  email: string;
  password: string;
}): ThunkAction<void, AppStoreState, null, ActionsUnion> => async (dispatch, getState) => {
  const authUsername = AuthSelector(getState()).username;
  if (authUsername) return dispatch(NotifyActions.error(`You cant register while logged in as ${authUsername}`));

  const register = await UsersApi.register(registryData);

  if (register && register.ok) {
    dispatch(
      NotifyActions.success(
        `Successfully registered with email ${registryData.email}.
   Await for an emails with instructions to activate your account`,
        15000,
      ),
    );
    return dispatch(push('/'));
  }
  return dispatch(NotifyActions.error('Error registering. Check out your email or username'));
};
