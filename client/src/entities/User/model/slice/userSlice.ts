import { createSlice } from '@reduxjs/toolkit';
import { UserSchema } from '../types/user';

const initialState: UserSchema = {
    _inited: false,
};

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        initAuthData: (state) => {
            // проверить, авторизован ли пользователь (после закрытия и открытия приложения)
            state._inited = true;
        },
    },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
