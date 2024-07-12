FROM node:18.20.2-slim

WORKDIR /home/docker/src

COPY ./src .

RUN npm install
RUN npm run build

ENTRYPOINT ["npm", "run", "seed"]
