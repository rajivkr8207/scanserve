import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MenuServices } from "../../restaurant/services/menu.service";
import { OrderServices } from "../services/order.service";
import { useRazorpay, type RazorpayOrderOptions } from "react-razorpay";
import { Env } from "../../../config/Config";
interface MenuItem {
    _id: string;
    name: string;
    description?: string;
    price: number;
    isVeg: boolean;
    isAvailable: boolean;
    category?: { _id: string; name: string };
}

interface CartItem extends MenuItem {
    cartQuantity: number;
}

interface Restaurant {
    _id: string;
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
    const [errors, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [vegOnly, setVegOnly] = useState(false);
    const { error, isLoading, Razorpay } = useRazorpay();
    // Cart state
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showCheckout, setShowCheckout] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        name: "",
        email: "",
        phone: "",
        paymentMethod: "online" as "online" | "cash",
    });
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

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

    // Cart Handlers
    const addToCart = (item: MenuItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i._id === item._id);
            if (existing) {
                return prev.map((i) =>
                    i._id === item._id ? { ...i, cartQuantity: i.cartQuantity + 1 } : i
                );
            }
            return [...prev, { ...item, cartQuantity: 1 }];
        });
    };

    const decrementQuantity = (itemId: string) => {
        setCart((prev) => {
            const existing = prev.find((i) => i._id === itemId);
            if (existing && existing.cartQuantity > 1) {
                return prev.map((i) =>
                    i._id === itemId ? { ...i, cartQuantity: i.cartQuantity - 1 } : i
                );
            }
            // Remove if quantity becomes 0
            return prev.filter((i) => i._id !== itemId);
        });
    };

    const getCartQuantity = (itemId: string) => {
        const item = cart.find((i) => i._id === itemId);
        return item ? item.cartQuantity : 0;
    };

    const cartTotalItems = cart.reduce((total, item) => total + item.cartQuantity, 0);
    const cartTotalPrice = cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!restaurant?._id) {
            alert("Restaurant ID missing. Cannot place order.");
            return;
        }

        try {
            setIsCheckingOut(true);
            const orderData = {
                customerName: checkoutForm.name,
                customerEmail: checkoutForm.email,
                customerPhone: checkoutForm.phone,
                restaurant: restaurant._id,
                items: cart.map((item) => ({
                    menuItem: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.cartQuantity,
                    subtotal: item.price * item.cartQuantity,
                })),
                totalPrice: cartTotalPrice,
                paymentMethod: checkoutForm.paymentMethod,
            };

            const response = await OrderServices.createOrder(orderData);

            if (checkoutForm.paymentMethod === 'online') {
                const options: RazorpayOrderOptions = {
                    key: Env.RAZORPAY_KEY,
                    amount: cartTotalPrice * 100, // Amount in paise
                    currency: "INR",
                    name: restaurant?.name || "ScanServe",
                    description: "Order Payment",
                    order_id: response.data?.paymentorder?.id,
                    handler: async (razorpayResponse) => {
                        console.log("Payment Success: ", razorpayResponse);
                        try {
                            // Call backend to verify payment and update DB
                            await OrderServices.verifyPayment({
                                razorpayOrderId: razorpayResponse.razorpay_order_id,
                                razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                                razorpaySignature: razorpayResponse.razorpay_signature,
                            });
                        } catch (verifyErr) {
                            console.error("Payment verification failed:", verifyErr);
                        }
                        setOrderSuccess(true);
                        setCart([]);
                        setTimeout(() => {
                            setShowCheckout(false);
                            setOrderSuccess(false);
                        }, 3000);
                    },
                    prefill: {
                        name: checkoutForm.name,
                        email: checkoutForm.email,
                        contact: checkoutForm.phone,
                    },
                    theme: {
                        color: "#4f46e5",
                    },
                };

                const razorpayInstance = new Razorpay(options);
                razorpayInstance.open();
            } else {
                setOrderSuccess(true);
                setCart([]);
                setTimeout(() => {
                    setShowCheckout(false);
                    setOrderSuccess(false);
                }, 3000);
            }
        } catch (err: any) {
            alert(err?.response?.data?.message || "Failed to place order.");
        } finally {
            setIsCheckingOut(false);
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

    if (errors) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                    <div className="text-7xl">😕</div>
                    <h1 className="text-2xl font-bold text-slate-700">Menu Not Found</h1>
                    <p className="text-slate-500">{errors}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pb-24 relative">
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
                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${restaurant.isOpen
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
                            className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all ${activeCategory === "all"
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
                                className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-full transition-all ${activeCategory === cat._id
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
                            className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-all ml-auto ${vegOnly
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
                                {catItems.map((item) => {
                                    const quantity = getCartQuantity(item._id);

                                    return (
                                        <div
                                            key={item._id}
                                            className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all group"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {/* Veg/Non-veg indicator */}
                                                        <span className={`flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-sm border-2 ${item.isVeg
                                                            ? "border-green-600"
                                                            : "border-red-600"
                                                            }`}>
                                                            <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-600" : "bg-red-600"
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
                                                    <div className="mt-2">
                                                        <span className="text-lg font-bold text-slate-800">
                                                            ₹{item.price}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Add to Cart Actions */}
                                                <div className="flex-shrink-0 flex items-end justify-end h-full mt-2">
                                                    {quantity > 0 ? (
                                                        <div className="flex items-center bg-indigo-50 rounded-lg border border-indigo-100">
                                                            <button
                                                                onClick={() => decrementQuantity(item._id)}
                                                                className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 rounded-l-lg transition-colors font-bold"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-semibold text-indigo-900">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => addToCart(item)}
                                                                className="w-8 h-8 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 rounded-r-lg transition-colors font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => addToCart(item)}
                                                            className="px-4 py-1.5 bg-white border border-indigo-200 text-indigo-600 font-semibold text-sm rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                                                        >
                                                            ADD +
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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

            {/* Floating Cart Button */}
            {cartTotalItems > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shadow-2xl z-40 transform transition-transform">
                    <div className="max-w-3xl mx-auto">
                        <button
                            onClick={() => setShowCheckout(true)}
                            className="w-full flex items-center justify-between bg-indigo-600 text-white p-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="bg-indigo-800 px-2 py-1 rounded-md text-xs">{cartTotalItems} items</span>
                                <span>|</span>
                                <span>₹{cartTotalPrice}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>View Cart & Checkout</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckout && (
                <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-xl max-h-[90vh] md:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all animate-in slide-in-from-bottom-10 md:zoom-in-95">

                        {orderSuccess ? (
                            <div className="p-10 text-center space-y-4">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-4xl mb-6 text-green-600">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Order Placed!</h2>
                                <p className="text-slate-500">Your delicious food is being prepared.</p>
                            </div>
                        ) : (
                            <>
                                {/* Modal Header */}
                                <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100">
                                    <h2 className="text-xl font-bold text-slate-800">Checkout</h2>
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Modal Body (Scrollable) */}
                                <div className="p-4 md:p-6 overflow-y-auto space-y-6 flex-1">

                                    {/* Order Summary */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Order Summary</h3>
                                        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                            {cart.map((item) => (
                                                <div key={item._id} className="flex justify-between items-center text-sm">
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <span className="font-semibold text-indigo-600">{item.cartQuantity}x</span>
                                                        <span className="text-slate-700 truncate">{item.name}</span>
                                                    </div>
                                                    <span className="font-semibold text-slate-800">₹{item.price * item.cartQuantity}</span>
                                                </div>
                                            ))}
                                            <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between items-center font-bold text-lg">
                                                <span className="text-slate-800">Total</span>
                                                <span className="text-indigo-600">₹{cartTotalPrice}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Checkout Form */}
                                    <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Details</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                                            <input
                                                required
                                                type="text"
                                                value={checkoutForm.name}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                                                placeholder="e.g. John Doe"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                            <input
                                                required
                                                type="email"
                                                value={checkoutForm.email}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                                placeholder="e.g. john@example.com"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone *</label>
                                            <input
                                                required
                                                type="number"
                                                value={checkoutForm.phone}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                                placeholder="e.g. 9876543210"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Method</h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${checkoutForm.paymentMethod === 'online'
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="paymentMethod"
                                                        value="online"
                                                        checked={checkoutForm.paymentMethod === 'online'}
                                                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'online' })}
                                                    />
                                                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                    </svg>
                                                    <span className="font-semibold text-sm">Pay Online</span>
                                                </label>

                                                <label className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${checkoutForm.paymentMethod === 'cash'
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        className="hidden"
                                                        name="paymentMethod"
                                                        value="cash"
                                                        checked={checkoutForm.paymentMethod === 'cash'}
                                                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: 'cash' })}
                                                    />
                                                    <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span className="font-semibold text-sm">Pay on Cash</span>
                                                </label>
                                            </div>
                                        </div>

                                    </form>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 md:rounded-b-2xl">
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        disabled={isCheckingOut}
                                        className="w-full flex items-center justify-center py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                                    >
                                        {isCheckingOut ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            `Place Order • ₹${cartTotalPrice}`
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
