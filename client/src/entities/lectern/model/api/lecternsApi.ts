import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { lecternApi } from './lectern';
import type { Lectern } from '../types/lectern';

export const lecternsKeys = {
    all: ['lecterns'] as const,
    currentDay: () => [...lecternsKeys.all, 'currentDay'] as const,
};

export const useLecterns = (
    _: void,
    options?: Omit<UseQueryOptions<Lectern[], Error>, 'queryKey' | 'queryFn'>,
) =>
    useQuery({
        queryKey: lecternsKeys.currentDay(),
        queryFn: async () => await lecternApi.getLecterns(),
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...options,
    });
