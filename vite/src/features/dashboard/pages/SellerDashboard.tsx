const SellerDashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Welcome to Seller Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-slate-600">Total Orders</h3>
                    <p className="text-4xl font-bold text-indigo-600 mt-4">124</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-slate-600">Revenue</h3>
                    <p className="text-4xl font-bold text-green-600 mt-4">$3,450</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-semibold text-slate-600">Active Tables</h3>
                    <p className="text-4xl font-bold text-amber-500 mt-4">8/12</p>
                </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
                <p className="text-slate-500">Your recent orders and activities will appear here.</p>
            </div>
        </div>
    )
}

export default SellerDashboard