+++
title = "Advanced questions"
weight = 99
+++

These are optional questions and challenges about this application. Click the chevron icon next to each question to see additional hints.

### Question 1 ###
{{%expand "In frontend build step, you want add CLI command `npm audit` during the frontend build step. How would you do that?" %}}

- Check the "Build settings" menu in the  Amplify project. Edit the *App build specification section*.

{{% /expand%}}

### Question 2 ###
{{%expand "Which resources are deployed in the ride-controller folders? What is the responsibility of this stack?" %}}

- Check the file `1-app-deploy/ride-controller/template.yaml`. 
- Examine the two `AWS::Serverless::Function` resources. Look at the code (from the `CodeUri` property) and how it is triggered (from the `Events` property).

{{% /expand%}}

### Question 3 ###

{{%expand "You extracted the variable $DDB_TABLE with this code: DDB_TABLE=$(aws cloudformation describe-stack-resource --stack-name theme-park-backend --logical-resource-id DynamoDBTable --query \"StackResourceDetail.PhysicalResourceId\" --output text). Can you explain what it does? If you want to extract other resources, how would you change the command?"  %}}

- `$(...COMMAND...)` is called "Command substitution". It runs the command inline and save the output of that command in `DDB_TABLE` (instead of outputting to the terminal).
- Go to the CloudFormation console, check the `theme-park-backend`, and choose the *Resources* tab.
- Change `--logical-resource-id DynamoDBTable` to `--logical-resource-id UserPool`. What is the returned value?

{{% /expand%}}