FROM node:latest

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY package.json .
COPY wait-for.sh wait-for.sh
RUN chmod +x wait-for.sh

USER node

RUN npm i

COPY --chown=node:node . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "./dist/main.js" ]
