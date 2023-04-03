import { Auth } from '@aws-amplify/auth';

export async function cognitoSignIn({ userName, password }) {
  try {
    const user = await Auth.signIn(userName, password);
    if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      return { status: 'changePassword', user };
    }
    return { status: 'signin', user };
  } catch (e) {
    console.error('cognitoSignIn error', e);
    if (e.code === 'PasswordResetRequiredException') {
      return { status: 'resetPassword', errorCode: e.code };
    }
    if (
      ['UserNotConfirmedException', 'NotAuthorizedException', 'UserNotFoundException'].includes(
        e.code
      )
    ) {
      return { status: 'error', errorCode: e.code };
    }
    throw e;
  }
}

export async function cognitoSignOut() {
  try {
    const result = await Auth.signOut();
    return { status: 'signout', result };
  } catch (e) {
    console.error('cognitoSignOut error', e);
    throw e;
  }
}

export async function userNameAvailable(userName) {
  const confirmCode = '000000';
  try {
    await Auth.confirmSignUp(userName, confirmCode, {
      // If set to False, the API will throw an AliasExistsException error if the phone number/email used already exists as an alias with a different user
      forceAliasCreation: false,
    });
    return false;
  } catch ({ code }) {
    if (['UserNotFoundException'].includes(code)) {
      return true;
    }
    if (
      [
        'NotAuthorizedException',
        'AliasExistsException',
        'CodeMismatchException',
        'ExpiredCodeException',
      ].includes(code)
    ) {
      return false;
    }
    return false;
  }
}

export async function cognitoSignUp({ email, password }) {
  try {
    const result = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
      },
    });
    return { status: 'signup', result };
  } catch (e) {
    console.error('cognitoSignUp error', e);
    throw e;
  }
}

export async function cognitoChangePassword({ email, oldPassword, newPassword }) {
  try {
    const user = await Auth.signIn(email, oldPassword);
    if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
      // user is required to change password on first log in
      await Auth.completeNewPassword(user, newPassword, { email });
      return { status: 'changePasswordOnFirstLoginSucceed', user };
    }

    if (user) {
      // changing password initiated by user after the user logs in
      const data = await Auth.changePassword(user, oldPassword, newPassword);
      return { status: 'changePasswordSucceed', data };
    }
    return { status: null, data: null };
  } catch (e) {
    if (['NotAuthorizedException', 'UserNotFoundException'].includes(e.code)) {
      console.error(`cognitoChangePassword authentication error: ${JSON.stringify(e)}`);
      return { status: 'changePasswordError', errorCode: e.code };
    }
    console.error('cognitoChangePassword error', e);
    throw e;
  }
}

export async function cognitoResetPassword({ email, verificationCode, newPassword }) {
  try {
    await Auth.forgotPasswordSubmit(email, verificationCode, newPassword);
    return { status: 'resetPasswordSucceed' };
  } catch (e) {
    if (
      [
        'ExpiredCodeException',
        'CodeMismatchException',
        'LimitExceededException',
        'UserNotFoundException',
      ].includes(e.code)
    ) {
      return { status: 'resetPasswordError', errorCode: e.code };
    }
    console.error(`cognitoResetPassword unknown error: ${JSON.stringify(e)}`);
    return { status: 'resetPasswordError', errorCode: 'UnknownException' };
  }
}
