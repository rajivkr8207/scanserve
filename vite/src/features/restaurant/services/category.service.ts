import { api } from "../../../lib/api"

export const createCategory = async (data: any) => {
    const res = await api.post("/category", data)
    return res.data
}

export const getCategories = async () => {
    const res = await api.get("/category")
    return res.data
}

export const updateCategory = async (id: string, data: any) => {
    const res = await api.put(`/category/${id}`, data)
    return res.data
}

export const deleteCategory = async (id: string) => {
    const res = await api.delete(`/category/${id}`)
    return res.data
}

export const CategoryServices = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}
