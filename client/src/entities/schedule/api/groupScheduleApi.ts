import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { scheduleApi } from './schedule';
import { GroupScheduleApiParams, ScheduleGroupDay } from '../model/types/schedule';

export const groupScheduleKeys = {
    all: ['group-schedule'] as const,
    currentDay: (params: GroupScheduleApiParams) =>
        [...groupScheduleKeys.all, 'currentGroup', params] as const,
};

export const useGroupScheduleApi = (
    params: GroupScheduleApiParams,
    options?: Omit<UseQueryOptions<ScheduleGroupDay[], Error>, 'queryKey' | 'queryFn'>,
) =>
    useQuery({
        queryKey: groupScheduleKeys.currentDay(params),
        queryFn: async () => await scheduleApi.getSelectedGroup(params),
        staleTime: 20 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        ...options,
    });
