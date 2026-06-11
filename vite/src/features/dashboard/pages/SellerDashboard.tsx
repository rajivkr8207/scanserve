import { useEffect, useState } from "react";
import { SellerOrderServices } from "../services/order.service";
import UseAuth from "../../auth/hooks/UseAuth";
import { Link } from "react-router";

interface AnalyticsData {
    totalOrders: number;
    revenue: number;
}

interface DashboardAnalytics {
    today: AnalyticsData;
    yesterday: AnalyticsData;
    week: AnalyticsData;
    month: AnalyticsData;
}

const SellerDashboard = () => {
    const { user } = UseAuth();
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRevenue, setShowRevenue] = useState<boolean>(false);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await SellerOrderServices.getAnalytics();
                if (res.success) {
                    setAnalytics(res.data);
                }
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const renderStatCard = (title: string, data: AnalyticsData | undefined, colorTheme: string) => {
        if (!data) return null;
        
        return (
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden`}>
                <div className={`absolute top-0 left-0 w-1 h-full ${colorTheme}`}></div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
                
                <div className="mt-5 space-y-4">
                    <div>
                        <p className="text-xs text-slate-400 font-medium mb-1">Total Orders</p>
                        <p className="text-3xl font-bold text-slate-800">{data.totalOrders}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-50">
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-slate-400 font-medium">Revenue (Paid)</p>
                            <button 
                                onClick={() => setShowRevenue(!showRevenue)}
                                className="text-slate-300 hover:text-slate-500 transition-colors"
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
                        </div>
                        <p className={`text-2xl font-bold ${colorTheme.replace('bg-', 'text-')}`}>
                            {showRevenue ? `₹${data.revenue.toFixed(2)}` : "₹****"}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 min-h-screen bg-slate-50/50 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        Welcome back, {user?.fullName?.split(' ')[0] || 'Seller'}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening at your restaurant today.</p>
                </div>
                
                <Link to="/home/orders" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-indigo-200 transition-all flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                    View Live Orders
                </Link>
            </div>
            
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 mt-4 font-medium">Loading your analytics...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {renderStatCard("Today", analytics?.today, "bg-indigo-500")}
                    {renderStatCard("Yesterday", analytics?.yesterday, "bg-amber-500")}
                    {renderStatCard("Last 7 Days", analytics?.week, "bg-emerald-500")}
                    {renderStatCard("This Month", analytics?.month, "bg-violet-500")}
                </div>
            )}
            
            {/* Quick Actions */}
            <div className="mt-12">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/home/restaurant" className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            🍴
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Restaurant Details</h4>
                            <p className="text-sm text-slate-500 mt-1">Update your restaurant information, timings, and logo.</p>
                        </div>
                    </Link>
                    
                    <Link to="/home/restaurant/menus" className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-violet-300 hover:shadow-md transition-all flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                            📋
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Manage Menu</h4>
                            <p className="text-sm text-slate-500 mt-1">Add, edit, or remove items from your restaurant menu.</p>
                        </div>
                    </Link>

                    <Link to="/home/restaurant/qr" className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                            📱
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">QR Code</h4>
                            <p className="text-sm text-slate-500 mt-1">Download and print your unique QR code for tables.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SellerDashboard;