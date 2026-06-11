import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import UseRestaurant from "../hooks/UseRestaurant";

export default function MyRestaurant() {
    const { restaurant, fetchMyRestaurant, isLoading } = UseRestaurant();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyRestaurant().catch(() => { });
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">🏪</div>
                    <h2 className="text-2xl font-bold text-slate-700">No Restaurant Found</h2>
                    <p className="text-slate-500 mt-2">You haven't created a restaurant yet. Get started now!</p>
                </div>
                <button
                    onClick={() => navigate("/home/restaurant/create")}
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-semibold transition-colors"
                >
                    Create Restaurant
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">{restaurant.name}</h1>
                    <p className="text-slate-500 mt-1">{restaurant.description || "No description added."}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${restaurant.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {restaurant.isActive ? "Active" : "Inactive"}
                </span>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Contact</h3>
                    <p className="text-slate-800 font-medium mt-2">{restaurant.contact?.phone}</p>
                    <p className="text-slate-500 text-sm">{restaurant.contact?.email || "—"}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Address</h3>
                    <p className="text-slate-800 font-medium mt-2">
                        {[restaurant.address?.street, restaurant.address?.city, restaurant.address?.state].filter(Boolean).join(", ") || "—"}
                    </p>
                    <p className="text-slate-500 text-sm">{restaurant.address?.pincode || ""}</p>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Cuisines</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                        {restaurant.cuisineTypes?.length > 0 ? restaurant.cuisineTypes.map((c: string) => (
                            <span key={c} className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full">{c}</span>
                        )) : <p className="text-slate-500">—</p>}
                    </div>
                </div>
            </div>

            {/* Management Shortcuts */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Manage</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/home/restaurant/categories" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">🗂️</div>
                            <div>
                                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Categories</h3>
                                <p className="text-slate-500 text-sm">Manage your menu categories</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/home/restaurant/menus" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">🍽️</div>
                            <div>
                                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Menu Items</h3>
                                <p className="text-slate-500 text-sm">Add, edit and manage food items</p>
                            </div>
                        </div>
                    </Link>

                    <Link to="/home/restaurant/qr" className="group bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-purple-300 hover:shadow-md transition-all">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">📱</div>
                            <div>
                                <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">QR Code</h3>
                                <p className="text-slate-500 text-sm">Generate & share your menu QR</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Restaurant Slug */}
            {restaurant.slug && (
                <div className="bg-slate-800 text-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-1">Public Menu URL</p>
                        <code className="text-indigo-300 text-sm break-all">{window.location.origin}/menu/{restaurant.slug}</code>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <a
                            href={`/menu/${restaurant.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                            View Menu ↗
                        </a>
                        <Link
                            to="/home/restaurant/qr"
                            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                        >
                            📱 QR Code
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
