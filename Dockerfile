FROM node:16
WORKDIR /usr/src/app/src
COPY package*.json ../
RUN npm install
COPY ./src ./
CMD ["npm", "start"]