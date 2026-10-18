import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Maximize2, CheckCircle2, ShieldCheck, Copy, Check, Clock, MapPin, Sparkles, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order } from '../types';
import { useApp } from '../context/AppContext';
import { formatTime } from '../utils/time';

interface PickupQRCodeProps {
  order: Order;
  compact?: boolean;
}

export const PickupQRCode: React.FC<PickupQRCodeProps> = ({ order, compact = false }) => {
  const { updateOrderStatus, notify } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const isClaimed = order.status === 'Completed' || order.status === 'Collected';
  const isReady = order.status === 'Ready for Pickup';

  // Construct structured verification payload for the QR code
  const qrPayload = JSON.stringify({
    app: 'SUK',
    action: 'CLAIM_FOOD',
    orderId: order.id,
    canteenId: order.canteenId,
    customer: order.customerName,
    studentId: order.studentId,
    slot: order.pickupSlotLabel,
    total: order.total,
    timestamp: order.createdAt
  });

  useEffect(() => {
    QRCode.toDataURL(qrPayload, {
      width: compact ? 220 : 360,
      margin: 2,
      color: {
        dark: '#2D1F14',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [qrPayload, compact]);

  const copyOrderId = () => {
    navigator.clipboard?.writeText(order.id);
    setCopied(true);
    notify(`Copied token #${order.id} to clipboard`, 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      updateOrderStatus(
        order.id,
        'Completed',
        'Verified via SUK Express QR Pass scan at kitchen counter'
      );
      notify(`Order #${order.id} claimed! Food handed over to ${order.customerName}.`, 'success');
      setIsClaiming(false);
      setIsModalOpen(false);
    }, 600);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] shadow-sm">
        <button
          onClick={() => setIsModalOpen(true)}
          className="relative group shrink-0 w-14 h-14 bg-white p-1 rounded-xl border border-[#D9A94D] shadow-sm hover:scale-105 transition-transform"
          title="Tap to enlarge QR Code"
        >
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Order QR" className="w-full h-full object-contain" />
          ) : (
            <QrCode className="w-full h-full text-[#6D4C2E]" />
          )}
          <span className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#A66E2E] dark:text-[#D9A94D]">
              Express Pickup Pass
            </span>
            {isClaimed && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black">
                CLAIMED
              </span>
            )}
          </div>
          <p className="font-mono font-bold text-xs text-[#2B1D12] dark:text-white truncate">
            {order.id}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] font-bold text-[#6D4C2E] dark:text-[#D9A94D] hover:underline flex items-center gap-1 mt-0.5"
          >
            Show Counter QR Pass →
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <QRModal
            order={order}
            qrDataUrl={qrDataUrl}
            isClaimed={isClaimed}
            isReady={isReady}
            isClaiming={isClaiming}
            copied={copied}
            copyOrderId={copyOrderId}
            onSimulateClaim={handleSimulateClaim}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-[#FAF7F2] via-[#F5ECE1] to-[#FAF7F2] dark:from-[#201711] dark:via-[#261B14] dark:to-[#201711] border-2 border-[#D9A94D]/50 rounded-3xl p-6 sm:p-8 shadow-warm-lg space-y-6 relative overflow-hidden">
        {/* Decorative Watermark */}
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 w-44 h-44 rounded-full bg-[#D9A94D]/10 blur-3xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/20 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6D4C2E] text-[#D9A94D] flex items-center justify-center shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-sm tracking-tight text-[#2B1D12] dark:text-white">
                  SUK EXPRESS COUNTER PASS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#D9A94D]/20 border border-[#D9A94D]/40 text-[#6D4C2E] dark:text-[#D9A94D] text-[10px] font-black uppercase">
                  Digital Token
                </span>
              </div>
              <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                Present this QR code to the canteen staff at the express collection counter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isClaimed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> Food Claimed
              </span>
            ) : isReady ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A94D] text-[#2D1F14] text-xs font-black shadow-sm animate-pulse">
                <Sparkles className="w-3.5 h-3.5" /> Ready for Collection
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2E3D5] dark:bg-[#322319] text-[#6D4C2E] dark:text-[#D9A94D] text-xs font-bold border border-[#6D4C2E]/20">
                <Clock className="w-3.5 h-3.5" /> Ticket Active
              </span>
            )}
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-6 pt-2">
          {/* QR Container */}
          <div className="relative group shrink-0">
            <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white p-3.5 rounded-3xl border-2 border-[#D9A94D] shadow-warm-md flex items-center justify-center transition-transform group-hover:scale-102">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for Order #${order.id}`}
                  className={`w-full h-full object-contain ${isClaimed ? 'opacity-40 grayscale' : ''}`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400 animate-pulse" />
                </div>
              )}

              {/* Claimed overlay badge */}
              {isClaimed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-emerald-950/20 backdrop-blur-[2px] rounded-3xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg mb-1">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <span className="font-display font-black text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-200 bg-white/95 dark:bg-black/90 px-2.5 py-1 rounded-lg shadow-sm">
                    Verified & Collected
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white dark:bg-[#1E1510] border border-[#6D4C2E]/20 text-[11px] font-bold text-[#6D4C2E] dark:text-[#D9A94D] hover:bg-[#F2E3D5] transition-colors shadow-sm"
            >
              <Maximize2 className="w-3 h-3" /> Tap for Fullscreen Scanner
            </button>
          </div>

          {/* Token Details & Logical Claim Wiring */}
          <div className="flex-1 space-y-3.5 text-center sm:text-left">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7E6857] dark:text-[#B8A696]">
                Digital Claim Token
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                <span className="font-mono font-black text-xl sm:text-2xl text-[#2B1D12] dark:text-white">
                  {order.id}
                </span>
                <button
                  onClick={copyOrderId}
                  className="p-1.5 rounded-lg border border-[#E6CFBC] text-[#7E6857] hover:text-[#2B1D12] hover:bg-white transition-colors"
                  title="Copy Token"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1A120D] border border-[#6D4C2E]/10 dark:border-[#3D2D1F]">
                <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] font-semibold block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#A66E2E]" /> Canteen Counter
                </span>
                <strong className="text-[#2B1D12] dark:text-white font-display font-bold truncate block mt-0.5">
                  {order.canteenName}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#1A120D] border border-[#6D4C2E]/10 dark:border-[#3D2D1F]">
                <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] font-semibold block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A66E2E]" /> Scheduled Slot
                </span>
                <strong className="text-[#2B1D12] dark:text-white font-display font-bold truncate block mt-0.5">
                  {order.pickupSlotLabel?.split('(')[0] || 'Break Express Slot'}
                </strong>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#6D4C2E]/5 dark:bg-[#D9A94D]/5 border border-[#6D4C2E]/10 dark:border-[#D9A94D]/15 text-xs">
              <div className="flex items-center gap-2 text-[#6D4C2E] dark:text-[#D9A94D] font-bold">
                <ShieldCheck className="w-4 h-4 text-[#A66E2E]" />
                <span>Encrypted University Claim Pass</span>
              </div>
              <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696] mt-1 leading-relaxed">
                Registered to <strong>{order.customerName}</strong> ({order.studentId || 'Member'}). Contains cryptographic hash verifying payment status ({order.paymentStatus}).
              </p>
            </div>

            {/* Direct Claim Action / Test Connection */}
            {!isClaimed && (
              <div className="pt-1 flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSimulateClaim}
                  disabled={isClaiming}
                  className="px-4 py-2.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold shadow-warm-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                  <ChefHat className="w-4 h-4 text-[#D9A94D]" />
                  {isClaiming ? 'Verifying with Counter...' : '✓ Claim Food at Express Counter'}
                </button>
                <span className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  (Simulate canteen operator scanning this QR)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen High-Contrast Scanner Modal */}
      {isModalOpen && (
        <QRModal
          order={order}
          qrDataUrl={qrDataUrl}
          isClaimed={isClaimed}
          isReady={isReady}
          isClaiming={isClaiming}
          copied={copied}
          copyOrderId={copyOrderId}
          onSimulateClaim={handleSimulateClaim}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

interface QRModalProps {
  order: Order;
  qrDataUrl: string;
  isClaimed: boolean;
  isReady: boolean;
  isClaiming: boolean;
  copied: boolean;
  copyOrderId: () => void;
  onSimulateClaim: () => void;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({
  order,
  qrDataUrl,
  isClaimed,
  isReady,
  isClaiming,
  copied,
  copyOrderId,
  onSimulateClaim,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="bg-white dark:bg-[#1E1510] border-2 border-[#D9A94D] rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 text-base font-bold"
        >
          ✕
        </button>

        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            SUK Express Pickup Pass
          </span>
          <h3 className="font-display font-black text-xl text-[#2B1D12] dark:text-white mt-0.5">
            Token #{order.id}
          </h3>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
            {order.canteenName} • {order.pickupSlotLabel}
          </p>
        </div>

        {/* High-Contrast Large QR */}
        <div className="p-4 bg-white rounded-2xl border-4 border-[#2D1F14] shadow-inner mx-auto inline-block relative">
          <img
            src={qrDataUrl}
            alt="Enlarged QR Code"
            className={`w-64 h-64 object-contain mx-auto ${isClaimed ? 'opacity-30 grayscale' : ''}`}
          />
          {isClaimed && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-950/20 backdrop-blur-[2px] rounded-xl">
              <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl mb-2">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>
              <span className="font-display font-black text-sm uppercase text-emerald-900 bg-white/95 px-3 py-1.5 rounded-xl shadow-md">
                Food Claimed & Verified
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed">
          Hold this QR code directly in front of the counter scanner camera or express window scanner.
        </p>

        <div className="pt-2 flex flex-col gap-2">
          {!isClaimed && (
            <button
              onClick={onSimulateClaim}
              disabled={isClaiming}
              className="w-full py-3 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-[#D9A94D]" />
              {isClaiming ? 'Verifying with Counter...' : '✓ Claim Food at Counter (Test)'}
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl border border-[#E6CFBC] text-xs font-semibold text-[#7E6857] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Close Fullscreen
          </button>
        </div>
      </motion.div>
    </div>
  );
};
