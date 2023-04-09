import awsConfig from './config';
import { Auth, Amplify } from 'aws-amplify';
import { request, history } from '@umijs/max';
Amplify.configure(awsConfig);

export async function login(body: USERS.LoginParams, options?: { [key: string]: any }) {
  try {
    const { username, password } = body;
    const user = await Auth.signIn(username, password);
    console.log("user logged in via cognito: ", user);
    if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
      history.push('/user/ChangePassword');
      // return { status: 'changePassword', user };
    }
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log("current user : ", currentUser);
    return {
      status: 'ok',
      currentAuthority: 'admin',
    };

  } catch (error) {
    console.log("error logging in via cognito: ", error);
    return { success: false, errorMessage: error.message };
  }
}
// a fuction to change cognito password
export async function changePassword(body: USERS.ChangePasswordParams, options?: { [key: string]: any }) {
  // try to login with the old password
  let user;
  const {username, oldPassword, newPassword } = body;
  try {
    user = await Auth.signIn(username, oldPassword);
    console.log("Trying to login user to change password: ", user);
  } catch (error) {
    console.log("error logging in via cognito: ", error);
    //return { success: false, errorMessage: error.message };
  }
  if (user?.challengeName === 'NEW_PASSWORD_REQUIRED') {
    const { requiredAttributes } = user.challengeParam;
    console.log("requiredAttributes: ", requiredAttributes);
    await Auth.completeNewPassword(user, newPassword, requiredAttributes);
  } else {
    try {
      //const user = await Auth.currentAuthenticatedUser();
      const newUser = await Auth.changePassword(user, oldPassword, newPassword);
      console.log("user changed password: ", newUser);
      return {
        status: 'ok',
        currentAuthority: 'admin',
      };
    } catch (error) {
      console.log("failed to change password: ", error);
      return { success: false, errorMessage: error.message };
    }

  }

}


export async function getCurrentUser() {
  let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

  const getAccess = () => {
    return 'admin';
  };

  const currentUser = await Auth.currentAuthenticatedUser();
  const attributes = await Auth.userAttributes(currentUser);
  console.log("current user : ", currentUser);
  console.log("current user attributes: ", attributes);
  const givenNameAttribute = attributes.find(attr => attr.getName() === 'given_name');
  const givenName = givenNameAttribute ? givenNameAttribute.getValue() : '';
  const familyNameAttribute = attributes.find(attr => attr.getName() === 'family_name');
  const familyName = familyNameAttribute ? familyNameAttribute.getValue() : '';
  const emailAttribute = attributes.find(attr => attr.getName() === 'email');
  const email = emailAttribute ? emailAttribute.getValue() : '';

  if (currentUser) {
    return {
      success: true,
      data: {
        username: currentUser.username,
        givenName: givenName,
        familyName: familyName,
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        email: email,
        access: getAccess(),
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        unreadCount: 11,
        country: 'China',
        access: getAccess(),
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',

      }
    }
  } else {
      return {
        success: false
      }
    }
  }
