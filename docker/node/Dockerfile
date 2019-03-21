FROM node:11.12.0-alpine

WORKDIR /app

RUN apk add --no-cache --virtual .gyp \
  python \
  make \
  g++ \
  && npm install --only=production \
  && apk del .gyp

CMD ["npm", "run", "cluster"]

