import { api } from "../../../lib/api"

export const createRestaurant = async (data: any) => {
    const res = await api.post("/restaurant", data)
    return res.data
}

export const getMyRestaurant = async () => {
    const res = await api.get("/restaurant/my")
    return res.data
}

export const updateRestaurant = async (data: any) => {
    const res = await api.put("/restaurant", data)
    return res.data
}

export const RestaurantServices = {
    createRestaurant,
    getMyRestaurant,
    updateRestaurant
}
