import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '@/features/auth/store/auth.slice'
import { menuSlice } from '@/features/menu/store/menu.slice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    menu: menuSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch