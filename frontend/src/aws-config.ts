const awsConfig = {
    aws_project_region: "ap-southeast-2",
    //aws_cognito_identity_pool_id: "us-east-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    aws_cognito_region: "ap-southeast-2",
    aws_user_pools_id: "ap-southeast-2_Orc9I7kDZ",
    aws_user_pools_web_client_id: "ggdbvdj1l691n1umo9pmuchr0",
    oauth: {
      domain: "leoonline-auth.auth.ap-southeast-2.amazoncognito.com",
      scope: ["email", "openid"],
      redirectSignIn: "http://localhost:3000/",
      redirectSignOut: "http://localhost:3000/",
      responseType: "code",
    },
  };

  export default awsConfig;
