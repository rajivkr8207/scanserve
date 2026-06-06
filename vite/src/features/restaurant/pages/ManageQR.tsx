import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import UseRestaurant from "../hooks/UseRestaurant";

export default function ManageQR() {
    const { restaurant, fetchMyRestaurant, isLoading } = UseRestaurant();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [qrGenerated, setQrGenerated] = useState(false);
    const [copied, setCopied] = useState(false);
    const [menuUrl, setMenuUrl] = useState("");
    const [qrSize, setQrSize] = useState(280);
    const [qrColor, setQrColor] = useState("#1e1b4b");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        fetchMyRestaurant().catch(() => {});
    }, []);

    useEffect(() => {
        if (restaurant?.slug) {
            const url = `${window.location.origin}/menu/${restaurant.slug}`;
            setMenuUrl(url);
        }
    }, [restaurant]);

    useEffect(() => {
        if (menuUrl && canvasRef.current) {
            generateQR();
        }
    }, [menuUrl, qrSize, qrColor, bgColor]);

    const generateQR = async () => {
        if (!canvasRef.current || !menuUrl) return;
        try {
            await QRCode.toCanvas(canvasRef.current, menuUrl, {
                width: qrSize,
                margin: 2,
                color: {
                    dark: qrColor,
                    light: bgColor,
                },
                errorCorrectionLevel: "H",
            });
            setQrGenerated(true);
        } catch (err) {
            console.error("QR generation error:", err);
        }
    };

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const link = document.createElement("a");
        link.download = `${restaurant?.name || "menu"}-qr.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // fallback
            const input = document.createElement("input");
            input.value = menuUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleOpenMenu = () => {
        window.open(menuUrl, "_blank");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="text-6xl">🏪</div>
                <h2 className="text-2xl font-bold text-slate-700">No Restaurant Found</h2>
                <p className="text-slate-500">Create a restaurant first to generate a QR code.</p>
            </div>
        );
    }

    if (!restaurant.slug) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
                <div className="text-6xl">⚠️</div>
                <h2 className="text-2xl font-bold text-slate-700">No Slug Found</h2>
                <p className="text-slate-500">Your restaurant needs a URL slug to generate a QR code.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">QR Code</h1>
                    <p className="text-slate-500 mt-1">
                        Share this QR so customers can scan and view your menu instantly
                    </p>
                </div>
                <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                        showSettings
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Customize
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Code Display */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center space-y-6">
                    {/* Restaurant name badge */}
                    <div className="text-center">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Menu QR Code</p>
                        <h2 className="text-lg font-bold text-slate-800">{restaurant.name}</h2>
                    </div>

                    {/* QR Canvas */}
                    <div className="relative">
                        <div
                            className="rounded-2xl overflow-hidden shadow-lg ring-4 ring-indigo-50"
                            style={{ background: bgColor }}
                        >
                            <canvas ref={canvasRef} className="block" />
                        </div>
                        {qrGenerated && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Scan instruction */}
                    <p className="text-sm text-slate-400 text-center">
                        📱 Scan with any camera app to view the menu
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <button
                            onClick={handleDownload}
                            disabled={!qrGenerated}
                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PNG
                        </button>

                        <button
                            onClick={handleCopyUrl}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all shadow-sm ${
                                copied
                                    ? "bg-green-500 text-white"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                        >
                            {copied ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy URL
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleOpenMenu}
                            className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-3 rounded-xl hover:bg-emerald-100 font-medium transition-all shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            View Menu
                        </button>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="space-y-6">
                    {/* Menu URL Card */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-white">Public Menu URL</h3>
                        </div>

                        <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
                            <code className="text-indigo-300 text-sm flex-1 break-all">{menuUrl}</code>
                            <button
                                onClick={handleCopyUrl}
                                className="flex-shrink-0 text-slate-400 hover:text-indigo-300 transition-colors"
                                title="Copy URL"
                            >
                                {copied ? (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <p className="text-slate-400 text-sm">
                            This link opens your menu directly — no login required for customers.
                        </p>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">💡</span>
                            <h3 className="font-semibold text-amber-800">Tips for using your QR</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-amber-700">
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                Print and place at every table for instant menu access
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                Add to your entrance, menus, and social media
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                Works with any smartphone camera — no app needed
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="mt-0.5">•</span>
                                Menu updates reflect instantly when customers scan
                            </li>
                        </ul>
                    </div>

                    {/* Restaurant Info */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
                        <h3 className="font-semibold text-slate-700">Restaurant Details</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Name</span>
                                <span className="font-medium text-slate-800">{restaurant.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Slug</span>
                                <span className="font-mono text-indigo-600 text-xs">{restaurant.slug}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className={`font-medium text-xs px-2 py-0.5 rounded-full ${
                                    restaurant.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}>
                                    {restaurant.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Customize Settings Panel */}
            {showSettings && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                        Customize QR Code
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">QR Size</label>
                            <input
                                type="range"
                                min="200"
                                max="400"
                                step="20"
                                value={qrSize}
                                onChange={(e) => setQrSize(Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                            <p className="text-xs text-slate-400 mt-1 text-center">{qrSize}px</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">QR Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={qrColor}
                                    onChange={(e) => setQrColor(e.target.value)}
                                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                                />
                                <span className="font-mono text-sm text-slate-600">{qrColor}</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-2">Background Color</label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                                />
                                <span className="font-mono text-sm text-slate-600">{bgColor}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
