#!/bin/sh
set -eu

: "${POSTGRES_APP_USER:?POSTGRES_APP_USER must be configured}"
: "${POSTGRES_APP_PASSWORD:?POSTGRES_APP_PASSWORD must be configured}"

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  --set=ON_ERROR_STOP=1 \
  --set=app_user="$POSTGRES_APP_USER" \
  --set=app_password="$POSTGRES_APP_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'app_user', :'app_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'app_user')
\gexec
SELECT format('GRANT CONNECT ON DATABASE %I TO %I', current_database(), :'app_user')
\gexec
GRANT USAGE, CREATE ON SCHEMA public TO :"app_user";
SQL
