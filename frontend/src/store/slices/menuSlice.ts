import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { menuService } from '@/features/menu/services/menuService';
import type { IMenuItem } from '@shared/types/menu.type';
import type { IMenuCategory } from '@shared/types/category.type';

interface MenuState {
  categories: IMenuCategory[];
  menuItems: IMenuItem[];
  loading: boolean;
  error: string | null;
  lastFetchedRestaurantId: string | null;
}

const initialState: MenuState = {
  categories: [],
  menuItems: [],
  loading: false,
  error: null,
  lastFetchedRestaurantId: null,
};

// Async Thunks
export const fetchMenuData = createAsyncThunk(
  'menu/fetchAll',
  async (restaurantId: string, { rejectWithValue }) => {
    try {
      const [categories, menuItems] = await Promise.all([
        menuService.getCategories(restaurantId),
        menuService.getMenuItems(restaurantId),
      ]);
      return { categories, menuItems, restaurantId };
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch menu data');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    updateMenuItemInState: (state, action: PayloadAction<IMenuItem>) => {
      const index = state.menuItems.findIndex(item => item._id === action.payload._id);
      if (index !== -1) {
        state.menuItems[index] = action.payload;
      }
    },
    addMenuItemToState: (state, action: PayloadAction<IMenuItem>) => {
      state.menuItems.push(action.payload);
    },
    removeMenuItemFromState: (state, action: PayloadAction<string>) => {
      state.menuItems = state.menuItems.filter(item => item._id !== action.payload);
    },
    addCategoryToState: (state, action: PayloadAction<IMenuCategory>) => {
      state.categories.push(action.payload);
    },
    removeCategoryFromState: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat._id !== action.payload);
    },
    clearMenuState: (state) => {
      state.categories = [];
      state.menuItems = [];
      state.lastFetchedRestaurantId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.menuItems = action.payload.menuItems;
        state.lastFetchedRestaurantId = action.payload.restaurantId;
      })
      .addCase(fetchMenuData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setMenuLoading, 
  updateMenuItemInState, 
  addMenuItemToState, 
  removeMenuItemFromState,
  addCategoryToState,
  removeCategoryFromState,
  clearMenuState
} = menuSlice.actions;

export default menuSlice.reducer;
