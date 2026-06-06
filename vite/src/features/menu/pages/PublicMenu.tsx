import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MenuServices } from "../../restaurant/services/menu.service";

interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    price: number;
    isVeg: boolean;
    isAvailable: boolean;
    category?: { _id: string; name: string };
}

interface Restaurant {
    name: string;
    description?: string;
    logo?: string;
    coverImage?: string;
    contact?: { phone?: string; email?: string };
    address?: { street?: string; city?: string; state?: string; pincode?: string };
    cuisineTypes?: string[];
    isOpen?: boolean;
    openingHours?: { day: string; openTime: string; closeTime: string; isClosed: boolean }[];
    slug: string;
}

export default function PublicMenu() {
    const { slug } = useParams<{ slug: string }>();
    const [items, setItems] = useState<MenuItem[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [vegOnly, setVegOnly] = useState(false);

    useEffect(() => {
        if (!slug) return;
        fetchPublicMenu();
    }, [slug]);

    const fetchPublicMenu = async () => {
        try {
            setLoading(true);
            const menuData = await MenuServices.getPublicMenuBySlug(slug!);
            setItems(menuData.data || []);

            try {
                const restData = await MenuServices.getPublicRestaurantBySlug(slug!);
                setRestaurant(restData.data);
            } catch {
                // Restaurant info is optional
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Menu not found");
        } finally {
            setLoading(false);
        }
    };


    // Derived data
    const categories = Array.from(
        new Map(
            items
                .filter((i) => i.category)
                .map((i) => [i.category!._id, i.category!])
        ).values()
    );

    const filtered = items.filter((item) => {
        const matchCat = activeCategory === "all" || item.category?._id === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchVeg = !vegOnly || item.isVeg;
        return matchCat && matchSearch && matchVeg;
    });

    const groupedByCategory: Record<string, MenuItem[]> = {};
    filtered.forEach((item) => {
        const key = item.category?.name || "Uncategorized";
        if (!groupedByCategory[key]) groupedByCategory[key] = [];
        groupedByCategory[key].push(item);
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-500 font-medium">Loading menu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                    <div className="text-7xl">😕</div>
                    <h1 className="text-2xl font-bold text-slate-700">Menu Not Found</h1>
                    <p className="text-slate-500">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Hero / Restaurant Header */}
            <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 text-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 rounded-full translate-x-1/4 translate-y-1/4"></div>
                </div>

                <div className="relative max-w-3xl mx-auto px-4 py-10 text-center">
                    {restaurant?.logo ? (
                        <img
                            src={restaurant.logo}
                            alt={restaurant?.name}
                            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-white/20 shadow-2xl"
                        />
                    ) : (
                        <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-white/20">
                            🍽️
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        {restaurant?.name || slug}
                    </h1>
                    {restaurant?.description && (
                        <p className="text-indigo-200 text-sm max-w-md mx-auto leading-relaxed">
                            {restaurant.description}
                        </p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
                        {restaurant?.cuisineTypes?.map((c) => (
                            <span key={c} className="bg-white/10 backdrop-blur text-white text-xs px-3 py-1 rounded-full border border-white/20">
                                {c}
                            </span>
                        ))}
                        {restaurant?.isOpen !== undefined && (
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                restaurant.isOpen
                                    ? "bg-green-400/20 text-green-300 border border-green-400/30"
                                    : "bg-red-400/20 text-red-300 border border-red-400/30"
                            }`}>
                                {restaurant.isOpen ? "🟢 Open Now" : "🔴 Closed"}
                            </span>
                        )}
                    </div>

                    {restaurant?.contact?.phone && (
                        <p className="text-indigo-300 text-sm mt-2">📞 {restaurant.contact.phone}</p>
                    )}
                </div>
            </div>

            {/* Sticky Controls */}
            <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 py-3 space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search dishes..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50"
                        />
                    </div>

                    {/* Category Tabs + Veg filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button
                            onClick={() => setActiveCategory("all")}
                            className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                                activeCategory === "all"
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setActiveCategory(cat._id)}
                                className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                                    activeCategory === cat._id
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}

                        {/* Veg toggle */}
                        <button
                            onClick={() => setVegOnly(!vegOnly)}
                            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all ml-auto ${
                                vegOnly
                                    ? "bg-green-500 text-white"
                                    : "bg-green-50 text-green-700 border border-green-200"
                            }`}
                        >
                            <span className="w-3 h-3 rounded-sm border-2 border-green-500 bg-green-500 inline-block"></span>
                            Veg Only
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Content */}
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-8">
                {Object.keys(groupedByCategory).length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                        <div className="text-5xl">🍽️</div>
                        <p className="text-slate-500">No items found matching your search.</p>
                    </div>
                ) : (
                    Object.entries(groupedByCategory).map(([categoryName, catItems]) => (
                        <div key={categoryName}>
                            {/* Category Heading */}
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-lg font-bold text-slate-800">{categoryName}</h2>
                                <div className="flex-1 h-px bg-slate-100"></div>
                                <span className="text-xs text-slate-400 font-medium">{catItems.length} items</span>
                            </div>

                            {/* Items Grid */}
                            <div className="space-y-3">
                                {catItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {/* Veg/Non-veg indicator */}
                                                    <span className={`flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 ${
                                                        item.isVeg
                                                            ? "border-green-600"
                                                            : "border-red-600"
                                                    }`}>
                                                        <span className={`w-2 h-2 rounded-full ${
                                                            item.isVeg ? "bg-green-600" : "bg-red-600"
                                                        }`}></span>
                                                    </span>
                                                    <h3 className="font-semibold text-slate-800 text-sm truncate group-hover:text-indigo-700 transition-colors">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                {item.description && (
                                                    <p className="text-slate-400 text-xs leading-relaxed mt-1 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Price */}
                                            <div className="flex-shrink-0 text-right">
                                                <span className="text-lg font-bold text-slate-800">
                                                    ₹{item.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                {/* Footer */}
                <div className="text-center py-8 space-y-2 border-t border-slate-100">
                    <p className="text-slate-400 text-xs">Powered by</p>
                    <p className="text-indigo-600 font-bold text-sm tracking-wide">ScanServe</p>
                    <p className="text-slate-300 text-xs">Digital menus made simple</p>
                </div>
            </div>
        </div>
    );
}
