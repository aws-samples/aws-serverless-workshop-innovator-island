# Module 4: Language translation

## Overview

Many of the visitors to the the park's island come from all over the world and English is not their first language. Adding alternative language options will make it much easier for guests to understand and interact with the app.

:video_camera: This module is also available to [watch on YouTube](https://www.youtube.com/watch?v=-2vI4PwVKHU).

## How it works

* The front-end application uses a local languages resource file to substitute language strings when the locale is changed. 
* You will download this file and use a Node function that uses Amazon Translate to create a new file with a range of translations.
* After the new language file is created, you will copy it into the frontend code and republish through Amplify Console.
* Finally you will reload the front-end and test the new language functionality.

**:white_check_mark: Step-by-step Instructions**

1. Go to the AWS Management Console, click **Services** then select [**Cloud9**](https://console.aws.amazon.com/cloud9) under Developer Tools. **Make sure your region is correct.**
2. In the left panel of the IDE, open the ```4-translate/local-app``` folder in the aws-serverless-workshop-innovator-island directory. Click on ```translations-input.json``` to see the English input language file.
3. In the left panel of the IDE, click on the ```translate.js``` file to open. This contains a function you will execute locally to translate the input file.

4. Select your target languages. On line 36, the ```targetLanguages``` array shows a list of languages for translation. Currently this is set to French, Spanish and Japanese - you can modify this array to include of the supported language codes (show on line 29 in the ```possibleLanguages``` array). Choose 4-5 different languages.
5. **Save** the file after making any changes.
6. In the terminal, execute the local Node application by running the following commands which will use Amazon Translate to create the translation file:`

```
cd ~/environment/theme-park-backend/4-translate/local-app/
npm install 
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
node ./translate.js $AWS_REGION
```
After a few seconds, the function completes and has created a new file in the same directory called ```translations.json```. Click on the file in the left panel of the IDE to inspect the contents. You will see it contains translations of the string resources in the target languages.

## Update the frontend

In this section, you will copy the new translation file into the front-end source code and redeploy to new version by pushing the changes in your repo.

### Update the translation file

**:white_check_mark: Step-by-step Instructions**

1. In the Cloud9 terminal, execute this command to copy the new translation file into the front-end source code:

```
cp ~/environment/theme-park-backend/4-translate/local-app/translations.json ~/environment/theme-park-frontend/src/languages/
```
### Push to CodeCommit and deploy via Amplify

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

## Next steps ## 

Next, you will use Amazon Kinesis to ingest real-time data from park visitors and convert into business insights using Amazon QuickSight - [click here to continue](../5-park-stats/README.md).
