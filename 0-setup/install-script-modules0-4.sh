#!/bin/bash

#git clone https://github.com/aws-samples/aws-serverless-workshop-innovator-island ./theme-park-backend

while true; do
  read -p "Is it Amazon Linux 2? (y/n): " yn
  case $yn in
    [Yy]* ) sudo yum install jq -y; break;;
    [Nn]* ) sudo apt update;sudo apt install -y jq;break;;
    * ) echo "Please answer yes or no.";;
  esac
done

sh ~/environment/theme-park-backend/1-app-deploy/module1a-script.sh 
sh ~/environment/theme-park-backend/1-app-deploy/module1b-script.sh 
sh ~/environment/theme-park-backend/2-realtime/module2-script.sh
sh ~/environment/theme-park-backend/3-photos/module3-script.sh
sh ~/environment/theme-park-backend/4-translate/module4-script.sh

