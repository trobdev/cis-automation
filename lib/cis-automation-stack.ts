import * as cdk from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';
import s3 = require("@aws-cdk/aws-s3");
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import { BlockPublicAccess } from '@aws-cdk/aws-s3';

export class CisAutomationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cisComplianceBucket = new s3.Bucket(this, "CisComplianceBucket", {
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED, //Bucket for storing LogGroups + CloudTrail logs
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true
      })

    })

    const cisComplianceLogGroup = new logs.LogGroup(this, 'CisComplianceLogGroup', {
      logGroupName: cdk.PhysicalName.GENERATE_IF_NEEDED, //LogGroup for CloudTrails, needed for CIS compliance
      retention: logs.RetentionDays.ONE_YEAR 
    })

    const cisComplianceCloudtrail = new cloudtrail.Trail(this, 'CisComplianceCloudtrail', {
      bucket: cisComplianceBucket,
      cloudWatchLogGroup: cisComplianceLogGroup,
      cloudWatchLogsRetention: logs.RetentionDays.ONE_YEAR,
      enableFileValidation: true,
      isMultiRegionTrail: true, //CIS 2.1
      sendToCloudWatchLogs: true,
      trailName: 'CisComplianceCloudtrail'
    })



    // The code that defines your stack goes here
  }
}
