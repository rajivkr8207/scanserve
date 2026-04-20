import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MenuState, MenuItem } from '../types/menu.types'

const initialState: MenuState = {
  items: [],
  loading: false,
  error: null,
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload)
    },
    updateItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item._id === action.payload._id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload)
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setLoading, setItems, addItem, updateItem, deleteItem, setError } = menuSlice.actions

export default menuSlice.reducer