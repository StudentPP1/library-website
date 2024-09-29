FROM node:20-alpine3.19 as build

WORKDIR /app

COPY package.json .

RUN yarn install

RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 5173

CMD [ "npm", "run", "preview" ]
