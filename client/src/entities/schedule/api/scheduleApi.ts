import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { groupScheduleByCourse } from '@/shared/lib';
import { scheduleApi } from './schedule';
import type { GroupedSchedule, ScheduleApiParams } from '../model/types/schedule';

export const scheduleKeys = {
    all: ['schedule'] as const,
    currentDay: (params: ScheduleApiParams) => [...scheduleKeys.all, 'currentDay', params] as const,
};

export const useCurrentDaySchedule = (
    params: ScheduleApiParams,
    options?: Omit<UseQueryOptions<GroupedSchedule, Error>, 'queryKey' | 'queryFn'>,
) =>
    useQuery({
        queryKey: scheduleKeys.currentDay(params),
        queryFn: async () => {
            const data = await scheduleApi.getCurrentDay(params);
            return groupScheduleByCourse(data);
        },
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...options,
    });
