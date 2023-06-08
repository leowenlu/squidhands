# Pro which created the project by Pro cli
 


## Pro cli
``` bash
$ npm i @ant-design/pro-cli -g
$ pro create pro_app

```

the project folder is `pro_app`

`export NODE_OPTIONS=--openssl-legacy-provider`, it looks like the new version of the nodejs has some issue with the openssl, so we need to set the environment variable to use the legacy provider.

``` bash
## Clean up the first page
### What you need to know
After the ant desgin pro install, from the first login page, you can see the admin user name and password. We need to clean up the page and make it look like a normal login page.

Ant Design Pros mock backend is located in the src/mock folder. You can see there is a mock folder which has the following files:
- user.ts
- route.ts
- notices.tx
- listTableList.ts

**GitHub Copilot:** The `cross-env` package is used to set environment variables in a cross-platform way. In this case, it is used to set the `UMI_ENV` environment variable to `dev`. This environment variable is then used by the `umi` command to determine the configuration to use for the project.

The `umi dev` command starts the development server for the UmiJS project. By default, UmiJS uses a mock server for development. The mock server is configured using the `mock` property in the `config/config.ts` file.

To check the settings for the mock server, you can open the `config/config.ts` file and look for the `mock` property. The `mock` property is an object that contains various properties used to configure the mock server. For example, the `mock` property can be used to specify the base URL for the mock server, the delay for responses, and the data to return for specific requests.

If you want to modify the settings for the mock server, you can update the `mock` property in the `config/config.ts` file. Once you have made your changes, you can restart the development server using the `npm start` command to see the changes take effect.

`config/openapi.json` 

1. remove items not needed in the login page
  - setup user crediential 
    - api user name and password can be changed in the `mock/user.ts` file
    `   (password === 'userpass' && username === 'user') `  and `(password === 'userpass' && username === 'admin')`
    - placeholder text can be changed in locales folder, you might need find `pages.login.password.placeholder` and replace the value based on the language you want to use.
    For `en-us`, I have changed to the following:
    `'pages.login.password.placeholder': 'Please input your password.'`
  - replace 'pages.layouts.userLayout.title' in locales folder with all languages

  - Remove Phone login tab as it's not needed at the moment,  `pages/user/login/index.tsx` is the file you need to modify
  - Remove unwanted languages off the `locales` folder

  - Footer change in `pro_app/src/components/Footer/index.tsx`
      - remove links
      - `defaultMessage`
  - Remove 
  - change `src/services/ant-design-pro/` to `src/services/api/` to take off ant-design-pro brand off
2. Migrate the login from mock server to aws Cognito for login

As we are using aws cognito for login, we need to change the login page to use aws cognito instead of the mock server
A new service folder `src/services/aws-cognito` is created to handle the aws cognito login.
The following files are created:
- `src/services/aws-cognito/index.ts`
- `src/services/aws-cognito/login.ts`
- `src/services/aws-cognito/logout.ts`
- `src/services/aws-cognito/register.ts`
- `src/services/aws-cognito/reset-password.ts`
- `src/services/aws-cognito/verify.ts`
- `src/services/aws-cognito/typings.d.ts`
- `src/services/aws-cognito/config.ts`



React single page app login authenticate with AWS cognito sequence flow as the following:

``` mermaid
sequenceDiagram
    participant User
    participant React SPA
    participant AWS Cognito
    User->>React SPA: User enter username and password
    React SPA->>AWS Cognito: Send username and password
    AWS Cognito->>React SPA: Return JWT token
    React SPA->>AWS Cognito: Send JWT token    
```

