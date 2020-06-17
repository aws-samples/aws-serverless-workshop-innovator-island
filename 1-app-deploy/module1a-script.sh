##### Run module1a-script
##### Then manually create Amplify Console app
##### Run module1b-script

##############Module 1a-app-deploy

## Create the repository
aws codecommit create-repository --repository-name theme-park-frontend

## Clone the frontend code base

git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
mkdir ~/environment/theme-park-frontend
cd ~/environment/theme-park-frontend
wget https://innovator-island.s3-us-west-2.amazonaws.com/front-end/theme-park-frontend.zip
unzip theme-park-frontend.zip 

## Push to CodeCommit
cd ~/environment/theme-park-frontend/
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
git push --set-upstream https://git-codecommit.$AWS_REGION.amazonaws.com/v1/repos/theme-park-frontend master


#############Deploy the site with the AWS Amplify Console

read -p "Manually create Amplify Console App and then continue with module1b-script.sh"

