# Schedule Viewer
WEB-приложение для просмотра расписания учебных занятий на факультете, представленных в .xlsx-таблицах

### Запуск
1. Сервер + БД
   1. `cd server`
   2. `docker-compose up --build`
2. Клиент
   1. `cd client`
   2. `docker build --network=host -t schedule-viewer-client .`
   3. `docker run -p 3000:3000 schedule-viewer-client`

### Приложение будет доступно на `localhost:3000`

### ВНИМАНИЕ! Важна последовательность сборки - сначала сервер, потом клиент
### ВНИМАНИЕ (x2)! Возможно, потребуется vpn для скачивания MongoDB (если нет скачанного latest-образа)