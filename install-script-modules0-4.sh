cd ~/environment/
git clone https://github.com/aws-samples/aws-serverless-workshop-innovator-island ./theme-park-backend
sudo yum install jq -y
sh ~/environment/theme-park-backend/1-app-deploy/module1a-script.sh 

sh ~/environment/theme-park-backend/1-app-deploy/module1b-script.sh 
sh ~/environment/theme-park-backend/2-realtime/module2-script.sh
sh ~/environment/theme-park-backend/3-photos/module3-script.sh
sh ~/environment/theme-park-backend/4-translate/module4-script.sh

