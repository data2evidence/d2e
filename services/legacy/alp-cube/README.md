# ALP Cube

CubeJS instance that connects to minerva postgres

## Description

- Run `yarn build:cube:minerva` to build images for alp services including alp-cube
- Run `yarn start:cube:minerva` to start container for alp services including alp-cube
- If `CUBE_DEV_MODE` is set to true, dev playground UI can be viewed from `http://127.0.0.1:41140`
- To use the SQL API in DBeaver, set up a new postgres connection to port `41109` 
  - Run `select * from information_schema.tables` in the sql editor to view the list of data models available for querying

## Configuration

Configuration options can be defined inside `cube.py`. This should always be mounted to /conf/conf when using Docker.
Some examples of what can be configured:
- REST API base path url
- Scheduled refresh time zone
- Authentication
- Etc.

## Data Models

Cube supports the dynamic creation of YAML data models through the use of jinja templates and python
These data model template files have to be placed inside the `model/cubes` folder.

### Components

| File | Description                                 |
| --------- | ------------------------------------------- |
| `*.yml.jinja` | These are the jinja template files which are structured like a static YAML data model with support for loops and macros for the dynamic generation of measures and dimensions. |
| `globals.py`  | Contains the helper functions written in python that can be imported into the `*.yml.jinja` and then called to load data |
| `requirements.txt`  | For installation of package dependencies used in `globals.py` |
