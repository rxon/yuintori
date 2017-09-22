FROM mhart/alpine-node:8.5

WORKDIR /app
COPY . .

RUN apk --update --no-cache add imagemagick && \
    npm install --production && \
    mkdir public

EXPOSE 3000
CMD ["npm", "start"]