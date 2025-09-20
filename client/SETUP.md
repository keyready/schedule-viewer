# Настройка API с TanStack Query

## 1. Создайте файл .env.local

Создайте файл `.env.local` в корне проекта со следующим содержимым:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

## 2. Запуск проекта

```bash
npm run dev
```

## 3. Использование API

### Основной хук

```tsx
import { useCurrentDaySchedule } from '@/hooks/useSchedule';

function MyComponent() {
    const { data, isLoading, error, refetch } = useCurrentDaySchedule({
        workDir: 'my-work-dir',
        day: '2024-01-15' // опционально
    });

    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error.message}</div>;

    return <div>{/* Отображение данных */}</div>;
}
```

### Хук с автоматическим обновлением

```tsx
import { useScheduleQueries } from '@/hooks/useSchedule';

function MyComponent() {
    const { data, isLoading, error } = useScheduleQueries.useCurrentDayWithAutoRefresh({
        workDir: 'my-work-dir'
    });
    // Данные будут обновляться каждые 5 минут
}
```

## 4. Особенности

- **Кеширование**: Данные кешируются на 5 минут (staleTime) и хранятся в памяти 10 минут (gcTime)
- **Автоматические повторы**: 3 попытки при ошибке с экспоненциальной задержкой
- **DevTools**: Встроенные инструменты разработчика доступны в development режиме
- **SSR/SSG**: Полная поддержка серверного рендеринга Next.js

## 5. Структура файлов

```
src/
├── types/
│   └── schedule.ts          # Типы для API
├── lib/
│   └── api-client.ts        # HTTP клиент и API функции
├── hooks/
│   └── useSchedule.ts       # React хуки с кешированием
├── app/
│   └── providers/
│       └── QueryProvider.tsx # Провайдер для QueryClient
└── components/
    └── ScheduleExample.tsx  # Пример использования
```
