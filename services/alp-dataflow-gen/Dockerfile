FROM alpcr.azurecr.io/alp-dataflow-gen-base:v0.4.0-beta as dbsvc-build

# Required for RPostgres R package
RUN apt-get update && apt-get install libpq5 libpq-dev -y --no-install-recommends && apt-get clean

# Dependency for pandas in dataflow-gen
RUN apt-get -y install musl-dev
RUN ln -s /usr/lib/x86_64-linux-musl/libc.so /lib/libc.musl-x86_64.so.1

ADD https://github.com/liquibase/liquibase/releases/download/v4.5.0/liquibase-4.5.0.tar.gz .
RUN mkdir -p ./liquibase/
RUN tar xvf liquibase-4.5.0.tar.gz -C ./liquibase/

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

FROM dbsvc-build AS final-build

WORKDIR /app

# To support offline installation
# Create folder to store R packages installed during runtime for plugins which require custom R packages
ENV R_LIBS_USER_DIR /home/docker/plugins/R/site-library
RUN mkdir -p $R_LIBS_USER_DIR
RUN chown -R docker:docker $R_LIBS_USER_DIR

# Common Data Model
RUN Rscript -e "remotes::install_github('OHDSI/CommonDataModel@v5.4.1', quiet=FALSE, upgrade='never', force=TRUE, dependencies=FALSE, lib='$R_LIBS_USER_DIR')"

# Data Characterization
RUN Rscript -e "remotes::install_github('OHDSI/Achilles@v1.7.2',quiet=FALSE, upgrade='never', force=TRUE, dependencies=FALSE, lib='$R_LIBS_USER_DIR')"


# Add Apache Ant for i2b2 data model creation
ENV ANT_VERSION=1.9.6
ENV I2B2_TAG_NAME 1.8.1.0001

RUN wget http://archive.apache.org/dist/ant/binaries/apache-ant-${ANT_VERSION}-bin.tar.gz \
    && tar xvfvz apache-ant-${ANT_VERSION}-bin.tar.gz -C /opt \
    && ln -sfn /opt/apache-ant-${ANT_VERSION} /opt/ant \
    && sh -c 'echo ANT_HOME=/opt/ant >> /etc/environment' \
    && ln -sfn /opt/ant/bin/ant /usr/bin/ant \
    && rm apache-ant-${ANT_VERSION}-bin.tar.gz

# Download i2b2 source code
RUN wget https://github.com/i2b2/i2b2-data/archive/refs/tags/v$I2B2_TAG_NAME.tar.gz
RUN tar -xzf v$I2B2_TAG_NAME.tar.gz
# Change ownership to overwrite db.properties in flow definition
RUN chown -R docker:docker /app/i2b2-data-$I2B2_TAG_NAME


COPY --chown=docker:docker --chmod=711 ./services/alp-dataflow-gen/requirements.txt .
RUN pip install -r requirements.txt

COPY --chown=docker:docker --chmod=711 ./services/alp-dataflow-gen/pysrc pysrc

COPY --chown=docker:docker ./services/alp-dataflow-gen/init.py .
COPY --chown=docker:docker ./services/alp-dataflow-gen/init.sh .
COPY --chown=docker:docker ./services/alp-dataflow-gen/init.R .
COPY --chown=docker:docker ./services/alp-dataflow-gen/startprefectagent.sh .
COPY --chown=docker:docker ./services/alp-dataflow-gen/startprefectserver.sh  .
COPY --chown=docker:docker ./services/alp-dataflow-gen/postgresql-42.3.1.jar ./inst/drivers/

COPY --chown=docker:docker ./services/envConverter ./libs/envConverter
WORKDIR /app/libs/envConverter
RUN yarn install

RUN mkdir /output
RUN chown -R docker:docker /output


WORKDIR /app

# Create folder for duckdb database files
RUN mkdir ./duckdb_data
RUN chown docker:alp ./duckdb_data
RUN mkdir -p ./cdw-config/duckdb_data
RUN chown -R docker:alp ./cdw-config

# Create folder to store synpuf1k csv
RUN mkdir -p /app/synpuf1k
RUN mkdir -p /app/ui-files
RUN chown -R docker:docker /app/synpuf1k /app/ui-files

USER docker