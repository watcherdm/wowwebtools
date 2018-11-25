#! /bin/bash

COMMAND=$1

if [ $COMMAND == 'create' ]; then
  echo "CREATE ROLE wowwebtools WITH LOGIN PASSWORD '$BLIZZARD_SECRET' CREATEDB" | psql postgres
  cat create_dev.sql | psql postgres --u wowwebtools
fi

if [ $COMMAND == 'delete' ]; then
  echo 'DROP DATABASE wowwebtools_dev;' | psql postgres postgres 
  echo 'DROP ROLE wowwebtools;' | psql postgres
fi
