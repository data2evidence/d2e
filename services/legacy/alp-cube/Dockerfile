FROM cubejs/cube:v0.34
WORKDIR /cube/conf

RUN apt update && apt install -y pip

USER node

COPY --chown=node:node --chmod=711 model .
COPY --chown=node:node --chmod=711 requirements.txt .
COPY --chown=node:node --chmod=711 cube.py .

RUN pip install -r requirements.txt
