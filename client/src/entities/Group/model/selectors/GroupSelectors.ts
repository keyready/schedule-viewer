import { StateSchema } from 'app/providers/StoreProvider';

export const getGroupData = (state: StateSchema) => state.group?.data;
export const getGroupIsLoading = (state: StateSchema) =>
    state.group?.isLoading;
export const getGroupError = (state: StateSchema) =>
    state.group?.error;
