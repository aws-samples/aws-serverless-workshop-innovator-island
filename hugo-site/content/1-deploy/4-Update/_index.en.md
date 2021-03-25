+++
title = "Update the frontend"
weight = 14
+++

## Update the frontend

In this section, you will add the API endpoint you have created to the frontend configuration. This allows the frontend application to get the list of rides and attractions via the APIGateway URL which pulls the information from DynamoDB.

After the update, you will commit the changes to the git repo, which will automatically redeploy and republish the application.

### Update the configuration file

1. In the Cloud9 terminal, in the left directory panel navigate to **theme-park-frontend/src**. 
2. Locate the **config.js** file and double-click to open in the editor.

{{% notice info %}}
This file contains a JSON configuration for the frontend. The file is separated into modules that correspond with the modules in this workshop.
{{% /notice %}}
 
3. In the **MODULE 1** section at the beginning of the file, update the *initStateAPI* attribute of the API by pasting the API Endpoint URL from the previous section between the two ```'```.

4. Save the file.

![Module 1 - InitStateAPIURL](../images/module1-initStateAPI.png)

### Push to CodeCommit and deploy via Amplify Console

1. In the Cloud9 terminal, change to the front-end directory with the following command:
``` 
cd ~/environment/theme-park-frontend/
```
2. Commit to CodeCommit by executing the following commands:
```
git commit -am "Module 1"
git push
```
3. After the commit is completed, go to the [Amplify Console](https://console.aws.amazon.com/amplify/). **Make sure you are in the correct region.**

4. In the *All apps* section, click **theme-park-frontend**. If you are going back to a previously open browser tab, you may need to refresh.

You will see a new build has automatically started as a result of the new commit in the underlying code repo. This build will take a few minutes. Once complete:

5. Open the published application URL in a browser.

{{% notice info %}}
The browser may cache an older version of the site - press CTRL+F5 (Windows) or hold down ⌘ Cmd and ⇧ Shift key and then press R (Mac) to perform a hard refresh. This forces the browser to load the latest version.
{{% /notice %}}

You can now see the map contains the theme park's points of interest such as rides and attractions. You can select any of them and find out more.
