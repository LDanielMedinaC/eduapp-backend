#!/bin/bash
# Drop DB collections and seed all

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
mongo "$DB_URI" --eval 'db.dropDatabase()'
