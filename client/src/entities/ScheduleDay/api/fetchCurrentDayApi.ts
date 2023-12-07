import { rtkApi } from 'shared/api/rtkApi';
import { ScheduleDay } from 'entities/ScheduleDay';

interface props {
    workDir: string;
}

const fetchCurrentDayApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getCurrentDay: build.query<ScheduleDay[], props>({
            query: (props) => ({
                url: '/api/today',
                params: {
                    workDir: props.workDir,
                },
            }),
        }),
    }),
});

export const useCurrentDaySchedule = fetchCurrentDayApi.useGetCurrentDayQuery;
