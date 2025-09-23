# Schedule Viewer
WEB-приложение для просмотра расписания учебных занятий на факультете, представленных в .xlsx-таблицах

### Запуск
1. Клиент
   1. `cd client`
   2. `docker build -t schedule-viewer-client .`
   3. `docker run -p 3000:3000 schedule-viewer-client`
2. Сервер + БД
   1. `cd server`
   2. `docker-compose up --build`

### Приложение будет доступно на `localhost:3000`

### ВНИМАНИЕ! Возможно, потребуется vpn для скачивания MongoDB (если нет скачанного latest-образа)