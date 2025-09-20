import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import type { Subject, SubjectApiParams } from '../types/subject';
import { subjectApi } from './subject';

export const subjectKeys = {
    all: ['subject'] as const,
    currentDay: (params: SubjectApiParams) => [...subjectKeys.all, 'subjects', params] as const,
};

export const useSubjects = (
    params: SubjectApiParams,
    options?: Omit<UseQueryOptions<Subject[], Error>, 'queryKey' | 'queryFn'>,
) =>
    useQuery({
        queryKey: subjectKeys.currentDay(params),
        queryFn: async () => await subjectApi.getGroupSubjects(params),
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...options,
    });
