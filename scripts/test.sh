#!/bin/bash
# Please note this script will run in the default working directory for npm.

# Drop and seed DB
#npm run db:reset

# Start server
echo ''
echo '-------STARTING SERVER'
echo $(date)
killall -9 node
[[ -f nohup.out ]] && rm nohup.out
nohup npm run start:dev > nohup.out &
sleep 4

# Run tests
if (mocha $1)
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
