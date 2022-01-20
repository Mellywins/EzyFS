#!/bin/sh
systemctl start redis-server.service  &
/etc/init.d/postgresql start  &
sleep 1
echo $POSTGRES_DB
sudo -i -u postgres createdb project
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
npm run start:prod