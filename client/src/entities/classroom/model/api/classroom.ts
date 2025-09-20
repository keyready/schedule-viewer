import { apiClient } from '@/shared/api';
import { Classroom } from '../types/classroom';

export const classroomApi = {
    getClassrooms: async (): Promise<Classroom[]> => {
        const response = await apiClient.get('/api/fetch_auds');
        return response.data;
    },
};
