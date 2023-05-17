FROM node:lts-alpine3.17

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . /app

CMD [ "npm", "start" ] 