import { Outlet, NavLink, useNavigate } from "react-router";
import UseAuth from "../features/auth/hooks/UseAuth";

const navLinks = [
    { to: "/home", label: "Dashboard", icon: "🏠", end: true },
    { to: "/home/orders", label: "Live Orders", icon: "📋", end: false },
    { to: "/home/restaurant", label: "Restaurant", icon: "🍴", end: true },
    { to: "/home/restaurant/theme", label: "Menu Theme", icon: "🎨", end: false },
    { to: "/profile", label: "Profile", icon: "👤", end: false },
];

const MainLayout = () => {
    const { handlerLogout, user } = UseAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handlerLogout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-indigo-950 text-white flex flex-col shadow-2xl flex-shrink-0">
                {/* Brand */}
                <div className="p-6 border-b border-indigo-800/40">
                    <h2 className="text-xl font-bold tracking-wider text-white">ScanServe</h2>
                    <p className="text-indigo-400 text-xs mt-1 font-medium uppercase tracking-widest">Seller Panel</p>
                </div>

                {/* User info */}
                {user && (
                    <div className="px-4 py-3 mx-3 mt-4 bg-indigo-900/50 rounded-xl">
                        <p className="text-white text-sm font-semibold truncate">{user.fullName}</p>
                        <p className="text-indigo-400 text-xs truncate">{user.email}</p>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 mt-4 px-3 space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                                    : "text-indigo-300 hover:bg-indigo-800/50 hover:text-white"
                                }`
                            }
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-indigo-800/40">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
                    >
                        <span className="text-lg">🚪</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
