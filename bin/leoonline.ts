#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { LeoonlineStack } from '../lib/leoonline-stack';
import { InfraStack } from '../lib/stacks/infra';

const app = new cdk.App();
new InfraStack(app, 'LeoonlineInfraStack');