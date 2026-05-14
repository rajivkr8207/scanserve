'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode as QrIcon, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Smartphone,
  Loader2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/ui/Modal';
import { useRestaurants } from '@/features/restaurant/hooks/useRestaurants';
import Link from 'next/link';

export default function QRManagementPage() {
  const { restaurants, loading, fetchRestaurants } = useRestaurants();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const restaurant = restaurants[0]; // Assuming one restaurant for now

  useEffect(() => {
    setMounted(true);
    fetchRestaurants();
  }, [fetchRestaurants]);

  const getOrigin = () => {
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
  };

  const qrUrl = mounted && restaurant ? `${getOrigin()}/qr/${restaurant.slug}` : '';

  const copyLink = () => {
    if (!qrUrl) return;
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = (qrId: string, filename: string) => {
    const svg = document.getElementById(qrId);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 80;
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
        ctx.fillStyle = "black";
        ctx.font = "bold 20px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(filename, canvas.width / 2, img.height + 50);
        
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${filename.replace(/\s+/g, '-')}-QR.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  if (!mounted) return null;

  if (loading && restaurants.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[var(--brand)] animate-spin" />
      </div>
    );
  }

  if (!restaurant && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <QrIcon size={64} className="text-[var(--text-muted)]" />
        <h2 className="text-xl font-black">No Restaurant Found</h2>
        <p className="text-[var(--text-secondary)]">Create a restaurant first to generate QR codes.</p>
        <Link href="/seller/restaurants" className="btn btn-primary">Go to Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Smart Menu QR</h1>
          <p className="text-[var(--text-secondary)] font-medium">Your customized restaurant menu QR code.</p>
        </div>
      </div>

      {/* Main QR Display */}
      <div className="card p-8 bg-[var(--surface)] relative overflow-hidden border border-[var(--border)] shadow-xl rounded-[2.5rem]">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <div 
              className="bg-white p-6 rounded-[2rem] shadow-2xl relative transition-transform duration-500 cursor-pointer hover:scale-105 border border-[var(--border)]"
              onClick={() => setIsModalOpen(true)}
            >
              <QRCodeSVG 
                id="main-qr"
                value={qrUrl} 
                size={220}
                level="H"
                fgColor="#1a1a1a"
                includeMargin={false}
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-[var(--border)] whitespace-nowrap">
                <span className="text-xs font-black text-[var(--brand)] uppercase tracking-widest">{restaurant.name}</span>
              </div>
            </div>

            <div className="flex gap-4 mt-8 w-full max-w-[280px]">
              <button 
                onClick={copyLink}
                className="flex-1 btn bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--brand)] hover:text-white flex flex-col items-center gap-2 py-4 h-auto rounded-2xl transition-all"
              >
                {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                <span className="text-[10px] font-black uppercase tracking-widest">Copy Link</span>
              </button>
              <button 
                onClick={() => downloadQR('main-qr', restaurant.name)}
                className="flex-1 btn bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--brand)] hover:text-white flex flex-col items-center gap-2 py-4 h-auto rounded-2xl transition-all"
              >
                <Download size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Download</span>
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 btn bg-[var(--surface-2)] text-[var(--text-primary)] hover:bg-[var(--brand)] hover:text-white flex flex-col items-center gap-2 py-4 h-auto rounded-2xl transition-all"
              >
                <Printer size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Print</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-[var(--brand-light)] text-[var(--brand)] rounded-full text-xs font-black uppercase tracking-widest mb-2">
              Ready to Scan
            </div>
            <h2 className="text-4xl font-black text-[var(--text-primary)] leading-tight">
              Your Digital<br />Menu is Live
            </h2>
            <p className="text-[var(--text-secondary)] font-medium text-lg leading-relaxed">
              Customers can scan this QR code to instantly view your full menu. 
              The menu will automatically reflect your customized colors, fonts, and layout.
            </p>
            
            <div className="bg-[var(--surface-2)] p-4 rounded-2xl flex items-start gap-4 mt-6 border border-[var(--border)]">
              <div className="bg-white p-2 rounded-xl text-[var(--brand)]">
                <Smartphone size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-1 text-[var(--text-primary)]">URL Endpoint</h4>
                <p className="text-xs text-[var(--text-muted)] font-mono break-all">{qrUrl}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Preview Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`Print QR Code`}
      >
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-[var(--border)] mb-8">
            <QRCodeSVG 
              id="preview-qr"
              value={qrUrl} 
              size={240}
              level="H"
              fgColor="#1a1a1a"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={() => downloadQR('preview-qr', restaurant.name)}
              className="btn btn-primary gap-2"
            >
              <Download size={18} /> Download PNG
            </button>
            <button 
              onClick={() => window.print()}
              className="btn btn-ghost gap-2"
            >
              <Printer size={18} /> Print Label
            </button>
          </div>
          <p className="mt-6 text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest text-center leading-relaxed">
            Scan with any smartphone camera to<br />view the digital menu instantly.
          </p>
        </div>
      </Modal>
    </div>
  );
}
