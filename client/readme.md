## Запуск в докере как SSR-приложение
1. `docker build --network=host -t schedule-viewer-client .`
2. `docker run -p 3000:3000 schedule-viewer-client`