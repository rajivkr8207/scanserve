import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IRestaurant } from '@shared/types/restaurant.type';

interface RestaurantState {
  restaurants: IRestaurant[];
  currentRestaurant: IRestaurant | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setRestaurants: (state, action: PayloadAction<IRestaurant[]>) => {
      state.restaurants = action.payload;
    },
    setCurrentRestaurant: (state, action: PayloadAction<IRestaurant | null>) => {
      state.currentRestaurant = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addRestaurant: (state, action: PayloadAction<IRestaurant>) => {
      state.restaurants.push(action.payload);
    },
    updateRestaurantInList: (state, action: PayloadAction<IRestaurant>) => {
      const index = state.restaurants.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.restaurants[index] = action.payload;
      }
      if (state.currentRestaurant?._id === action.payload._id) {
        state.currentRestaurant = action.payload;
      }
    },
  },
});

export const {
  setRestaurants,
  setCurrentRestaurant,
  setLoading,
  setError,
  addRestaurant,
  updateRestaurantInList,
} = restaurantSlice.actions;
export default restaurantSlice.reducer;
