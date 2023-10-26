import { rtkApi } from 'shared/api/rtkApi';

const fetchGroupsApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getGroups: build.query<string[], string>({
            query: (dir) => ({
                url: '/api/groups',
                params: {
                    dir,
                },
            }),
        }),
    }),
});

export const useGroups = fetchGroupsApi.useGetGroupsQuery;
