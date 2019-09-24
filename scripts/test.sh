# !/bin/bash
# Please note this script will run in the default working directory for npm.

# Load .env
[[ -f .env ]] && source .env

if [[ "$DB_LOCATION" = "local" ]]
then
DB_URI=$DB_HOST:$DB_PORT/$DB_NAME
else
DB_URI=mongodb+srv://$DB_USER:$DB_PASS@$DB_HOST
fi

# Drop collections in DB
mongo $DB_URI --eval 'db.topics.drop();db.users.drop();db.landingpages.drop();'

# Seed mock data
npm run seed

# Start server
echo ''
echo '-------STARTING SERVER'
echo $(date)
[[ $(lsof -t -i:8000) ]] && kill -9 $(lsof -t -i:8000)
[[ -f nohup.out ]] && rm nohup.out
nohup npm run start:dev &
sleep 5

# Run tests
mocha

# Log server output
echo ''
echo '-------SERVER LOG'
cat nohup.out
echo ''
echo 'SERVER LOG-------'
