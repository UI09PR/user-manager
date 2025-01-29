FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG CLIENT_PORT
ENV CLIENT_PORT=${CLIENT_PORT}

EXPOSE ${CLIENT_PORT}

CMD ["npm", "run", "dev"]
