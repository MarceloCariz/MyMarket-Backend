FROM node:18.16.0-alpine

WORKDIR /backend

COPY package.json /backend

RUN yarn install

COPY . /backend

EXPOSE 4000

CMD [ "yarn", "dev"]


