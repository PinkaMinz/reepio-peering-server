FROM node:alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app
COPY ./config/dev/logging.dist.json /usr/src/app/src/config/dev/logging.json
COPY ./config/dev/peering-server.dist.json /usr/src/app/src/config/dev/peering-server.json

EXPOSE 9000

CMD [ "npm", "start" ]