FROM node:latest

WORKDIR /server

COPY package*.json ./
RUN npm install -g npm@10.2.3
RUN npm install --force
COPY . .

EXPOSE 5000
CMD ["npm", "start"]
