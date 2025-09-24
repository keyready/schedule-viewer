import { apiClient } from '@/shared/api';
import { Lectern } from '../types/lectern';

export const lecternApi = {
    getLecterns: async (): Promise<Lectern[]> => {
        const response = await apiClient.get('/api/get_kafs');
        return response.data;
    },
    createLectern: async (title: string) => {
        const response = await apiClient.post('/api/create_kaf', { title });
        return response.data;
    },
    deleteLectern: async (kafId: string) => {
        const response = await apiClient.post('/api/delete', { kafId });
        return response.data;
    },
};
