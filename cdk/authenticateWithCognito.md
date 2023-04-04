# About cognito authentication
AWS Cognito is a managed service that provides user sign-up, sign-in, and access control. Here's a brief explanation of how it works:
- User signs up with their email address and password
- User receives a confirmation email
- User confirms their email address
- User signs in with their email address and password
- User receives a JWT (JSON Web Token) that can be used to access protected resources
- User can sign out

# how cognito user pool works
- User pool is a user directory in Amazon Cognito
- User pool stores users and their attributes
- User pool can be configured to define which attributes are required for sign-up, sign-in, and account recovery


## how cognito user pool group works
- User pool group is a collection of users in a user pool
- User pool group can be configured to define which attributes are required for sign-up, sign-in, and account recovery

## how cognito user pool client works
- User pool client is an app that users use to sign in to a user pool
- User pool client can be configured to use the Authorization Code Grant Flow or the Implicit Grant Flow
- User pool client can be configured to use the OAuth 2.0 protocol
- User pool client can be configured to use the OpenID Connect protocol

## how cognito user pool domain works
- User pool domain is a custom domain name that you provide to Amazon Cognito
- User pool domain is used to host the sign-up and sign-in webpages for your app
- User pool domain can be configured to use a custom domain name that you own or a domain name that Amazon Cognito provides for you

# how cognito identity pool works
- Identity pool is a store of user identity data specific to your account
- Identity pool is used to grant your users access to other AWS services
- Identity pool can be configured to use one or more user pools as an identity provider
- Identity pool can be configured to use one or more external identity providers such as Login with Amazon, Sign in with Apple, Facebook, Google, or SAML-based identity providers
## cognito identity provider
- Identity provider is a service that creates, maintains, and manages identity information for your users
- Identity provider can be configured to use one or more user pools as an identity provider
- Identity provider can be configured to use one or more external identity providers such as Login with Amazon, Sign in with Apple, Facebook, Google, or SAML-based identity providers

# CDK code to create cognito user pool

Requirements:
Cognito user pool sign-in options
- Username
- Email address

Configure security requirements
Password minimum length: 8 character(s)
Password requirements:
    Contains at least 1 number
    Contains at least 1 special character
    Contains at least 1 uppercase letter
    Contains at least 1 lowercase letter
MFA enforcement: Optional MFA

Main application client settings:
App type: Public client
App client name: leoonline
Allowed callback URLs: https://leoonline.net/loggedin
Authentication flows:
    ALLOW_REFRESH_TOKEN_AUTH
    ALLOW_CUSTOM_AUTH
    ALLOW_USER_SRP_AUTH

```
import * as cdk from 'aws-cdk-lib';

## ant design pro user login
### models
export interface LoginParamsType {
  userName: string;
  password: string;
  mobile?: string;
  captcha?: string;
  type?: string;
}
ant design pro user login models, in this project we use cognito user pool to authenticate user, so we don't need to use this model. we can use the model in ant design pro to authenticate user with cognito user pool, but we need to change the model to fit cognito user pool.

`src/pages/User/index.tsx`: in this file, it contains the login page, also the login to openid connect providers like **Google** and **Facebook**.
`src/services/ant-degsin-pro/`:

login, it contains the service to send validate request(email, sms, totp?) to cognito user pool, `api.ts` contains the api to send request to cognito user pool, `login.ts` contains the login function, it will call cognito user pool to authenticate user.

register:
reset password:
change password:
