# Этап 1: Сборка Flutter Web приложения
FROM instrumentisto/flutter:3.35.7 AS build
WORKDIR /app

# Копируем файлы проекта
COPY pubspec.yaml pubspec.lock ./
RUN flutter pub get

COPY . .

# Собираем Flutter Web приложение
RUN flutter build web --release

# Этап 2: Обслуживание через nginx
FROM nginx:alpine

# Копируем собранное приложение в nginx
COPY --from=build /app/build/web /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 2001

CMD ["nginx", "-g", "daemon off;"]

