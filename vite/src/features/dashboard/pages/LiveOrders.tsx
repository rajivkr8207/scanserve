import { useEffect, useState, useRef } from "react";
import { getSocket } from "../../../lib/socket";
import { SellerOrderServices } from "../services/order.service";
import { MenuServices } from "../../restaurant/services/menu.service";

interface OrderItem {
    menuItem: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

interface Order {
    _id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalPrice: number;
    orderStatus: string;
    paymentStatus: string;
    paymentMethod: string;
    restaurant: string;
    createdAt: string;
    isNew?: boolean;
}

const STATUS_FLOW = ["pending", "confirmed", "preparing", "ready", "completed"];

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-violet-100 text-violet-700 border-violet-200",
    ready: "bg-emerald-100 text-emerald-700 border-emerald-200",
    completed: "bg-slate-100 text-slate-500 border-slate-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_ICONS: Record<string, string> = {
    pending: "⏳",
    confirmed: "✅",
    preparing: "👨‍🍳",
    ready: "🔔",
    completed: "🎉",
    cancelled: "❌",
};

const PAYMENT_COLORS: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600",
    paid: "bg-emerald-50 text-emerald-600",
    failed: "bg-red-50 text-red-600",
    refunded: "bg-slate-50 text-slate-500",
};

const LiveOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [paymentUpdatingId, setPaymentUpdatingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [showRevenue, setShowRevenue] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Play a soft beep for new orders
    const playNotification = () => {
        try {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch (_) { }
    };

    // Load existing orders and get restaurant id
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await SellerOrderServices.getRestaurantOrders();
                const data: Order[] = res.data || [];
                setOrders(data);
                if (data.length > 0) {
                    setRestaurantId(data[0].restaurant);
                } else {
                    // Try fetching restaurant from profile
                    const restaurant = await MenuServices.getPublicMenuBySlug("");
                    if (restaurant?.data?._id) setRestaurantId(restaurant.data._id);
                }
            } catch (err) {
                console.error("Failed to load orders", err);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    // Get restaurant id from restaurant profile if orders list is empty
    useEffect(() => {
        if (restaurantId) return; // already got it from orders
        const fetchRestaurant = async () => {
            try {
                const res = await MenuServices.getPublicRestaurantBySlug("");
                // This won't work directly, but the socket join happens when restaurantId is set
            } catch (_) { }
        };
        // We'll get restaurantId from orders. If no orders yet, wait for socket event.
    }, [restaurantId]);

    // Connect socket and join restaurant room
    useEffect(() => {
        const socket = getSocket();

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));
        if (socket.connected) setConnected(true);

        socket.on("new-order", (order: Order) => {
            playNotification();
            setOrders(prev => {
                // Avoid duplicates
                if (prev.find(o => o._id === order._id)) return prev;
                return [{ ...order, isNew: true }, ...prev];
            });
            // If we didn't have the restaurant id yet, grab it now
            if (order.restaurant) setRestaurantId(order.restaurant);
            // Remove the "new" flash after 3s
            setTimeout(() => {
                setOrders(prev => prev.map(o => o._id === order._id ? { ...o, isNew: false } : o));
            }, 3000);
        });

        socket.on("order-status-updated", (updated: Order) => {
            setOrders(prev => prev.map(o => o._id === updated._id ? { ...updated } : o));
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("new-order");
            socket.off("order-status-updated");
        };
    }, []);

    // Join restaurant room once we know the id
    useEffect(() => {
        if (!restaurantId) return;
        const socket = getSocket();
        socket.emit("join-restaurant", restaurantId);
        console.log("[Socket] Joining restaurant room:", restaurantId);
    }, [restaurantId]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await SellerOrderServices.updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePaymentStatusUpdate = async (orderId: string, newStatus: string) => {
        setPaymentUpdatingId(orderId);
        try {
            await SellerOrderServices.updatePaymentStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, paymentStatus: newStatus } : o));
        } catch (err) {
            console.error("Failed to update payment status", err);
        } finally {
            setPaymentUpdatingId(null);
        }
    };

    const getNextStatus = (current: string) => {
        const idx = STATUS_FLOW.indexOf(current);
        return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    };

    const filteredOrders = filter === "all"
        ? orders
        : orders.filter(o => o.orderStatus === filter);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.orderStatus === "pending").length,
        preparing: orders.filter(o => ["confirmed", "preparing"].includes(o.orderStatus)).length,
        ready: orders.filter(o => o.orderStatus === "ready").length,
        revenue: orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.totalPrice, 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Live Orders</h1>
                            <p className="text-sm text-slate-500 mt-0.5">Real-time order management dashboard</p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${connected
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "bg-red-50 text-red-500 border-red-200"
                            }`}>
                            <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-red-400"}`} />
                            {connected ? "Live" : "Disconnected"}
                        </div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                        {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>
            </div>

            <div className="px-8 py-6 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: "Total Orders", value: stats.total, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
                        { label: "Pending", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                        { label: "In Kitchen", value: stats.preparing, color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
                        { label: "Ready", value: stats.ready, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
                        { label: "Revenue (Paid)", value: `₹${stats.revenue.toFixed(2)}`, color: "text-green-700", bg: "bg-green-50", border: "border-green-100", isRevenue: true },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                {s.isRevenue && (
                                    <button
                                        onClick={() => setShowRevenue(!showRevenue)}
                                        className="text-slate-400 hover:text-green-600 transition-colors"
                                        title={showRevenue ? "Hide Revenue" : "Show Revenue"}
                                    >
                                        {showRevenue ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                )}
                            </div>
                            <p className={`text-2xl font-bold mt-1 ${s.color}`}>
                                {s.isRevenue && !showRevenue ? "₹****" : s.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap">
                    {["all", ...STATUS_FLOW].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === s
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                                }`}
                        >
                            {s === "all" ? "All" : `${STATUS_ICONS[s]} ${s.charAt(0).toUpperCase() + s.slice(1)}`}
                        </button>
                    ))}
                </div>

                {/* Orders list */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-slate-500 text-sm">Loading orders...</p>
                        </div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-slate-200">
                        <p className="text-5xl mb-3">🍽️</p>
                        <p className="text-slate-700 font-semibold">No orders yet</p>
                        <p className="text-slate-400 text-sm mt-1">New orders will appear here live as customers place them</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredOrders.map((order) => {
                            const nextStatus = getNextStatus(order.orderStatus);
                            const isUpdating = updatingId === order._id;

                            return (
                                <div
                                    key={order._id}
                                    className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-500 ${order.isNew
                                        ? "border-indigo-400 shadow-indigo-200 shadow-lg scale-[1.01] ring-2 ring-indigo-300"
                                        : "border-slate-200 hover:shadow-md"
                                        }`}
                                >
                                    {/* Card header */}
                                    <div className="px-5 py-4 flex items-start justify-between border-b border-slate-100">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-800 text-sm">
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </p>
                                                {order.isNew && (
                                                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit", minute: "2-digit"
                                                })} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[order.orderStatus] || "bg-slate-100 text-slate-500"}`}>
                                            {STATUS_ICONS[order.orderStatus]} {order.orderStatus}
                                        </span>
                                    </div>

                                    {/* Customer info */}
                                    <div className="px-5 py-3 bg-slate-50/60 border-b border-slate-100">
                                        <p className="text-sm font-semibold text-slate-700">{order.customerName}</p>
                                        <p className="text-xs text-slate-400">{order.customerEmail}</p>
                                        {/* <p className="text-xs text-slate-400">{order?.customerPhone}</p> */}

                                    </div>

                                    {/* Items */}
                                    <div className="px-5 py-3 space-y-2">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-5 h-5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold flex items-center justify-center">
                                                        {item.quantity}
                                                    </span>
                                                    <span className="text-sm text-slate-700">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-slate-600">₹{item.subtotal.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-lg font-bold text-slate-800">₹{order.totalPrice.toFixed(2)}</p>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${PAYMENT_COLORS[order.paymentStatus]}`}>
                                                    {order.paymentStatus}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase">
                                                    {order.paymentMethod === "online" ? "💳 Online" : "💵 Cash"}
                                                </span>
                                                {order.paymentStatus === "pending" && order.orderStatus !== "cancelled" && (
                                                    <button
                                                        onClick={() => handlePaymentStatusUpdate(order._id, "paid")}
                                                        disabled={paymentUpdatingId === order._id}
                                                        className="text-[10px] bg-green-100 hover:bg-green-200 text-green-700 px-2 py-0.5 rounded-full font-bold transition-all disabled:opacity-50"
                                                    >
                                                        {paymentUpdatingId === order._id ? "..." : "Mark Paid"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            {order.orderStatus === "pending" && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, "cancelled")}
                                                        disabled={isUpdating}
                                                        className="flex items-center justify-center gap-1 px-3 py-2 bg-white text-red-500 border border-red-200 hover:bg-red-50 hover:border-red-300 text-xs font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, "confirmed")}
                                                        disabled={isUpdating}
                                                        className="flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {isUpdating ? (
                                                            <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                        ) : "✅"}
                                                        Accept Order
                                                    </button>
                                                </>
                                            )}

                                            {order.orderStatus !== "pending" && nextStatus && order.orderStatus !== "cancelled" && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm shadow-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdating ? (
                                                        <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        STATUS_ICONS[nextStatus]
                                                    )}
                                                    Mark {nextStatus}
                                                </button>
                                            )}

                                            {order.orderStatus === "completed" && (
                                                <span className="text-xs text-emerald-600 font-semibold px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100">✅ Done</span>
                                            )}

                                            {order.orderStatus === "cancelled" && (
                                                <span className="text-xs text-red-500 font-semibold px-2 py-1 bg-red-50 rounded-lg border border-red-100">❌ Cancelled</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveOrders;
