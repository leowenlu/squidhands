import { Auth, Amplify } from 'aws-amplify';
import awsConfig from './config';

Amplify.configure(awsConfig);

export async function userLogin(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password);
    console.log('Logged in user:', user);
    return {
      status: 'ok',
      user: user,
      msg: 'Cognito has logged in user!',
    };
  } catch (error) {
    console.error('Error logging in:', error);
    console.log('Error logging in, user is :');
    return {
      status: 'failed',
      msg: error,
    };;
  }
}