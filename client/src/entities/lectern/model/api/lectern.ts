import { apiClient } from '@/shared/api';
import { Lectern } from '../types/lectern';

export const lecternApi = {
    getLecterns: async (): Promise<Lectern[]> => {
        const response = await apiClient.get('/api/get_kafs');
        return response.data;
    },
};
