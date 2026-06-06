import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseRestaurant from "../hooks/UseRestaurant";

export default function ManageMenu() {
    const {
        menus, categories,
        fetchMenus, fetchCategories,
        handleCreateMenu, handleUpdateMenu, handleDeleteMenu, handleToggleMenuAvailability,
        isLoading
    } = UseRestaurant();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchMenus().catch(() => {});
        fetchCategories().catch(() => {});
    }, []);

    const onSubmit = async (data: any) => {
        try {
            setErrorMsg("");
            const payload = {
                ...data,
                price: parseFloat(data.price),
            };
            if (editingId) {
                await handleUpdateMenu(editingId, payload);
            } else {
                await handleCreateMenu(payload);
            }
            reset();
            setShowForm(false);
            setEditingId(null);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Operation failed");
        }
    };

    const onEdit = (item: any) => {
        setEditingId(item._id);
        setValue("name", item.name);
        setValue("description", item.description || "");
        setValue("price", item.price);
        setValue("category", item.category?._id || item.category || "");
        setValue("isVeg", item.isVeg ?? false);
        setShowForm(true);
    };

    const onDelete = async (id: string) => {
        if (!window.confirm("Delete this menu item?")) return;
        try {
            await handleDeleteMenu(id);
        } catch {
            setErrorMsg("Failed to delete item");
        }
    };

    const onCancel = () => {
        reset();
        setShowForm(false);
        setEditingId(null);
        setErrorMsg("");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Menu Items</h1>
                    <p className="text-slate-500 mt-1">Manage your restaurant's food items</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                    >
                        + Add Item
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">{editingId ? "Edit Menu Item" : "New Menu Item"}</h2>
                    {errorMsg && (
                        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{errorMsg}</div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Item Name *</label>
                                <input
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="e.g. Paneer Butter Masala"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Price (₹) *</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("price", { required: "Price is required", min: 0 })}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="199"
                                />
                                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message as string}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-600 mb-1">Category</label>
                                <select
                                    {...register("category")}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                                <textarea
                                    {...register("description")}
                                    rows={2}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Short description of the dish"
                                />
                            </div>

                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isVeg"
                                    {...register("isVeg")}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                                />
                                <label htmlFor="isVeg" className="text-sm font-medium text-slate-600">Vegetarian</label>
                            </div>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50"
                            >
                                {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-slate-100 text-slate-700 px-6 py-2.5 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Menu List */}
            {isLoading && !menus.length ? (
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : menus.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <p className="text-4xl mb-3">🍽️</p>
                    <p className="text-slate-500">No menu items yet. Add your first dish!</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Item</th>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Category</th>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Price</th>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Available</th>
                                <th className="text-right text-sm font-semibold text-slate-600 px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {menus.map((item: any) => (
                                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className={`inline-block w-3 h-3 rounded-sm border-2 ${item.isVeg ? "border-green-500 bg-green-500" : "border-red-500 bg-red-500"}`} />
                                            <div>
                                                <p className="font-medium text-slate-800">{item.name}</p>
                                                {item.description && <p className="text-slate-400 text-xs">{item.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.category?.name ? (
                                            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">{item.category.name}</span>
                                        ) : "—"}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">₹{item.price}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleMenuAvailability(item._id, item.isAvailable)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.isAvailable ? "bg-green-500" : "bg-slate-300"}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${item.isAvailable ? "translate-x-6" : "translate-x-1"}`} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(item._id)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
