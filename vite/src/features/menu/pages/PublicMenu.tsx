import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { MenuServices } from "../../restaurant/services/menu.service";
import { OrderServices } from "../services/order.service";
import { ThemeServices, type MenuTheme } from "../../restaurant/services/theme.service";
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

export default function PublicMenu({ previewTheme, previewSlug }: { previewTheme?: MenuTheme, previewSlug?: string }) {
    const { slug: routeSlug } = useParams<{ slug: string }>();
    const slug = previewSlug || routeSlug;
    const [items, setItems] = useState<MenuItem[]>([]);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [theme, setTheme] = useState<MenuTheme | null>(null);
    const [loading, setLoading] = useState(true);
    const [errors, setError] = useState("");
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [search, setSearch] = useState("");
    const [vegOnly, setVegOnly] = useState(false);
    const { Razorpay } = useRazorpay();
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

            if (!previewTheme) {
                try {
                    const themeData = await ThemeServices.getThemeBySlug(slug!);
                    setTheme(themeData.data);
                } catch {}
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || "Menu not found");
        } finally {
            setLoading(false);
        }
    };

    const currentTheme = previewTheme || theme;

    const themeStyle = {
        '--theme-primary': currentTheme?.colors?.primary || '#4f46e5',
        '--theme-bg': currentTheme?.colors?.background || '#f8fafc',
        '--theme-surface': currentTheme?.colors?.surface || '#ffffff',
        '--theme-text': currentTheme?.colors?.textPrimary || '#1e293b',
        '--theme-text-muted': currentTheme?.colors?.textSecondary || '#64748b',
        '--theme-button': currentTheme?.colors?.buttonColor || '#4f46e5',
        '--theme-button-text': currentTheme?.colors?.buttonTextColor || '#ffffff',
        '--theme-success': currentTheme?.colors?.success || '#16a34a',
        '--theme-danger': currentTheme?.colors?.danger || '#dc2626',
        '--theme-radius': `${currentTheme?.layout?.borderRadius || 16}px`,
    } as React.CSSProperties;

    // Computed branding
    const displayLogo = currentTheme?.branding?.logo || restaurant?.logo;
    const displayName = currentTheme?.branding?.restaurantName || restaurant?.name || slug;
    const displayDesc = currentTheme?.branding?.tagline || restaurant?.description;

    // Visibility shortcuts
    const showSearch = currentTheme?.visibility?.showSearch ?? true;
    const showCategory = currentTheme?.visibility?.showCategory ?? true;
    const showVegBadge = currentTheme?.visibility?.showVegBadge ?? true;
    const showDesc = currentTheme?.visibility?.showDescription ?? true;
    const showPrice = currentTheme?.visibility?.showPrice ?? true;

    // Layout shortcuts
    const isList = currentTheme?.layout?.templateStyle === 'list';
    const isGrid = currentTheme?.layout?.templateStyle === 'grid';
    const isGlass = currentTheme?.effects?.glassmorphism;
    const isGradient = currentTheme?.effects?.gradientBackground;

    const surfaceClass = isGlass 
        ? "bg-[var(--theme-surface)]/70 backdrop-blur-md border-[var(--theme-surface)]/50" 
        : "bg-[var(--theme-surface)]";

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
        <div className={`min-h-screen pb-24 relative transition-colors duration-300 font-body ${isGradient ? 'bg-gradient-to-br from-[var(--theme-bg)] to-[var(--theme-surface)]' : ''}`} 
             style={{ 
                 ...themeStyle, 
                 backgroundColor: isGradient ? undefined : 'var(--theme-bg)', 
                 color: 'var(--theme-text)' 
             }}>
             <style>{`
                @import url('https://fonts.googleapis.com/css2?family=${currentTheme?.typography?.headingFont?.replace(/ /g, '+') || 'Inter'}:wght@400;600;700;800&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=${currentTheme?.typography?.bodyFont?.replace(/ /g, '+') || 'Inter'}:wght@400;500;600&display=swap');
                .font-heading { font-family: '${currentTheme?.typography?.headingFont || 'Inter'}', sans-serif !important; }
                .font-body { font-family: '${currentTheme?.typography?.bodyFont || 'Inter'}', sans-serif !important; }
             `}</style>

            {/* Hero / Restaurant Header */}
            <div className="relative overflow-hidden transition-colors duration-300" style={{ backgroundColor: 'var(--theme-primary)', color: '#ffffff' }}>
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 rounded-full translate-x-1/4 translate-y-1/4"></div>
                </div>

                <div className="relative max-w-3xl mx-auto px-4 py-10 text-center">
                    {displayLogo ? (
                        <img
                            src={displayLogo}
                            alt={displayName}
                            className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-white/20 shadow-2xl"
                            style={{ borderRadius: 'var(--theme-radius)' }}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-white/10 backdrop-blur mx-auto mb-4 flex items-center justify-center text-4xl shadow-2xl ring-4 ring-white/20" style={{ borderRadius: 'var(--theme-radius)' }}>
                            🍽️
                        </div>
                    )}
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 font-heading">
                        {displayName}
                    </h1>
                    {displayDesc && (
                        <p className="text-white/80 text-sm max-w-md mx-auto leading-relaxed font-body">
                            {displayDesc}
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
            {(showSearch || showCategory) && (
            <div className={`sticky top-0 z-20 ${isGlass ? 'bg-[var(--theme-bg)]/80 backdrop-blur-lg' : 'bg-[var(--theme-bg)]'} border-b border-black/5 shadow-sm`}>
                <div className="max-w-3xl mx-auto px-4 py-3 space-y-3">
                    {/* Search */}
                    {showSearch && (
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search dishes..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:border-transparent outline-none transition-shadow"
                            style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-text-muted)', color: 'var(--theme-text)' }}
                        />
                    </div>
                    )}

                    {/* Category Tabs + Veg filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {showCategory && (
                            <>
                                <button
                                    onClick={() => setActiveCategory("all")}
                                    className={`flex-shrink-0 text-xs font-semibold px-4 py-2 transition-all shadow-sm`}
                                    style={{
                                        backgroundColor: activeCategory === "all" ? 'var(--theme-primary)' : 'var(--theme-surface)',
                                        color: activeCategory === "all" ? '#ffffff' : 'var(--theme-text-muted)',
                                        border: '1px solid var(--theme-text-muted)',
                                        borderRadius: 'var(--theme-radius)'
                                    }}
                                >
                                    All
                                </button>
                                {categories.map((cat) => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setActiveCategory(cat._id)}
                                        className={`flex-shrink-0 text-xs font-semibold px-4 py-2 transition-all shadow-sm`}
                                        style={{
                                            backgroundColor: activeCategory === cat._id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                                            color: activeCategory === cat._id ? '#ffffff' : 'var(--theme-text-muted)',
                                            border: '1px solid var(--theme-text-muted)',
                                            borderRadius: 'var(--theme-radius)'
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </>
                        )}

                        {/* Veg toggle */}
                        {showVegBadge && (
                            <button
                                onClick={() => setVegOnly(!vegOnly)}
                                className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-4 py-2 transition-all ml-auto`}
                                style={{
                                    backgroundColor: vegOnly ? 'var(--theme-success)' : 'transparent',
                                    color: vegOnly ? '#ffffff' : 'var(--theme-success)',
                                    border: `1px solid var(--theme-success)`,
                                    borderRadius: 'var(--theme-radius)'
                                }}
                            >
                                <span className="w-3 h-3 rounded-sm border-2 inline-block" style={{ borderColor: vegOnly ? '#ffffff' : 'var(--theme-success)', backgroundColor: 'var(--theme-success)' }}></span>
                                Veg Only
                            </button>
                        )}
                    </div>
                </div>
            </div>
            )}

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
                            {showCategory && (
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl font-bold font-heading" style={{ color: 'var(--theme-text)' }}>{categoryName}</h2>
                                <div className="flex-1 h-px bg-black/10"></div>
                                <span className="text-xs font-medium" style={{ color: 'var(--theme-text-muted)' }}>{catItems.length} items</span>
                            </div>
                            )}

                            {/* Items Grid */}
                            <div className={`grid gap-4 ${isGrid ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                                {catItems.map((item) => {
                                    const quantity = getCartQuantity(item._id);

                                    return (
                                        <div
                                            key={item._id}
                                            className={`border border-black/5 p-4 shadow-sm hover:shadow-md transition-all group ${surfaceClass} ${isList ? 'flex items-center gap-4' : 'flex flex-col'}`}
                                            style={{ borderRadius: 'var(--theme-radius)' }}
                                        >
                                            <div className={`flex-1 min-w-0 ${isList ? '' : 'mb-3'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {/* Veg/Non-veg indicator */}
                                                    {showVegBadge && (
                                                    <span className="flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-sm border-2" style={{ borderColor: item.isVeg ? 'var(--theme-success)' : 'var(--theme-danger)' }}>
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.isVeg ? 'var(--theme-success)' : 'var(--theme-danger)' }}></span>
                                                    </span>
                                                    )}
                                                    <h3 className="font-semibold text-sm truncate font-heading group-hover:opacity-80 transition-opacity" style={{ color: 'var(--theme-text)' }}>
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                {showDesc && item.description && (
                                                    <p className="text-xs leading-relaxed mt-1 line-clamp-2" style={{ color: 'var(--theme-text-muted)' }}>
                                                        {item.description}
                                                    </p>
                                                )}
                                                {showPrice && (
                                                <div className="mt-2">
                                                    <span className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>
                                                        ₹{item.price}
                                                    </span>
                                                </div>
                                                )}
                                            </div>

                                            {/* Add to Cart Actions */}
                                            <div className="flex-shrink-0 flex items-end justify-end mt-2">
                                                {quantity > 0 ? (
                                                    <div className="flex items-center border" style={{ borderColor: 'var(--theme-primary)', backgroundColor: 'transparent', borderRadius: 'var(--theme-radius)' }}>
                                                        <button
                                                            onClick={() => decrementQuantity(item._id)}
                                                            className="w-8 h-8 flex items-center justify-center transition-colors font-bold text-lg"
                                                            style={{ color: 'var(--theme-primary)' }}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-bold" style={{ color: 'var(--theme-text)' }}>
                                                            {quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => addToCart(item)}
                                                            className="w-8 h-8 flex items-center justify-center transition-colors font-bold text-lg"
                                                            style={{ color: 'var(--theme-primary)' }}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="px-4 py-2 font-bold text-sm transition-transform active:scale-95 shadow-sm"
                                                        style={{ color: 'var(--theme-button-text)', backgroundColor: 'var(--theme-button)', borderRadius: 'var(--theme-radius)' }}
                                                    >
                                                        {currentTheme?.buttons?.addToCartText || "ADD +"}
                                                    </button>
                                                )}
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
