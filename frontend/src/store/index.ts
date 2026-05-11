import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';
import restaurantReducer from './slices/restaurantSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    cart: cartReducer,
    restaurant: restaurantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
