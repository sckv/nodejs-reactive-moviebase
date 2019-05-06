import {CustomRequestHandler} from 'types/utils';
import {AuthServices} from '@src/pkg/authorizing/authorizing.services';
import {UserControllingServices} from '@src/pkg/user-controlling/user-controlling.services';

import {enqueueEmail} from '@src/services/email/email-publisher';
import {createObjectId} from '@src/utils/create-objectid';
import {hashUrl} from '@src/utils';
import {CacheServices} from '@src/pkg/cache/cache.services';
import {UserFull} from 'types/user-controlling.services';

const WEB_HOSTNAME = process.env.WEB_HOSTNAME;

export const activate: CustomRequestHandler = async (req, res) => {
  const {token} = req.params;
  const {username, email} = await AuthServices().activate(token);
  enqueueEmail({
    to: email,
    subject: 'Moviebase - User account activation',
    text: `Your account ${username} has been activated.`,
  });
  res.sendStatus(200);
};

export const register: CustomRequestHandler = async (req, res) => {
  const {username, password, email} = req.body;
  const userData = await UserControllingServices().register({username, password, email});
  const {activationToken} = await AuthServices().generateActivationToken(userData);
  enqueueEmail({
    to: email,
    subject: 'Moviebase - User account registration',
    text: `Your account ${username} has been registred.`,
    html: `<html>
      <div>Please click the below link to activate your password</div>
      <p>
        <a href="https://${WEB_HOSTNAME}/users/activate/${activationToken}">
          https://${WEB_HOSTNAME}/users/activate/${activationToken}
        </a>
      </p>
    </html>`,
  });
  res.sendStatus(200);
};

export const searchUsers: CustomRequestHandler = async (req, res) => {
  const {un, page} = req.params;
  const usersList = await UserControllingServices().search({username: un, page});
  res.status(200).send(usersList);
};

export const getUserData: CustomRequestHandler = async (req, res) => {
  const {username, pd, ld, md, page, followers, follows} = req.params;
  const hashedUrl = hashUrl(req.originalUrl);
  let userData: Partial<UserFull>;
  const cachedUser = await CacheServices.getFromCache<Partial<UserFull>>(hashedUrl);
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
    await CacheServices.setToCache<typeof userData>({urlHash: hashedUrl, timeout: 10, data: {data: userData}});
  }
  res.status(200).send(userData);
};

export const modifyUser: CustomRequestHandler = async (req, res) => {
  const {password, language} = req.body;
  const {userId} = req.params;
  if (!req.auth.userId.equals(createObjectId(userId))) res.sendStatus(403);
  const user = await UserControllingServices().modify({
    userId,
    language,
    password,
  });
  res.status(200).send(user);
};

// export const deleteUser: CustomRequestHandler = async (req, res) => {
// const user = await UserControllingServices().de({
//   userId,
//   language,
//   password,
// });
// res.status(200).send(user);
// };
