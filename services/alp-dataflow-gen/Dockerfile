FROM alpcr.azurecr.io/alp-dataflow-gen-base:develop as dbsvc-build

# Install node and yarn
RUN mkdir -p /usr/local/node
ENV NVM_DIR /usr/local/node
ENV NODE_VERSION 18.16.0

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
RUN . $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use $NODE_VERSION
ENV NODE_HOME $NVM_DIR/versions/node/v$NODE_VERSION
ENV NODE_PATH $NODE_HOME/lib/node_modules
ENV PATH $NODE_HOME/bin:$PATH

RUN npm install --global yarn

# Copy python package
COPY --chown=docker:docker ./alp-libs/python/pydbsvc ./libs/pydbsvc

# Copy alp-libs files into python package
COPY --chown=docker:docker ./alp-libs/nodejs ./libs/pydbsvc/d2e_dbsvc/nodejs/libs
COPY --chown=docker:docker ./alp-libs/nodejs/package.json ./libs/pydbsvc/d2e_dbsvc/nodejs

# Copy alp-db-svc files into python package

# Copy existing migration scripts into separate folder so changelog filepath does not clash with plugin
COPY --chown=docker:docker ./services/alp-db-svc/db ./libs/pydbsvc/d2e_dbsvc/nodejs/dbsvc_files/migration_scripts/db

COPY --chown=docker:docker ./services/alp-db-svc/package.json ./libs/pydbsvc/d2e_dbsvc/nodejs/dbsvc_files/
COPY --chown=docker:docker ./services/alp-db-svc/tsconfig.json ./libs/pydbsvc/d2e_dbsvc/nodejs/dbsvc_files/
COPY --chown=docker:docker ./services/alp-db-svc/src ./libs/pydbsvc/d2e_dbsvc/nodejs/dbsvc_files/src

# setup alp-libs
WORKDIR /app/libs/pydbsvc/d2e_dbsvc/nodejs
RUN yarn install --network-timeout 1000000
RUN yarn workspace @alp/alp-base-utils run compile

# setup alp-db-svc
WORKDIR /app/libs/pydbsvc/d2e_dbsvc/nodejs/dbsvc_files
RUN yarn compile
RUN yarn cache clean

# Add liquibase
ADD https://github.com/liquibase/liquibase/releases/download/v4.5.0/liquibase-4.5.0.tar.gz ./db/migrations/
RUN mkdir -p ./db/migrations/liquibase/
RUN tar xvf ./db/migrations/liquibase-4.5.0.tar.gz -C ./db/migrations/liquibase/

# Make wheel
WORKDIR /app/libs/pydbsvc
RUN pip install wheel
RUN make package

FROM dbsvc-build AS final-build

WORKDIR /app

COPY --chown=docker:docker --chmod=711 ./services/alp-dataflow-gen/pysrc pysrc
COPY --chown=docker:docker --chmod=711 ./services/alp-dataflow-gen/requirements.txt .

RUN pip install -r requirements.txt

COPY --chown=docker:docker ./services/alp-dataflow-gen/init.py .
COPY --chown=docker:docker ./services/alp-dataflow-gen/init.sh .
COPY --chown=docker:docker ./services/alp-dataflow-gen/startprefectagent.sh .
COPY --chown=docker:docker ./services/alp-dataflow-gen/startprefectserver.sh  .
COPY --chown=docker:docker ./services/alp-dataflow-gen/postgresql-42.3.1.jar ./inst/drivers/

COPY --chown=docker:docker ./services/envConverter ./libs/envConverter
WORKDIR /app/libs/envConverter
RUN yarn install

RUN mkdir /output
RUN chown -R docker:docker /output

# Create folder to store R packages installed during runtime for plugins which require custom R packages
RUN mkdir -p /home/docker/plugins/R/site-library
RUN chown -R docker:docker /home/docker/plugins/R/site-library

WORKDIR /app

# Create folder to store synpuf1k csv
RUN mkdir -p /app/synpuf1k
RUN chown -R docker:docker /app/synpuf1k

RUN rm -rf ./libs/pydbsvc

USER docker

