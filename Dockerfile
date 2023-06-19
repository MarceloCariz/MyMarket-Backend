FROM node:alpine3.15 as builder



RUN yarn global add typescript
WORKDIR /backend
COPY . .


RUN yarn install

RUN yarn build




CMD [ "yarn","start"]


