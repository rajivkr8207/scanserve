import { useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import UseRestaurant from "../hooks/UseRestaurant";

export default function CreateRestaurant() {
    const { handleCreateRestaurant, isLoading } = UseRestaurant();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data: any) => {
        try {
            setErrorMsg("");
            await handleCreateRestaurant({
                name: data.name,
                description: data.description,
                contact: { phone: data.phone, email: data.email },
                address: {
                    street: data.street,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                },
                cuisineTypes: data.cuisineTypes ? data.cuisineTypes.split(",").map((s: string) => s.trim()) : [],
            });
            navigate("/home/restaurant");
        } catch (error: any) {
            setErrorMsg(error.response?.data?.message || "Failed to create restaurant");
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Create Your Restaurant</h1>
                <p className="text-slate-500 mt-2">Set up your restaurant profile to get started.</p>
            </div>

            {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
                {/* Basic Info */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Restaurant Name *</label>
                            <input
                                type="text"
                                {...register("name", { required: "Restaurant name is required" })}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="e.g. The Grand Kitchen"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                                placeholder="Tell customers about your restaurant..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Cuisine Types</label>
                            <input
                                type="text"
                                {...register("cuisineTypes")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="e.g. Indian, Chinese, Italian (comma separated)"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Contact Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Phone *</label>
                            <input
                                type="text"
                                {...register("phone", { required: "Phone is required" })}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="+91 9876543210"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message as string}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                            <input
                                type="email"
                                {...register("email")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="restaurant@email.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Address</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-600 mb-1">Street</label>
                            <input
                                type="text"
                                {...register("street")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="123, Main Street"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">City</label>
                            <input
                                type="text"
                                {...register("city")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="Mumbai"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">State</label>
                            <input
                                type="text"
                                {...register("state")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="Maharashtra"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Pincode</label>
                            <input
                                type="text"
                                {...register("pincode")}
                                className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                placeholder="400001"
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-semibold transition-colors disabled:opacity-50"
                >
                    {isLoading ? "Creating..." : "Create Restaurant"}
                </button>
            </form>
        </div>
    );
}
