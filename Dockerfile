FROM mhart/alpine-node:8.4
MAINTAINER rxon

ENV HOME=/home/i
ENV APP=starter-app

RUN adduser -D -s /bin/false i

# build tools for native dependencies
RUN apk add --update make gcc g++ python git

# graphicsmagick
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories;
RUN apk add --update graphicsmagick && rm -rf /var/cache/apk/*

COPY package.json $HOME/$APP/
RUN chown -R i:i $HOME/*

USER i
WORKDIR $HOME/$APP
RUN npm install

USER root
COPY . $HOME/$APP
RUN ["node_modules/.bin/webpack", "-p"]
RUN mkdir sessions
RUN chown -R i:i $HOME/*
USER i

EXPOSE 3001
CMD ["node_modules/.bin/forever", "src/server.js"]