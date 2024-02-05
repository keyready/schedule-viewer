import { rtkApi } from 'shared/api/rtkApi';
import { ScheduleDay } from 'entities/ScheduleDay';

interface props {
    workDir: string;
    group: string;
    kafId: string;
}

const fetchScheduleApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getSchedule: build.query<ScheduleDay[], props>({
            query: (props) => ({
                url: '/api/schedule',
                params: {
                    workDir: props.workDir,
                    group: props.group,
                    kafId: props.kafId,
                },
            }),
        }),
    }),
});

export const useSchedule = fetchScheduleApi.useGetScheduleQuery;
