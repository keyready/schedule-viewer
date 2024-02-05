import { rtkApi } from 'shared/api/rtkApi';

export interface IKaf {
    title: string;
    _id: string;
}

const fetchAllKafs = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getKafs: build.query<IKaf[], void>({
            query: () => ({
                url: '/api/get_kafs',
            }),
        }),
    }),
});

export const useKafs = fetchAllKafs.useGetKafsQuery;
