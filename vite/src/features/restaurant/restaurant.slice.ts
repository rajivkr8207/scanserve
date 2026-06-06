import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    restaurant: null,
    categories: [],
    menus: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
};

export const restaurantSlice = createSlice({
    name: 'restaurant',
    initialState,
    reducers: {
        setRestaurantLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setRestaurantData: (state, action) => {
            state.restaurant = action.payload;
        },
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setMenus: (state, action) => {
            state.menus = action.payload;
        },
        setRestaurantError: (state, action) => {
            state.isError = true;
            state.message = action.payload;
            state.isLoading = false;
        },
        setRestaurantSuccess: (state, action) => {
            state.isSuccess = true;
            state.message = action.payload;
            state.isLoading = false;
        },
        resetRestaurantState: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.isLoading = false;
            state.message = '';
        }
    }
});

export const { 
    setRestaurantLoading, 
    setRestaurantData, 
    setCategories, 
    setMenus, 
    setRestaurantError, 
    setRestaurantSuccess, 
    resetRestaurantState 
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
