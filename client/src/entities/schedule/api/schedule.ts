import { apiClient } from '@/shared/api';
import {
    GroupScheduleApiParams,
    ScheduleApiParams,
    ScheduleGroupDay,
} from '../model/types/schedule';

export const scheduleApi = {
    getCurrentDay: async (params: ScheduleApiParams): Promise<ScheduleGroupDay[]> => {
        const { workDir, day } = params;

        const response = await apiClient.get('/api/today', {
            params: {
                workDir,
                ...(day ? { viewedDay: day } : undefined),
            },
        });

        return response.data;
    },
    getSelectedGroup: async (params: GroupScheduleApiParams): Promise<ScheduleGroupDay[]> => {
        const { groupName } = params;

        const response = await apiClient.get('/api/schedule', {
            params: {
                workDir: '..\\files\\',
                group: groupName,
            },
        });

        return response.data;
    },
};
