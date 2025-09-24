import { apiClient } from '@/shared/api';
import { Classroom, CreateClassroomAPI } from '../types/classroom';

export const classroomApi = {
    getClassrooms: async (): Promise<Classroom[]> => {
        const response = await apiClient.get('/api/fetch_auds');
        return response.data;
    },
    createClassrooms: async (props: CreateClassroomAPI) => {
        const response = await apiClient.post('/api/add_auds_to_kaf', props);
        return response.data;
    },
    deleteClassroom: async (classroomId: string) => {
        await apiClient.post('/api/delete', { audId: classroomId });
    },
};
