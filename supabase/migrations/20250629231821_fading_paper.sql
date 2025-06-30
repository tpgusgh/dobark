-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS gambling_db;

-- Create user if it doesn't exist
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'gambling_user') THEN

      CREATE ROLE gambling_user LOGIN PASSWORD 'gambling_password';
   END IF;
END
$do$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gambling_db TO gambling_user;