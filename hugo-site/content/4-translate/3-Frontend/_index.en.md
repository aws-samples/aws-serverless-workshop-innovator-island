+++
title = "Frontend"
weight = 13
+++

## Update the frontend

In this section, you will copy the new translation file into the front-end source code and redeploy to new version by pushing the changes in your repo.

### Step-by-step instructions ###

1. In the Cloud9 terminal, execute this command to copy the new translation file into the front-end source code:

```
cp ~/environment/theme-park-backend/4-translate/local-app/translations.json ~/environment/theme-park-frontend/src/languages/
```
## Push to CodeCommit and deploy via Amplify

1. In the Cloud9 terminal, change to the front-end directory with the following command:
``` 
cd ~/environment/theme-park-frontend/
```
2. Commit to CodeCommit by executing the following commands:
```
git commit -am "Module 4 - Translations"
git push
```
3. After the commit is completed, go to the [Amplify Console](https://us-west-2.console.aws.amazon.com/amplify/).
   
4. In the *All apps* section, click **theme-park-frontend**.

You will see a new build has automatically started as a result of the new commit in the underlying code repo. This build will take a few minutes. Once complete:

1. Open the published application URL.

2. You can see a new translations button has appeared in the menu bar at the top of the display. Click this and select a non-English language from the list of translations. 

3. Now click on any ride profile in the map to see the ride description in the new language. Navigate around the app to see how the new language now appears throughout.

To test further, change the selected language in the language dropdown to another target language.