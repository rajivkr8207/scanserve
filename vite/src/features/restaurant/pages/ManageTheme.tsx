import { useState, useEffect } from "react";
import { ThemeServices, type MenuTheme } from "../services/theme.service";
import { RestaurantServices } from "../services/restaurant.service";
import PublicMenu from "../../menu/pages/PublicMenu";

export default function ManageTheme() {
    const [theme, setTheme] = useState<MenuTheme>({
        name: "My Theme",
        slug: "my-theme",
        branding: { restaurantName: "", tagline: "" },
        colors: {
            primary: "#4f46e5",
            background: "#f8fafc",
            surface: "#ffffff",
            textPrimary: "#1e293b",
            textSecondary: "#64748b",
            buttonColor: "#4f46e5",
            buttonTextColor: "#ffffff"
        },
        typography: {
            headingFont: "Inter",
            bodyFont: "Inter"
        },
        layout: {
            templateStyle: "cards",
            categoryStyle: "tabs",
        },
        visibility: {
            showSearch: true,
            showCategory: true,
            showVegBadge: true,
            showDescription: true,
            showPrice: true,
        },
        effects: {
            glassmorphism: false,
        }
    });
    
    const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [activeTab, setActiveTab] = useState("Colors");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const restRes = await RestaurantServices.getMyRestaurant();
            if (restRes.data && restRes.data.slug) {
                setRestaurantSlug(restRes.data.slug);
            }

            const themeRes = await ThemeServices.getMyTheme();
            if (themeRes.data) {
                setTheme(themeRes.data);
            }
        } catch (err: any) {
            console.error("Failed to load theme data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccessMsg("");
        try {
            if (theme._id) {
                await ThemeServices.updateTheme(theme._id, theme);
            } else {
                const res = await ThemeServices.createTheme({
                    ...theme,
                    slug: `theme-${Date.now()}`
                });
                setTheme(res.data.data || res.data);
            }
            setSuccessMsg("Theme saved successfully!");
            setTimeout(() => setSuccessMsg(""), 3000);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to save theme");
        } finally {
            setSaving(false);
        }
    };

    // Deep update helper
    const updateNested = (section: keyof MenuTheme, key: string, value: any) => {
        setTheme(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] || {}),
                [key]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const tabs = ["Branding", "Colors", "Typography", "Layout", "Visibility", "Effects"];

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-slate-100 overflow-hidden">
            {/* Editor Sidebar */}
            <div className="w-full lg:w-[450px] bg-white border-r border-slate-200 flex flex-col h-full z-10 shadow-lg">
                <div className="p-5 border-b border-slate-100 flex-shrink-0 flex items-center justify-between bg-white">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Menu Theme</h1>
                        <p className="text-xs text-slate-500 mt-1">Configure your menu aesthetics</p>
                    </div>
                    <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
                
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b border-slate-100 bg-slate-50/50 flex-shrink-0 hide-scrollbar">
                    {tabs.map(t => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === t ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">{error}</div>}
                    {successMsg && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">{successMsg}</div>}

                    {activeTab === "Branding" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Restaurant Name (Override)</label>
                                <input type="text" value={theme.branding?.restaurantName || ""} onChange={e => updateNested('branding', 'restaurantName', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
                                <input type="text" value={theme.branding?.tagline || ""} onChange={e => updateNested('branding', 'tagline', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL</label>
                                <input type="text" value={theme.branding?.logo || ""} onChange={e => updateNested('branding', 'logo', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                            </div>
                        </div>
                    )}

                    {activeTab === "Colors" && (
                        <div className="space-y-3">
                            {[
                                { k: 'primary', label: 'Primary Brand Color' },
                                { k: 'background', label: 'Page Background' },
                                { k: 'surface', label: 'Card/Surface Background' },
                                { k: 'textPrimary', label: 'Main Text' },
                                { k: 'textSecondary', label: 'Muted Text' },
                                { k: 'buttonColor', label: 'Button Color' },
                                { k: 'buttonTextColor', label: 'Button Text Color' },
                                { k: 'success', label: 'Success (e.g. Veg Badge)' },
                                { k: 'danger', label: 'Danger (e.g. Non-veg Badge)' }
                            ].map(c => (
                                <div key={c.k} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
                                    <span className="text-sm font-medium text-slate-700">{c.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 uppercase">{theme.colors?.[c.k as keyof typeof theme.colors] || '#000000'}</span>
                                        <input type="color" value={theme.colors?.[c.k as keyof typeof theme.colors] || '#000000'} onChange={e => updateNested('colors', c.k, e.target.value)} className="w-8 h-8 rounded cursor-pointer p-0 border-0" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Layout" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Template Style</label>
                                <select value={theme.layout?.templateStyle || 'cards'} onChange={e => updateNested('layout', 'templateStyle', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                                    <option value="cards">Cards (Modern)</option>
                                    <option value="list">List (Compact)</option>
                                    <option value="grid">Grid (Photos first)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Border Radius (px)</label>
                                <input type="number" value={theme.layout?.borderRadius || 20} onChange={e => updateNested('layout', 'borderRadius', parseInt(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg text-sm" />
                            </div>
                        </div>
                    )}

                    {activeTab === "Typography" && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Heading Font</label>
                                <select value={theme.typography?.headingFont || 'Inter'} onChange={e => updateNested('typography', 'headingFont', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                                    <option value="Inter">Inter</option>
                                    <option value="Poppins">Poppins</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                    <option value="Outfit">Outfit</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Body Font</label>
                                <select value={theme.typography?.bodyFont || 'Inter'} onChange={e => updateNested('typography', 'bodyFont', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                                    <option value="Inter">Inter</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Lato">Lato</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === "Visibility" && (
                        <div className="space-y-3">
                            {[
                                { k: 'showSearch', label: 'Show Search Bar' },
                                { k: 'showCategory', label: 'Show Categories' },
                                { k: 'showVegBadge', label: 'Show Veg/Non-Veg Badges' },
                                { k: 'showDescription', label: 'Show Item Descriptions' },
                                { k: 'showPrice', label: 'Show Item Prices' },
                                { k: 'showAddToCart', label: 'Show Add to Cart Buttons' }
                            ].map(v => (
                                <label key={v.k} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100">
                                    <span className="text-sm font-medium text-slate-700">{v.label}</span>
                                    <input 
                                        type="checkbox" 
                                        checked={theme.visibility?.[v.k as keyof typeof theme.visibility] ?? true} 
                                        onChange={e => updateNested('visibility', v.k, e.target.checked)}
                                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                                    />
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === "Effects" && (
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100">
                                <span className="text-sm font-medium text-slate-700">Glassmorphism UI</span>
                                <input 
                                    type="checkbox" 
                                    checked={theme.effects?.glassmorphism || false} 
                                    onChange={e => updateNested('effects', 'glassmorphism', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 cursor-pointer hover:bg-slate-100">
                                <span className="text-sm font-medium text-slate-700">Gradient Background</span>
                                <input 
                                    type="checkbox" 
                                    checked={theme.effects?.gradientBackground || false} 
                                    onChange={e => updateNested('effects', 'gradientBackground', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" 
                                />
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Live Preview Area */}
            <div className="flex-1 bg-slate-800 overflow-y-auto relative hidden lg:block border-l border-slate-700 shadow-inner">
                {/* Mock Phone Frame */}
                <div className="absolute inset-0 p-8 flex items-start justify-center min-h-max">
                    <div className="w-[400px] h-[800px] bg-black rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border-[8px] border-slate-900 relative ring-1 ring-slate-700">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-50 flex items-center justify-center">
                            <div className="w-16 h-4 bg-black rounded-full flex items-center justify-between px-2">
                                <div className="w-2 h-2 rounded-full bg-blue-900/30"></div>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50"></div>
                            </div>
                        </div>
                        
                        {/* Actual preview content */}
                        <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar bg-white relative pt-4">
                            {restaurantSlug ? (
                                <div className="pointer-events-none origin-top-left h-[100%] w-[100%]">
                                    <PublicMenu previewTheme={theme} previewSlug={restaurantSlug} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50">
                                    <p className="text-4xl mb-4">🏪</p>
                                    <p className="text-slate-600 font-medium text-sm">Setup your restaurant profile first.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Background decoration for preview area */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Live Preview
                    </div>
                </div>
            </div>
        </div>
    );
}
