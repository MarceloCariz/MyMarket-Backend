FROM node:alpine3.15 as builder

WORKDIR /backend
COPY . .
COPY package.json /backend

RUN yarn install

COPY . /backend

EXPOSE 4000

CMD [ "yarn", "dev"]


