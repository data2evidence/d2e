# alp-jupyterhub

## Artifacts
- Zero to jupyterhub (`z2jh`) project helm files v0.9.1 
    - Repo: `https://github.com/jupyterhub/zero-to-jupyterhub-k8s`
- alp-jupyternb-single-user: Jupyter-notebook docker image
    - Our github folder: `./jupyternb-single-user`
    - Source Repo: `https://github.com/jupyter/docker-stacks/tree/master/datascience-notebook`
- alp-jupyternb-post: Post steps especially those related to K8s PVC of single user notebook

## Helm configurations values.yaml
1. Base configuration in `jupyterhub/values.yaml` provided by z2jh project
2. D4L custom base configuration in `config/deploy/custom_base_config.yaml` i.e, this file must be modified thats common to all environments / default values
3. Environment specific `config/deploy/{dev,staging,prod}/values.yaml

## Jupyter context configurations
1. Jupyterhub config files: `./jupyterhub` & `./config` Helm files
2. Jupyterhub - Jupyter-notebook-Single-user K8s deployment: `./jupyterhub/files/hub/jupyterhub_config.py`
2. Jupyter notebook config files: `./jupyternb-single-user/jp-nb-config` & `./config/deploy/custom_base_config.yaml`

## Docker Image tag
`continuous-image-puller` is a K8s pod that pulls `alp-jupyternb-single-user` docker image onto each K8s nodes after jupyterhub is deployed. The pullpolicy is `Always`.

- In the ./docker-push.yml file, `IMAGE_TAG` environment variable is used.
- The naming convention of the IMAGE_TAG is `latest-dd-mm-yyyy-24HH-MM-SS`
- Before merging to master it is advisable to update the tags in
        - ./docker-push.yml, `IMAGE_TAG` with the current timestamp
        - In `config/deploy/custom_base_config.yaml` file
        - In `jenkinsfile/build.groovy` file, `mapForBranchBasedTag` attribute
        - In `config/deploy/base_metadata.env`
        - After Merging to master branch, ensure the docker image is generated from github actions/Jenkins Build and then proceed to run the jenkins job

## Steps to Create Postgres DB
With this [document](https://alp.atlassian.net/wiki/spaces/IO/pages/2543878271/How+to+create+a+new+user+or+database+in+PostgreSQL) as reference
1. Login as `almost-superuser` (Devlops should have access from here `https://vault.alp-dev.org/ui/vault/secrets/secret/show/sre/postgres/rp-{env}/users/almost-superuser`)
2. Create `alp_jupyterhub` user with CREATEDB priviliges
```
CREATE ROLE alp_jupyterhub CREATEDB LOGIN PASSWORD '<user-password>';
```
3. Login as `alp_jupyterhub` user and create database
```
CREATE DATABASE alp_jupyterhub;
```
4. Login as `almost-superuser` again and revoke the `CREATEDB` role from `alp_jupyterhub` user
```
ALTER USER alp_jupyterhub WITH NOCREATEDB;
```
5. Populate `alp_jupyterhub` credentials in hashicorp vault


