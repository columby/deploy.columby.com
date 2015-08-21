# SETUP ------------------------------
BRANCH="develop";
NODE_PATH="/srv/columby/htdocs/api.columby.com";
PM2_NAME="columby-api";


# DO IT ------------------------------
cd $NODE_PATH
ls
git reset --hard origin/$BRANCH
#git clean -f
git pull
git checkout $BRANCH
npm install
# gulp build
pm2 start $PM2_NAME


# END ------------------------------
echo 'Done';
