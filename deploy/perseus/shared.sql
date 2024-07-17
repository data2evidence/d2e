--- init.sql in perseus/shared-db

--- Files Manager
CREATE SCHEMA "files_manager";
CREATE USER files_manager WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA files_manager TO files_manager;
GRANT ALL PRIVILEGES ON SCHEMA files_manager TO files_manager;


--- White Rabbit
CREATE SCHEMA "white_rabbit";
CREATE USER white_rabbit WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA white_rabbit TO white_rabbit;
GRANT ALL PRIVILEGES ON SCHEMA white_rabbit TO white_rabbit;


--- User
CREATE SCHEMA "user";
CREATE USER "user" WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA "user" TO "user";
GRANT ALL PRIVILEGES ON SCHEMA "user" TO "user";


--- CDM Builder
CREATE SCHEMA "builder";
CREATE USER builder WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA builder TO builder;
GRANT ALL PRIVILEGES ON SCHEMA builder TO builder;


--- Perseus
CREATE SCHEMA "perseus";
CREATE USER perseus WITH ENCRYPTED PASSWORD 'password';

GRANT USAGE ON SCHEMA perseus TO perseus;
GRANT ALL PRIVILEGES ON SCHEMA perseus TO perseus;


--- Source Database
CREATE DATABASE source;
CREATE USER source WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE source TO source;