# Install Conda Packages on ALP Jupyter LAB offline

Since Jupyter lab cant connect to the internet for security reasons, this is an alternative way to install conda packages.

### Require Linux Environment

If your local machine OS isnt a linux based, then its a good idea to run a linux docker container locally. This is needed because certain packages are platform specific and since ALP Jupyter lab runs on linux, the downloaded packages have to be Linux compatible.

- Install Docker: https://docs.docker.com/get-docker/
- Run the following command
```
docker run -it continuumio/miniconda3 /bin/bash
```
- Once inside the docker, create a new directory, for example myconda `mkdir myconda`
- Then run the conda install command with `--download-only` flag. Use any conda channel and package you want to download to the docker container

## Download Conda Packages

```
CONDA_PKGS_DIRS=./ conda install --download-only -c plotly jupyter-dash
```

- Tarball the downloaded packages in the current folder
```
cd ../ && tar -cvzf myconda.tgz myconda
```

- Exit the container, by running the command `exit`
- Then run `docker ps --all -l`, see the container id for the image `continuumio/miniconda3`
- Copy the tarball to your local machine
```
docker cp <container-id>:/myconda.tgz myconda.tgz
```


## Install Conda Packages on ALP Jupyter Lab

- Upload the myconda.tgz to ALP Jupyter Lab under `tmp` folder. **Please use only tmp folder for these purposes!!**

- untar by running the command in a jupyter notebook
```
!cd /home/jovyan/user/tmp && tar -xvf myconda.tgz
```

- Run the conda command to install the packages onto jupyternotebook
```
!cd /home/jovyan/user/tmp/myconda/ && conda install --offline *.conda *.bz2
```

- Run to create symlinks for python to find the site packages.
```
!rm -rf /home/jovyan/user/tmp/site-packages/* && find /home/jovyan/user/tmp/pkgs -name "site-packages" -execdir sh -c 'for f in $(realpath site-packages/*); do ALP_DIRNAME=$(basename $f);ln -s $f /home/jovyan/user/tmp/site-packages/${ALP_DIRNAME}; done' \;
```

- Use these python statements as the first cell in your jupyter notebook when trying to use the installed packages
```
import sys
sys.path.insert(0, '/home/jovyan/user/tmp/site-packages')
```