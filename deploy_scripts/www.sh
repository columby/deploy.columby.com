# SETUP ------------------------------
BRANCH="develop";
NODE_PATH="/srv/columby/htdocs/www.columby.com";


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

# END ------------------------------
echo 'Done';
