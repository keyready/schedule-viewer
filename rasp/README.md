# Rasp - Desktop клиент для Schedule Viewer

Flutter десктопное приложение для просмотра расписания учебных занятий.

## Структура проекта

```
lib/
├── app/
│   ├── data/
│   │   ├── config/
│   │   │   └── api_config.dart      # Конфигурация API (базовый URL)
│   │   ├── models/
│   │   │   ├── schedule_day_model.dart  # Модель дня расписания
│   │   │   └── subject_model.dart       # Модель предмета
│   │   └── services/
│   │       ├── api_client.dart          # HTTP клиент для API
│   │       └── schedule_service.dart    # Сервис для работы с расписанием
│   ├── modules/
│   │   └── home/                        # Модуль главной страницы
│   └── routes/                          # Маршрутизация
└── main.dart
```

## Настройка

### Конфигурация API

Базовый URL сервера настраивается в `lib/app/data/config/api_config.dart`:

```dart
static const String baseUrl = 'http://localhost:6000';
```

Для изменения URL сервера отредактируйте этот файл.

## Использование

### Пример использования в контроллере

```dart
import 'package:get/get.dart';
import '../../../data/services/schedule_service.dart';

class MyController extends GetxController {
  final ScheduleService _scheduleService = ScheduleService();
  
  // Загрузить список групп
  Future<void> loadGroups() async {
    final groups = await _scheduleService.getGroups();
    // ...
  }
  
  // Загрузить расписание группы
  Future<void> loadSchedule(String group) async {
    final schedule = await _scheduleService.getSchedule(group: group);
    // ...
  }
}
```

### API методы

#### `ScheduleService.getGroups()`
Возвращает список всех доступных групп.

#### `ScheduleService.getSubjects({String? group})`
Возвращает список предметов для указанной группы.

#### `ScheduleService.getSchedule({String? group})`
Возвращает расписание для указанной группы.

#### `ScheduleService.getToday({required DateTime viewedDay})`
Возвращает расписание на указанный день для всех групп.

## Запуск

1. Убедитесь, что сервер запущен на `http://localhost:6000`
2. Установите зависимости:
   ```bash
   flutter pub get
   ```
3. Запустите приложение:
   ```bash
   flutter run -d linux    # для Linux
   flutter run -d windows  # для Windows
   flutter run -d macos    # для macOS
   ```

## Зависимости

- `get: ^4.7.2` - для управления состоянием и маршрутизации
- `http: ^1.2.0` - для HTTP запросов к API
