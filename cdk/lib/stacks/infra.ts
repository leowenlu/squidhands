/**
 * The AWS CDK(v2) infrastructure stack.
 * This stack will be deployed to AWS, will create the following resources:
 * - S3 bucket for storing the static website
 * - CloudFront distribution for serving the static website
 * - Route53 record for serving the static website
 * - Certificate for serving the static website
 * - Lambda@Edge function for serving the static website
 * - S3 bucket for storing the static website logs
 * - cognito user pool for authentication
 * - cognito user pool client for authentication
 * - cognito user pool domain for authentication
 * - cognito user pool identity provider for authentication
 * - api gateway for serving the api
 * - api gateway domain name for serving the api
 * - api gateway custom domain for serving the api
 * - api gateway base path mapping for serving the api
 * - api gateway usage plan for serving the api
 * - api gateway usage plan key for serving the api
 * - api gateway api key for serving the api
 *
 */

import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as origin from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

// import projectSetting module from helper folder
const projectName = 'leoonline';
const userPoolName = 'leoonline';
const domains = ['leoonline.com', 'www.leoonline.com'];
const userPoolDomainPrefix = 'leoonline-auth';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Load environment variables

    // Create the S3 bucket for storing the static website
    const staticWebBucket = new s3.Bucket(this, 'staticWebsiteBucket', {
      bucketName: `${projectName.toLowerCase()}-${cdk.Names.uniqueId(this).toLowerCase()}`,
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create a new Origin Access Identity
    const oai = new cloudfront.OriginAccessIdentity(this, 'staticWebsiteOAI');

    // Create a new Origin Access Control
    const oac = new cloudfront.CfnCloudFrontOriginAccessIdentity(this, 'staticWebsiteOAC', {
      cloudFrontOriginAccessIdentityConfig: {
        comment: 'Allow CloudFront to access the S3 bucket',
      },
    });


  const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origin.S3Origin(staticWebBucket, {
          originAccessIdentity: oai,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.CORS_S3_ORIGIN,
      },

      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      httpVersion: cloudfront.HttpVersion.HTTP2,
      // enableIpV6: false,
      enableLogging: true,
      logBucket: new s3.Bucket(this, 'staticWebBucketLogs', {
        publicReadAccess: false,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }),
      logFilePrefix: 'static-web-logs',

    });

    staticWebBucket.grantRead(oai);

    staticWebBucket.addCorsRule({
      allowedMethods: [s3.HttpMethods.GET],
      allowedOrigins: ['*'],
      allowedHeaders: ['*'],
    });

    // create cognito user pool
    const userPool = new cognito.UserPool(this, 'userPool', {
      selfSignUpEnabled: true,
      signInAliases: {
        email: true,
        username: true,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireDigits: true,
        requireSymbols: false,
        requireUppercase: true,
      },
      mfa: cognito.Mfa.OPTIONAL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // update domain prefix in Cognito domain
    userPool.addDomain(`${projectName}-auth-domain`, {
      cognitoDomain: {
        domainPrefix: userPoolDomainPrefix
      }
    });
    // get callbackUrls value from domains array
    const callbackUrls = domains.map((domain) => `https://${domain}/loggedin`);

    // Define Cognito User Pool Client
    const userPoolClient = userPool.addClient(`${projectName}`, {
      oAuth: {
        flows: {
          implicitCodeGrant: true
        },
        callbackUrls: callbackUrls
      },
      generateSecret: false,

      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO
      ]
    });

    // create API Gateway
    const api = new apigateway.RestApi(this, 'api', {
      restApiName: `${projectName}-api`,
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Create the Lambda function for the API Gateway, the source code is in
    // the lambda folder: ../../../lambda/ping/index.js
    const lambdaPing = new lambda.Function(this, 'lambdaPing', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../backend/lambdas/ping')),
      handler: 'index.handler',
      environment: {
        USER_POOL_ID: userPool.userPoolId,
        USER_POOL_CLIENT_ID: userPoolClient.userPoolClientId,
        USER_POOL_DOMAIN_PREFIX: userPoolDomainPrefix,
      },
    });

       // Create the API Gateway resource and method
    const helloWorldResource = api.root.addResource('hello');
    const helloWorldIntegration = new apigateway.LambdaIntegration(lambdaPing);
    helloWorldResource.addMethod('GET', helloWorldIntegration);


    /**
     * Output values
     */

    // output the apigateway endpoint
    new cdk.CfnOutput(this, 'apiEndpoint', {
      value: api.url,
    });

    // output the user pool domainPrefix
    new cdk.CfnOutput(this, 'userPoolDomainPrefix', {
      value: userPoolDomainPrefix,
    });

    // output the user pool id
    new cdk.CfnOutput(this, 'userPoolId', {
      value: userPool.userPoolId,
    });
    // output the user pool client id
    new cdk.CfnOutput(this, 'userPoolClientId', {
      value: userPoolClient.userPoolClientId,
    });

    // output the distribution domain name
    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
    });
    // output the distribution id
    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
    });

    // output s3 bucket name
    new cdk.CfnOutput(this, 'staticWebBucketName', {
      value: staticWebBucket.bucketName,
    });

  }
}

