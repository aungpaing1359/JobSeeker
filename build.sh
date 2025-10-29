#!/bin/bash

# Exit on error
set -e

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Running migrations..."
python manage.py migrate

echo "Starting Gunicorn server..."
exec gunicorn JobSeeker.wsgi:application