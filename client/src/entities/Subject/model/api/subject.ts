import { apiClient } from '@/shared/api';
import type { Subject, SubjectApiParams } from '../types/subject';

export const subjectApi = {
    getGroupSubjects: async (params: SubjectApiParams): Promise<Subject[]> => {
        const { groupNumber } = params;

        const response = await apiClient.get('/api/subjects', {
            params: {
                group: groupNumber,
            },
        });

        return response.data;
    },
};
