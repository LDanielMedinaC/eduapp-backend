#!/bin/bash
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
echo "Drop collections with URI ${DB_URI}"
mongo "$DB_URI" --eval 'db.topics.drop();db.users.drop();db.landingpages.drop();'

# Seed mock data
npm run seed

# Start server
echo ''
echo '-------STARTING SERVER'
echo $(date)
[[ -f nohup.out ]] && rm nohup.out
nohup npm run start:dev > nohup.out &
sleep 5

# Run tests
if (mocha)
then
RESULT=0
else
RESULT=1
fi

# Log server output
echo ''
echo '-------SERVER LOG'
cat nohup.out
echo ''
echo 'SERVER LOG-------'
killall -9 node

exit $RESULT
