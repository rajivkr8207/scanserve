import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import UseRestaurant from "../hooks/UseRestaurant";

export default function ManageCategory() {
    const { categories, fetchCategories, handleCreateCategory, handleUpdateCategory, handleDeleteCategory, isLoading } = UseRestaurant();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchCategories().catch(() => {});
    }, []);

    const onSubmit = async (data: any) => {
        try {
            setErrorMsg("");
            if (editingId) {
                await handleUpdateCategory(editingId, data);
            } else {
                await handleCreateCategory(data);
            }
            reset();
            setShowForm(false);
            setEditingId(null);
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Operation failed");
        }
    };

    const onEdit = (cat: any) => {
        setEditingId(cat._id);
        setValue("name", cat.name);
        setValue("description", cat.description || "");
        setShowForm(true);
    };

    const onDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            await handleDeleteCategory(id);
        } catch {
            setErrorMsg("Failed to delete category");
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
                    <h1 className="text-3xl font-bold text-slate-800">Categories</h1>
                    <p className="text-slate-500 mt-1">Organize your menu into categories</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 font-medium transition-colors"
                    >
                        + Add Category
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">{editingId ? "Edit Category" : "New Category"}</h2>
                    {errorMsg && (
                        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">{errorMsg}</div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Category Name *</label>
                            <input
                                type="text"
                                {...register("name", { required: "Category name is required" })}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="e.g. Starters, Mains, Desserts"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                            <input
                                type="text"
                                {...register("description")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="Optional description"
                            />
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

            {/* Category List */}
            {isLoading && !categories.length ? (
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : categories.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <p className="text-4xl mb-3">🗂️</p>
                    <p className="text-slate-500">No categories yet. Add your first one!</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Name</th>
                                <th className="text-left text-sm font-semibold text-slate-600 px-6 py-4">Description</th>
                                <th className="text-right text-sm font-semibold text-slate-600 px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {categories.map((cat: any) => (
                                <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-slate-800">{cat.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">{cat.description || "—"}</td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => onEdit(cat)}
                                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(cat._id)}
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
