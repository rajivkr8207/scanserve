import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  unreadCount: number;
  activeModal: string | null;
}

const initialState: UIState = {
  sidebarOpen: false,
  unreadCount: 0,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setUnreadCount, setActiveModal } = uiSlice.actions;
export default uiSlice.reducer;
