import { rtkApi } from 'shared/api/rtkApi';
import { ScheduleDay } from 'entities/ScheduleDay';
import { GroupedSchedule } from '../model/types/ScheduleDay';
import { groupScheduleByCourse } from '@/shared/lib/getCourseNumber/getCourseNumber';

interface props {
    workDir: string;
    day?: string;
}

const fetchCurrentDayApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getCurrentDay: build.query<GroupedSchedule, props>({
            query: ({ day, workDir }) => ({
                url: '/api/today',
                params: {
                    workDir: workDir,
                    ...(day ? { viewedDay: day } : undefined),
                },
            }),
            transformResponse: (response: ScheduleDay[]) => {
                return groupScheduleByCourse(response);
            },
        }),
    }),
});

export const useCurrentDaySchedule = fetchCurrentDayApi.useGetCurrentDayQuery;
