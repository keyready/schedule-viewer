import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SidebarSchema } from '../types/SidebarTypes';

const initialState: SidebarSchema = {
    data: { isCollapsed: true },
};

export const SidebarSlice = createSlice({
    name: 'SubjectSlice',
    initialState,
    reducers: {
        setCollapsed: (state, action: PayloadAction<boolean>) => {
            state.data.isCollapsed = action.payload;
        },
    },
});

export const { actions: SidebarActions } = SidebarSlice;
export const { reducer: SidebarReducer } = SidebarSlice;
