import { api } from "../../../lib/api"

export const createMenuItem = async (data: any) => {
    const res = await api.post("/menu", data)
    return res.data
}

export const getMenuItems = async () => {
    const res = await api.get("/menu")
    return res.data
}

export const updateMenuItem = async (id: string, data: any) => {
    const res = await api.put(`/menu/${id}`, data)
    return res.data
}

export const deleteMenuItem = async (id: string) => {
    const res = await api.delete(`/menu/${id}`)
    return res.data
}

export const toggleAvailability = async (id: string, isAvailable: boolean) => {
    const res = await api.patch(`/menu/${id}/availability`, { isAvailable })
    return res.data
}

export const MenuServices = {
    createMenuItem,
    getMenuItems,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
}
