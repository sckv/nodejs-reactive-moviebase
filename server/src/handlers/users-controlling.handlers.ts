import { CustomRequestHandler } from 'types/utils';
import { AuthServices } from '@src/pkg/authorizing/authorizing.services';
import { UserControllingServices } from '@src/pkg/user-controlling/user-controlling.services';

import { enqueueEmail } from '@src/services/email/email-publisher';
import { createObjectId } from '@src/utils/create-objectid';
import { hashUrl } from '@src/utils';
import { CacheServices } from '@src/pkg/cache/cache.services';
import { UserFull, UserThin } from 'types/user-controlling.services';

const WEB_HOSTNAME = process.env.WEB_HOSTNAME;

export const activate: CustomRequestHandler = async (req, res) => {
  const { token } = req.params;
  console.log('toker recived', token);
  const { username, email } = await AuthServices().activate(token);
  enqueueEmail({
    to: email,
    subject: 'Moviebase - User account activation',
    text: `Your account ${username} has been activated.`,
  });
  res.sendStatus(200);
};

export const register: CustomRequestHandler = async (req, res) => {
  const { username, password, email } = req.body;
  const userData = await UserControllingServices().register({ username, password, email });
  const { activationToken } = await AuthServices().generateActivationToken(userData);
  enqueueEmail({
    to: email,
    subject: 'Moviebase - User account registration',
    text: `Your account ${username} has been registred.`,
    html: `<html>
      <div>Please click the below link to activate your account and password</div>
      <p>
        <a href="https://${WEB_HOSTNAME}/users/activate/${activationToken}">
          https://${WEB_HOSTNAME}/users/activate/${activationToken}
        </a>
      </p>
    </html>`,
  });
  return res.sendStatus(200);
};

export const searchUsers: CustomRequestHandler = async (req, res) => {
  const { un, page } = req.query;
  const urlHash = hashUrl(req.originalUrl);
  const cachedUsers = await CacheServices.getFromCache<Partial<UserThin[]>>(urlHash);
  let usersList: Partial<UserThin[]>;

  if (!cachedUsers || !cachedUsers.data) {
    usersList = await UserControllingServices().search({ username: un, page });
    await CacheServices.setToCache<typeof usersList>({ urlHash, timeout: 10, data: { data: usersList } });
  }
  return res.status(200).send(usersList);
};

export const getUserData: CustomRequestHandler = async (req, res) => {
  const { username, pd, ld, md, page, followers, follows } = req.query;
  const urlHash = hashUrl(req.originalUrl);
  let userData: Partial<UserFull>;
  const cachedUser = await CacheServices.getFromCache<Partial<UserFull>>(urlHash);
  if (!cachedUser || !cachedUser.data) {
    userData = await UserControllingServices().get({
      username,
      selfId: req.auth ? req.auth.userId : undefined,
      personalData: pd,
      followers,
      follows,
      listsData: ld,
      moviesData: md,
      page,
    });
    await CacheServices.setToCache<typeof userData>({ urlHash, timeout: 10, data: { data: userData } });

  }
  return res.status(200).send(userData);
};

export const modifyUser: CustomRequestHandler = async (req, res) => {
  const { password, language } = req.body;
  const { userId } = req.params;
  if (!req.auth.userId.equals(createObjectId(userId))) res.sendStatus(403);
  const user = await UserControllingServices().modify({
    userId,
    language,
    password,
  });
  return res.status(200).send(user);
};

export const followUser: CustomRequestHandler = async (req, res) => {
  const { followId } = req.body;
  const { userId } = req.auth;
  if (userId.equals(createObjectId(followId))) return res.sendStatus(400);
  await UserControllingServices().follow({
    userId,
    followId,
  });
  return res.status(200);
};

export const unfollowUser: CustomRequestHandler = async (req, res) => {
  const { followId } = req.body;
  const { userId } = req.auth;
  if (userId.equals(createObjectId(followId))) return res.sendStatus(400);
  await UserControllingServices().unfollow({
    userId,
    followId,
  });
  return res.status(200);
};
