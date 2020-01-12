---
title: 'Trigger Lambda on Instance Termination.'
date: '2016-07-11'
description: 'AWS EC2 lambda trigger'
category: 'Tutorial'
tags: ['AWS', 'lambda']
---

# Introduction

So going on call, we had autoscaling groups that will terminate instances when they fail ELB health checks.
By the time that we got to the instances, they were already terminated and we have no access to the logs.

My ideal solution would be to find time to setup the Elasticsearch LogStash Kibana (ELK) stack. Though since,
the company only had 15 developers and only 2 of them know how the infrastructure works. The idea won't get much
traction. For a working ELK come to fruition we needed to pull hours of research outside of working hours
without support.
This wasn't something I wanted to do, since it will affect my ability to do actual assigned work, as much as it pains
me, I need to get things done and clear time to pursue other options.

So for the simplest thing that gets 80 percent of the results, I used a SNS triggered lambda function to scrap all
logs for terminating instances. This is done through the use of AWS Autoscaling's Lifecycle hooks.

![lifecycle-hooks](http://docs.aws.amazon.com/autoscaling/latest/userguide/images/lifecycle_hooks.png)

For every AutoScaling Group, there are listeners on these event hooks that can be used to program in behaviour.
In my example I setup a termination hook on the Cloudformation containing all my AutoScaling Groups.

```json
{
  "Group1LifeCycleTerminationHook": {
    "Type": "AWS::AutoScaling::LifecycleHook",
    "Properties": {
      "AutoScalingGroupName": {
        "Ref": "Group1ServerGroup"
      },
      "HeartbeatTimeout": 240,
      "LifecycleTransition": "autoscaling:EC2_INSTANCE_TERMINATING",
      "NotificationTargetARN": {
        "Ref": "TerminationHookSNSTopic"
      },
      "RoleARN": {
        "Ref": "TerminationHookRole"
      }
    }
  }
}
```

You can setup the LifeCycle through the
[CLI](http://docs.aws.amazon.com/cli/latest/reference/autoscaling/put-lifecycle-hook.html)  
as well, but there is no UI for this feature during the writing of this blog post.

This function is then scheduled to trigger an
[AWS SSM agent](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/install-ssm-agent.html) script to scrape all my logs.
on my cluster of servers. Essentially, this agent awaits commands from the AWS SSM scheduler and executes preapproved
scripts on the specific set of EC2 machines.

On each of my server provisioners on CloudFormation, I added the ssm-agent bootstrap script. So that the servers
respond to SSM requests.

```json
{
  "/opt/ssm/install-ssm-agent.sh": {
    "content": {
      "Fn::Join": [
        "",
        [
          "#!/bin/bash\n",
          "cd /tmp\n",
          "curl https://amazon-ssm-",
          {
            "Ref": "AWS::Region"
          },
          ".s3.amazonaws.com/latest/linux_amd64/amazon-ssm-agent.rpm -o amazon-ssm-agent.rpm\n",
          "yum install -y amazon-ssm-agent.rpm\n"
        ]
      ]
    },
    "owner": "root",
    "group": "root",
    "mode": "000755"
  }
}
```

I then setup my SSM Document to perform a task, and upload it to the SSM document store.

```json
{
    "Content": "{
        \"schemaVersion\": \"1.2\",
    \"description\": \"Clean up jobs for a terminating instance.\",
    \"parameters\": {},
    \"runtimeConfig\": {
        \"aws:runShellScript\": {
        \"properties\": [
        {
            \"id\": \"0.aws:runShellScript\",
          \"runCommand\": [
                \"echo '===CATALINA.OUT==='\",
                \"tail -n 1000 /var/log/tomcat/catalina.out || true\",
                \"echo '===JETTY.LOGs==='\",
                \"tail -n 1000 /var/log/jetty/`ls /var/log/jetty/ | sort -r | head -n 1` || true\",
                \"echo '===FREEMEMORY==='\",
                \"free -m\",
                \"echo '===DOCKER-INSPECT==='\",
                \"docker inspect tomcat || true\",
                \"docker inspect jetty || true\",
                \"echo '===FILE DESCRIPTORS==='\",
                \"lsof | wc -l\"
                  ]
                }
            ]
            }
        }
    }",
    "Name": "scrape-terminating-instance-logs"
}

```

```bash
aws --profile prod ec2 ssm create-document --content file://scrape-terminating-instance-logs.json --name "scrape-terminating-instance-logs"
```

Now I trigger the SSM run from my Lambda Method, and setting the SNS notfication as the Lambda Method trigger.

```python
from __future__ import print_function

import json

# Message Sample
'''
Service: AWS Auto Scaling
Time: 2016-01-27T15:23:47.581Z
RequestId: reqid
LifecycleActionToken: someToken
AccountId: 123
AutoScalingGroupName: Group1
LifecycleHookName: Group1LifeCycleTerminationHook
EC2InstanceId: i-1ba03992
LifecycleTransition: autoscaling:EC2_INSTANCE_TERMINATING
NotificationMetadata: null
'''
ASG_NAME_KEY='AutoScalingGroupName'
EC2_INSTANCE_ID_KEY='EC2InstanceId'
import boto3

client = boto3.client('ssm')

def lambda_handler(event, context):
    print('boto3 version: %s' % boto3.__version__)
    #print("Received event: " + json.dumps(event, indent=2))
    message = event['Records'][0]['Sns']['Message']
    print(message)

    json_message = json.loads(message)
    asg_name = json_message[ASG_NAME_KEY]
    ec2_id = json_message[EC2_INSTANCE_ID_KEY]

    response = client.send_command(
        InstanceIds=[
            ec2_id,
        ],
        DocumentName='scrape-terminating-instance-logs',
        TimeoutSeconds=120,
        Comment='scrape log lines and other auditing info',
        Parameters={},
        OutputS3BucketName='somebucket',
        OutputS3KeyPrefix='terminated_instance_logs/' + asg_name
    )
    # remove dates that are break json serialization
    response['Command'].pop("RequestedDateTime", None)
    response['Command'].pop("ExpiresAfter", None)

    print(response)

    return response
```

The above lambda method will trigger the SSM function every time an event occurs, it can also be updated to trigger
any clean up function needed.

If you read the above lambda method, you will notice that I set the SSM client to output the results to a s3 bucket,
this bucket can then be accessed anytime to read the last bit of logs prior to the instance terminating.
