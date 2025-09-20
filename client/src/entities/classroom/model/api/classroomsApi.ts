import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { classroomApi } from './classroom';
import type { Classroom } from '../types/classroom';

export const classroomsKeys = {
    all: ['classrooms'] as const,
    currentDay: () => [...classroomsKeys.all, 'currentDay'] as const,
};

export const useClassrooms = (
    _: void,
    options?: Omit<UseQueryOptions<Classroom[], Error>, 'queryKey' | 'queryFn'>,
) =>
    useQuery({
        queryKey: classroomsKeys.currentDay(),
        queryFn: async () => await classroomApi.getClassrooms(),
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...options,
    });
