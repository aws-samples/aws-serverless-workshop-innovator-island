###########MODULE 4-Language translation
cd ~/environment/theme-park-backend/4-translate/local-app/
npm install 
AWS_REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone | sed 's/\(.*\)[a-z]/\1/')
node ./translate.js $AWS_REGION
##Update frontend
cp ~/environment/theme-park-backend/4-translate/local-app/translations.json ~/environment/theme-park-frontend/src/languages/
cd ~/environment/theme-park-frontend/
git commit -am "Module 4 - Translations"
git push

