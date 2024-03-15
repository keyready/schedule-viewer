import { rtkApi } from 'shared/api/rtkApi';

export interface IKaf {
    title: string;
    _id: string;
}

interface IDelete {
    audId?: string;
    kafId?: string;
}

interface IAudAdd {
    audsTitles: string[];
    parentKafId: string;
}

const fetchAllKafs = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getKafs: build.query<IKaf[], void>({
            query: () => ({
                url: '/api/get_kafs',
            }),
        }),

        addKaf: build.mutation<IKaf, string>({
            query: (kafTitle) => ({
                url: '/api/create_kaf',
                method: 'post',
                body: { title: kafTitle },
            }),
        }),

        deleteKaf: build.mutation<IKaf, IDelete>({
            query: (props) => ({
                url: '/api/delete',
                method: 'delete',
                body: props,
            }),
        }),
    }),
});

const fetchAllAuds = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        getAuds: build.query<IKaf[], void>({
            query: () => ({
                url: '/api/fetch_auds',
            }),
        }),

        addAud: build.mutation<IKaf, IAudAdd>({
            query: (props) => ({
                url: '/api/add_auds_to_kaf',
                method: 'post',
                body: props,
            }),
        }),

        deleteAud: build.mutation<IKaf, IDelete>({
            query: (props) => ({
                url: '/api/delete',
                method: 'delete',
                body: props,
            }),
        }),
    }),
});

export const useKafs = fetchAllKafs.useGetKafsQuery;
export const useCreateKaf = fetchAllKafs.useAddKafMutation;
export const useDeleteKaf = fetchAllKafs.useDeleteKafMutation;

export const useAuds = fetchAllAuds.useGetAudsQuery;
export const useCreateAud = fetchAllAuds.useAddAudMutation;
export const useDeleteAud = fetchAllAuds.useDeleteAudMutation;
