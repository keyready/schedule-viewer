'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
    children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000, // 5 минут
                        gcTime: 10 * 60 * 1000, // 10 минут
                        refetchOnWindowFocus: false,
                        refetchOnMount: false,
                        retry: 3,
                        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
                    },
                    mutations: {
                        retry: 1,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
    );
}
