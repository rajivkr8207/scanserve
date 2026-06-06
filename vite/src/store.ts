import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth.slice';
import restaurantReducer from './features/restaurant/restaurant.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        restaurant: restaurantReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
