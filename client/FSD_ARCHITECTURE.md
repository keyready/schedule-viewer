# Feature-Sliced Design (FSD) Architecture

Проект реорганизован согласно принципам Feature-Sliced Design для лучшей масштабируемости и поддерживаемости.

## Структура проекта

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/         # Провайдеры (QueryClient, HeroUI)
│   └── layout.tsx         # Корневой layout
├── pages/                 # Страницы приложения
├── widgets/               # Крупные UI блоки
│   └── schedule/          # Виджет расписания
├── features/              # Бизнес-функции
│   └── schedule/          # Фича работы с расписанием
├── entities/              # Бизнес-сущности
│   └── schedule/          # Сущность расписания
└── shared/                # Переиспользуемые ресурсы
    ├── api/               # API слой
    ├── lib/               # Утилиты
    └── ui/                # UI компоненты
```

## Слои архитектуры

### 1. **app** - Инициализация приложения
- Провайдеры (QueryClient, HeroUI)
- Глобальные настройки
- Роутинг

### 2. **pages** - Страницы
- Композиция виджетов
- Роутинг

### 3. **widgets** - Крупные UI блоки
- `ScheduleWidget` - полный виджет расписания
- Композиция фич и сущностей

### 4. **features** - Бизнес-функции
- `ScheduleFilters` - фильтры расписания
- `ScheduleList` - отображение списка
- Бизнес-логика пользовательских сценариев

### 5. **entities** - Бизнес-сущности
- `useCurrentDaySchedule` - хук для получения данных
- Модели данных
- API интеграция

### 6. **shared** - Переиспользуемые ресурсы
- **api** - HTTP клиент, типы API
- **lib** - утилиты (groupScheduleByCourse)
- **ui** - базовые UI компоненты

## Принципы FSD

### Импорты
- ✅ Можно импортировать только из нижележащих слоев
- ✅ Нельзя импортировать из вышележащих слоев
- ✅ Shared может использоваться везде

### Примеры правильных импортов:
```typescript
// В features/schedule можно импортировать:
import { useCurrentDaySchedule } from '@/entities/schedule';
import { Button } from '@/shared/ui';
import { ScheduleDay } from '@/shared/api';

// В entities/schedule можно импортировать:
import { scheduleApi } from '@/shared/api';
import { groupScheduleByCourse } from '@/shared/lib';
```

### Примеры неправильных импортов:
```typescript
// ❌ Нельзя импортировать из features в entities
import { ScheduleFilters } from '@/features/schedule';

// ❌ Нельзя импортировать из widgets в features
import { ScheduleWidget } from '@/widgets/schedule';
```

## Преимущества FSD

1. **Масштабируемость** - легко добавлять новые фичи
2. **Изоляция** - изменения в одном слое не влияют на другие
3. **Переиспользование** - shared компоненты доступны везде
4. **Тестируемость** - каждый слой можно тестировать отдельно
5. **Читаемость** - четкая структура и разделение ответственности

## Использование

### Основной виджет
```tsx
import { ScheduleWidget } from '@/widgets/schedule';

export default function Home() {
    return <ScheduleWidget />;
}
```

### Отдельные компоненты
```tsx
import { ScheduleFilters, ScheduleList } from '@/features/schedule';
import { useCurrentDaySchedule } from '@/entities/schedule';
import { Button } from '@/shared/ui';
```

### API и типы
```tsx
import { scheduleApi, ScheduleDay } from '@/shared/api';
import { groupScheduleByCourse } from '@/shared/lib';
```

## Настройка

1. Убедитесь, что в `tsconfig.json` настроены пути:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

2. Создайте `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Запустите проект:
```bash
npm run dev
```

