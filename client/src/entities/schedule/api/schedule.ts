import { apiClient } from '@/shared/api';
import type { ScheduleApiParams, ScheduleGroupDay } from '../model/types/schedule';

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
};
