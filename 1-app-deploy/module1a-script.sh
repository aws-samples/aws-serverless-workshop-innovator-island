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
wget https://innovator-island.s3.us-west-2.amazonaws.com/front-end/theme-park-frontend-202310.zip
unzip theme-park-frontend-202310.zip

## Push to CodeCommit
git init -b main
git add .
git commit -am "First commit"

## Push to CodeCommit
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
git push --set-upstream https://git-codecommit.$AWS_REGION.amazonaws.com/v1/repos/theme-park-frontend main



#############Deploy the site with the AWS Amplify Console
while true; do
    read -p "Manually create Amplify App on AWS Console Amplify App and type 'y' to continue: " y
    case $y in
        [Yy]* ) echo "Nice, preparing to run module1b-script.sh"; break;;
        * ) echo "Please type y or Y to once you've created Amplify app and are ready to continue";;
    esac
done