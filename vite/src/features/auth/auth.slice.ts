import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoading: true,
    isError: false,
    isSuccess: false,
    message: ''
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setError: (state, action) => {
            state.isError = true;
            state.message = action.payload;
            state.isLoading = false;
        },
        setSuccess: (state, action) => {
            state.isSuccess = true;
            state.message = action.payload;
            state.isLoading = false;
        },
        resetState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    }
});

export const { setLoading, setUser, setError, setSuccess, resetState } = authSlice.actions;
export default authSlice.reducer;
