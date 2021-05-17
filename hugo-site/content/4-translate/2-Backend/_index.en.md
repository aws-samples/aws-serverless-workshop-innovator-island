+++
title = "Backend"
weight = 12
+++

## How it works

* The front-end application uses a local languages resource file to substitute language strings when the locale is changed. 
* You will download this file and use a Node function that uses Amazon Translate to create a new file with a range of translations.
* After the new language file is created, you will copy it into the frontend code and republish through Amplify Console.
* Finally you will reload the front-end and test the new language functionality.

### Step-by-step instructions ###

1. Go to the AWS Management Console, click **Services** then select [**Cloud9**](https://console.aws.amazon.com/cloud9) under Developer Tools. **Make sure your region is correct.**
2. In the left panel of the IDE, open the ```4-translate/local-app``` folder in the aws-serverless-workshop-innovator-island directory. Click on ```translations-input.json``` to see the English input language file.
3. In the left panel of the IDE, click on the ```translate.js``` file to open. This contains a function you will execute locally to translate the input file.

4. Select your target languages. On line 23, the ```targetLanguages``` array shows a list of languages for translation. Currently this is set to French, Spanish and Japanese - you can modify this array to include of the supported language codes (show on line 16 in the ```possibleLanguages``` array). Choose 4-5 different languages.
5. **Save** the file after making any changes.
 
### Starting the translation process

1. In the terminal, run the following command to install local dependencies for the Node.js script:

```
cd ~/environment/theme-park-backend/4-translate/local-app/
npm install 
```

2. If you are running this workshop in any region except South America (São Paulo) sa-east-1, set the AWS_REGION variable using your region:
```
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
```

3. If are running this workshop in the South America (São Paulo) sa-east-1 Region, the Amazon Translate service is not supported in this region. Instead, set the AWS_REGION variable to use the service in US East (N. Virginia) us-east-1:
```
AWS_REGION='us-east-1'
```

4. Run the local Node application by running the following commands which will use Amazon Translate to create the translation file:

```
node ./translate.js $AWS_REGION
```

5. After a few seconds, the function completes and has created a new file in the same directory called ```translations.json```. Click on the file in the left panel of the IDE to inspect the contents. You will see it contains translations of the string resources in the target languages.
