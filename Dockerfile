FROM node:20-alpine

WORKDIR /usr/schedule-viewer

COPY . .

RUN cd ./server && npm ci

RUN cd ./client && npm ci
RUN cd ./client && npm run build


EXPOSE 5000
CMD cd ./server && npm start

# docker build -t schedule-viewer .                             - собрать образ
# docker run -d --network host --name server schedule-viewer    - запустить контейнер
