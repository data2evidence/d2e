# JupyterHub Single user Image

- This image is the base for each logged in jupyterhub user  
the file `pyqe-0.0.2-py3-none-any.whl` is the build distribution of [pyqe](https://github.com/alp/alp-clinical-research) repo created by running `python3 setup.py sdist bdist_wheel`.

- There are two images one for the 
    - jupyter-notebook-single-user and 
    - an another one to fix the permissions of some of the folders
