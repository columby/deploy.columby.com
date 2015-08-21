# SETUP ------------------------------
BRANCH="develop";
NODE_PATH="/srv/columby/htdocs/files.columby.com";
PM2_NAME="columby-files"

# DO IT ------------------------------
cd $NODE_PATH
ls
git reset --hard origin/$BRANCH
#git clean -f
git pull
git checkout $BRANCH
npm install
bower install
gulp
pm2 start $PM2_NAME

# END ------------------------------
echo 'Done';
