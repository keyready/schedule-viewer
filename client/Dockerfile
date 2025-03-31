FROM node:23.10-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i --force

COPY . .

RUN if [ "$(uname -m)" = "aarch64" ]; then \
      npm install @rollup/rollup-linux-arm64-musl --no-save; \
    elif [ "$(uname -m)" = "x86_64" ]; then \
      npm install @rollup/rollup-linux-x64-musl --no-save; \
    fi

RUN npm run build