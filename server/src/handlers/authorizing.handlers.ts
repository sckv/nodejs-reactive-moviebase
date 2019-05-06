import {CustomRequestHandler} from 'types/utils';
import {AuthServices} from '@src/pkg/authorizing/authorizing.services';

export const login: CustomRequestHandler = async (req, res, next) => {
  const {username, password} = req.body;
  const {token, userId} = await AuthServices().login({username, password});
  res
    .status(200)
    .cookie('__sesssion', token, {maxAge: 9000000, httpOnly: true, path: '/', sameSite: 'Strict'})
    .send({token, userId});
};

export const logout: CustomRequestHandler = async (req, res, next) => {
  const sessionToken = req.cookies['__session'];
  await AuthServices().logout(sessionToken);
  res.status(200).cookie('__session', undefined, {maxAge: 1, httpOnly: true, path: '/', sameSite: 'Strict'});
};

// export const;
