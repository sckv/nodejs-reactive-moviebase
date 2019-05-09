import {CustomRequestHandler} from 'types/utils';
import {AuthServices} from '@src/pkg/authorizing/authorizing.services';
import {enqueueEmail} from '@src/services/email/email-publisher';

const WEB_HOSTNAME = process.env.WEB_HOSTNAME;

export const login: CustomRequestHandler = async (req, res, next) => {
  const {username, password} = req.body;
  const {token, userId} = await AuthServices().login({username, password});
  res
    .status(200)
    .cookie('__sesssion', token, {maxAge: 9000000, httpOnly: true, path: '/', sameSite: 'Strict'})
    .send({token, userId});
};

export const logout: CustomRequestHandler = async (req, res) => {
  const sessionToken = req.cookies['__session'];
  await AuthServices().logout(sessionToken);
  res.status(200).cookie('__session', undefined, {maxAge: 1, httpOnly: true, path: '/', sameSite: 'Strict'});
};

export const forgot: CustomRequestHandler = async (req, res) => {
  const {email} = req.body;
  const {recoveryToken, username} = await AuthServices().generateRecoveryToken({email});
  enqueueEmail({
    to: email,
    subject: 'Moviebase - Password Recovery',
    text: `Someone have requested a password recovery for your account: ${username}`,
    html: `<html>
      <div>Please click the below link to reset your password</div>
      <p>
        <a href="https://${WEB_HOSTNAME}/restore/${recoveryToken}">https://${WEB_HOSTNAME}/restore/${recoveryToken}</a>
      </p>
    </html>`,
  });
  res.sendStatus(200);
};

export const checkRecoveryToken: CustomRequestHandler = async (req, res) => {
  const {token} = req.params;
  const {resetToken} = await AuthServices().checkRecoveryAndSetResetToken({recoveryToken: token});
  res.status(200).send({resetToken});
};

// export const restore: CustomRequestHandler = async (req, res) => {
//   const {token} = req.params;
//   const {resetToken} = await AuthServices().checkRecoveryAndSetResetToken({recoveryToken: token});
//   res.status(200).send({resetToken});
// };

export const resetPassword: CustomRequestHandler = async (req, res) => {
  const {token} = req.params;
  const {password} = req.body;
  await AuthServices().reSetNewPassword({resetToken: token, password});
  res.sendStatus(200);
};
