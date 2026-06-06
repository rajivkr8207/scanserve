import { useSelector, useDispatch } from 'react-redux';
import { RestaurantServices } from '../services/restaurant.service';
import { CategoryServices } from '../services/category.service';
import { MenuServices } from '../services/menu.service';
import { 
    setRestaurantLoading, 
    setRestaurantData, 
    setCategories, 
    setMenus, 
    setRestaurantError, 
    setRestaurantSuccess, 
    resetRestaurantState 
} from '../restaurant.slice';

const UseRestaurant = () => {
    const dispatch = useDispatch();
    const { restaurant, categories, menus, isLoading, isError, isSuccess, message } = useSelector((state: any) => state.restaurant);

    // RESTAURANT
    const fetchMyRestaurant = async () => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await RestaurantServices.getMyRestaurant();
            dispatch(setRestaurantData(data.data));
            dispatch(setRestaurantLoading(false));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantData(null));
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to fetch restaurant'));
            throw error;
        }
    }

    const handleCreateRestaurant = async (formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await RestaurantServices.createRestaurant(formData);
            dispatch(setRestaurantData(data.data));
            dispatch(setRestaurantSuccess('Restaurant created successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to create restaurant'));
            throw error;
        }
    }

    const handleUpdateRestaurant = async (formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await RestaurantServices.updateRestaurant(formData);
            dispatch(setRestaurantData(data.data));
            dispatch(setRestaurantSuccess('Restaurant updated successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to update restaurant'));
            throw error;
        }
    }

    // CATEGORY
    const fetchCategories = async () => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await CategoryServices.getCategories();
            dispatch(setCategories(data.data));
            dispatch(setRestaurantLoading(false));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to fetch categories'));
            throw error;
        }
    }

    const handleCreateCategory = async (formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await CategoryServices.createCategory(formData);
            await fetchCategories(); // Refetch
            dispatch(setRestaurantSuccess('Category created successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to create category'));
            throw error;
        }
    }

    const handleUpdateCategory = async (id: string, formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await CategoryServices.updateCategory(id, formData);
            await fetchCategories();
            dispatch(setRestaurantSuccess('Category updated successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to update category'));
            throw error;
        }
    }

    const handleDeleteCategory = async (id: string) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await CategoryServices.deleteCategory(id);
            await fetchCategories();
            dispatch(setRestaurantSuccess('Category deleted successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to delete category'));
            throw error;
        }
    }

    // MENU
    const fetchMenus = async () => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await MenuServices.getMenuItems();
            dispatch(setMenus(data.data));
            dispatch(setRestaurantLoading(false));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to fetch menus'));
            throw error;
        }
    }

    const handleCreateMenu = async (formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await MenuServices.createMenuItem(formData);
            await fetchMenus();
            dispatch(setRestaurantSuccess('Menu item created successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to create menu item'));
            throw error;
        }
    }

    const handleUpdateMenu = async (id: string, formData: any) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await MenuServices.updateMenuItem(id, formData);
            await fetchMenus();
            dispatch(setRestaurantSuccess('Menu item updated successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to update menu item'));
            throw error;
        }
    }

    const handleDeleteMenu = async (id: string) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await MenuServices.deleteMenuItem(id);
            await fetchMenus();
            dispatch(setRestaurantSuccess('Menu item deleted successfully'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to delete menu item'));
            throw error;
        }
    }

    const handleToggleMenuAvailability = async (id: string, currentAvailability: boolean) => {
        dispatch(setRestaurantLoading(true));
        try {
            const data = await MenuServices.toggleAvailability(id, !currentAvailability);
            await fetchMenus();
            dispatch(setRestaurantSuccess('Menu item availability updated'));
            return data;
        } catch (error: any) {
            dispatch(setRestaurantError(error.response?.data?.message || 'Failed to toggle availability'));
            throw error;
        }
    }

    return {
        restaurant,
        categories,
        menus,
        isLoading,
        isError,
        isSuccess,
        message,
        fetchMyRestaurant,
        handleCreateRestaurant,
        handleUpdateRestaurant,
        fetchCategories,
        handleCreateCategory,
        handleUpdateCategory,
        handleDeleteCategory,
        fetchMenus,
        handleCreateMenu,
        handleUpdateMenu,
        handleDeleteMenu,
        handleToggleMenuAvailability,
        resetRestaurantState: () => dispatch(resetRestaurantState())
    };
};

export default UseRestaurant;
