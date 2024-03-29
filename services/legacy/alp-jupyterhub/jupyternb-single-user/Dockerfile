FROM python:3.9-alpine AS builder

RUN apk add --update make

COPY ./alp-libs/python/pyqe/ /tmp-alp/pyqe/

RUN cd /tmp-alp/pyqe && make wheel

#Python v3.9.x
FROM jupyter/minimal-notebook:lab-3.4.2

RUN python -V

#ARG
#GIT COMMIT Passed during docker build time
ARG GIT_COMMIT_ARG

#ENV
ENV GIT_COMMIT=$GIT_COMMIT_ARG

USER root

RUN chown -R root:users /etc/jupyter
RUN chown -R root:users /usr/local/etc

#For Jovyan user | Shouldnt be able to write to folders (system packages)
# RUN chmod -R 755 /opt/conda

RUN chmod -R 755 /etc/jupyter
RUN chmod -R 755 /usr/local

RUN apt update && apt install --yes git build-essential python3.9-venv

USER $NB_UID

COPY alp-jupyterhub/jupyternb-single-user/jp-nb-config/file_handlers.py /etc/jupyter/
COPY alp-jupyterhub/jupyternb-single-user/jp-nb-config/jupyter_notebook_config.py /etc/jupyter/
COPY alp-jupyterhub/jupyternb-single-user/python-packages/* /tmp-alp/
COPY alp-jupyterhub/jupyternb-single-user/fix-permissions /usr/local/bin/fix-permissions
COPY --from=builder /tmp-alp/pyqe/dist/*.whl /tmp-alp/

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /tmp-alp/requirements-hpi.txt
RUN pip install --no-cache-dir /tmp-alp/*.whl jupyterlab-git

RUN jupyter labextension install @jupyterlab/htmlviewer-extension@3.4.2 \
                                 @jupyterlab/hub-extension@3.4.2 \
                                 @jupyterlab/git

WORKDIR $HOME