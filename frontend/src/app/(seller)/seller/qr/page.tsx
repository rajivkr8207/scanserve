'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  QrCode as QrIcon, 
  Download, 
  Plus, 
  Trash2, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink,
  Smartphone,
  Eye,
  Info,
  Hash,
  Palette
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

const MOCK_QRS = [
  { id: 'qr_1', table: 'Table 01', slug: 'spice-garden', tableNum: 'T-1', scans: 142, lastScan: '10 mins ago' },
  { id: 'qr_2', table: 'Table 02', slug: 'spice-garden', tableNum: 'T-2', scans: 89, lastScan: '2 hrs ago' },
  { id: 'qr_3', table: 'Table 03', slug: 'spice-garden', tableNum: 'T-3', scans: 24, lastScan: 'Yesterday' },
  { id: 'qr_4', table: 'VIP Booth', slug: 'spice-garden', tableNum: 'V-1', scans: 56, lastScan: '30 mins ago' },
];

export default function QRManagementPage() {
  const [selectedQR, setSelectedQR] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getOrigin = () => {
    if (typeof window !== 'undefined') return window.location.origin;
    return '';
  };

  const copyLink = (id: string, slug: string, tableNum: string) => {
    const link = `${getOrigin()}/${slug}?table=${tableNum}`;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight font-[var(--font-outfit)]">Smart QR Codes</h1>
          <p className="text-[var(--text-secondary)] font-medium">Generate and manage unique QR codes for your tables.</p>
        </div>
        <button className="btn btn-primary btn-lg gap-2 shadow-xl shadow-[var(--brand-glow)]">
          <Plus size={20} /> Generate New QRs
        </button>
      </div>

      {/* QR Customization Card */}
      <div className="card p-8 bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] text-white relative overflow-hidden border-none shadow-[var(--shadow-brand)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-black mb-4">Design Your Brand Experience</h2>
            <p className="text-white/80 mb-8 font-medium max-w-lg leading-relaxed">
              Custom QR codes with your restaurant logo, colors, and unique styling. Create a premium first impression before the first bite.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn bg-white text-[var(--brand)] font-black btn-sm px-6">Customize Styles</button>
              <button className="btn bg-transparent border-2 border-white/30 text-white font-black btn-sm px-6 hover:bg-white/10">Bulk Print</button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl relative rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)] to-transparent opacity-10 rounded-[2.5rem]" />
              {mounted && (
                <QRCodeSVG 
                  value={`${getOrigin()}/spice-garden`} 
                  size={140}
                  level="H"
                  fgColor="#6c47ff"
                  includeMargin={false}
                />
              )}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-lg border border-[var(--border)] whitespace-nowrap">
                <span className="text-[10px] font-black text-[var(--brand)] uppercase tracking-widest">Spice Garden</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MOCK_QRS.map((qr) => (
          <motion.div
            key={qr.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card group hover:border-[var(--brand)] transition-all flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col items-center text-center">
              <div 
                className="w-full aspect-square bg-[var(--surface-2)] rounded-3xl flex items-center justify-center mb-6 border border-dashed border-[var(--border)] group-hover:bg-white group-hover:border-solid group-hover:border-[var(--brand-brand)] transition-all cursor-zoom-in"
                onClick={() => { setSelectedQR(qr); setIsModalOpen(true); }}
              >
                {mounted && (
                  <QRCodeSVG 
                    value={`${getOrigin()}/${qr.slug}?table=${qr.tableNum}`} 
                    size={140}
                    level="M"
                  />
                )}
              </div>
              <h3 className="font-black text-[var(--text-primary)] text-lg tracking-tight mb-1">{qr.table}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-dark text-[10px] font-black tracking-widest">{qr.tableNum}</span>
                <span className="text-[var(--text-muted)] text-xs font-bold flex items-center gap-1">
                  <Smartphone size={12} /> {qr.scans} Scans
                </span>
              </div>
            </div>

            <div className="p-4 bg-[var(--surface-2)]/50 border-t border-[var(--border)] grid grid-cols-3 gap-2">
              <button 
                onClick={() => copyLink(qr.id, qr.slug, qr.tableNum)}
                className="p-2 rounded-xl hover:bg-white hover:text-[var(--brand)] transition-all flex flex-col items-center gap-1"
              >
                {copiedId === qr.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                <span className="text-[8px] font-black uppercase tracking-widest">Link</span>
              </button>
              <button className="p-2 rounded-xl hover:bg-white hover:text-[var(--brand)] transition-all flex flex-col items-center gap-1">
                <Download size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">Save</span>
              </button>
              <button 
                onClick={() => { setSelectedQR(qr); setIsModalOpen(true); }}
                className="p-2 rounded-xl hover:bg-white hover:text-[var(--brand)] transition-all flex flex-col items-center gap-1"
              >
                <Printer size={18} />
                <span className="text-[8px] font-black uppercase tracking-widest">Print</span>
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add QR Card */}
        <button className="border-4 border-dashed border-[var(--border)] rounded-3xl py-12 flex flex-col items-center justify-center gap-4 group hover:border-[var(--brand)] hover:bg-[var(--brand-light)] transition-all">
          <div className="w-12 h-12 rounded-full bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all shadow-sm">
            <Plus size={24} />
          </div>
          <span className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-[var(--brand)]">Create New QR</span>
        </button>
      </div>

      {/* Preview Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={`QR Preview - ${selectedQR?.table}`}
      >
        <div className="flex flex-col items-center py-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-2 border-[var(--border)] mb-8">
            {mounted && (
              <QRCodeSVG 
                value={`${getOrigin()}/${selectedQR?.slug}?table=${selectedQR?.tableNum}`} 
                size={240}
                level="H"
                fgColor="var(--text-primary)"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <button className="btn btn-primary gap-2">
              <Download size={18} /> Download PNG
            </button>
            <button className="btn btn-ghost gap-2">
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
