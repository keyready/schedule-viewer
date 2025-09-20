'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    // Создаем QueryClient с оптимальными настройками для Next.js
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Время, в течение которого данные считаются свежими
                        staleTime: 5 * 60 * 1000, // 5 минут
                        // Время жизни данных в кеше
                        gcTime: 10 * 60 * 1000, // 10 минут
                        // Не перезапрашивать при фокусе окна
                        refetchOnWindowFocus: false,
                        // Не перезапрашивать при монтировании, если данные есть в кеше
                        refetchOnMount: false,
                        // Количество попыток при ошибке
                        retry: 3,
                        // Экспоненциальная задержка между попытками
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                    mutations: {
                        // Количество попыток для мутаций
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {/* DevTools только в development режиме */}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
