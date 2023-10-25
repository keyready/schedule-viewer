import { createSlice } from '@reduxjs/toolkit';
import { GroupSchema } from '../types/GroupSchema';

const initialState: GroupSchema = {
    data: undefined,
    isLoading: false,
    error: undefined,
};

export const GroupSlice = createSlice({
    name: 'GroupSlice',
    initialState,
    reducers: {},
});

export const { actions: GroupActions } = GroupSlice;
export const { reducer: GroupReducer } = GroupSlice;
