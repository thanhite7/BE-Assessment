#!/bin/sh

echo "Waiting for MySQL to be ready..."

while ! nc -z mysql 3306; do
  echo "MySQL is not ready - sleeping 2 seconds..."
  sleep 2
done
echo "MySQL is ready!"

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting the application..."
exec npm start
