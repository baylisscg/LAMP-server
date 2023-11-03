FROM node:18.12.1-alpine3.16 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18.12.1-alpine3.16 AS dependencies
COPY package*.json ./
RUN npm ci

FROM node:18.12.1-alpine3.16
WORKDIR /usr/src/app
COPY --from=dependencies node_modules /usr/src/app/node_modules

COPY --from=build /usr/src/app/build/src /usr/src/app/src/

EXPOSE 3000
CMD ["node", "-r", "source-map-support/register", "./src/index.js"]
