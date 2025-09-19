FROM node:20-alpine

WORKDIR /server

COPY package*.json ./
RUN npm ci --only=production || npm ci

COPY . .

ENV NODE_ENV=production \
    PORT=5000

EXPOSE 5000

CMD ["node", "index.js"]