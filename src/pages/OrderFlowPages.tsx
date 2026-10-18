import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Banknote,
  RotateCcw,
  Sparkles,
  Store,
  Wallet,
  QrCode,
  ShieldCheck,
  Check,
  Flame,
  ChefHat,
  PackageCheck,
  XCircle,
  PlayCircle,
  Printer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus, PaymentMethod } from '../types';
import { formatINR, calculateOrderTotals } from '../utils/price';
import {
  formatTime,
  formatDate,
  formatDateTime,
  useLiveRelativeTime,
  getRelativeTimeString
} from '../utils/time';

/* ==========================================================================
   CART PAGE
   ========================================================================== */

export const CartPage: React.FC = () => {
  const { cart, foods, canteens, settings, updateCartQty, removeFromCart, clearCart } = useApp();
  const [confirmClear, setConfirmClear] = useState(false);

  const detailedItems = cart
    .map((ci) => {
      const food = foods.find((f) => f.id === ci.foodId);
      return food ? { ...ci, food } : null;
    })
    .filter(Boolean) as Array<typeof cart[0] & { food: typeof foods[0] }>;

  if (detailedItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-3xl bg-[#F2E3D5] text-[#6D4C2E] flex items-center justify-center mx-auto mb-4 shadow-sm"
        >
          <ShoppingBag className="w-8 h-8 text-[#A66E2E]" />
        </motion.div>
        <h1 className="font-display text-2xl font-black text-[#2B1D12] dark:text-white">Your pickup bag is empty</h1>
        <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] mt-2 mb-8 max-w-md mx-auto leading-relaxed">
          Browse live menus from Campus Central Dining, Green Bowl Kitchen, or Campus Roasters to lock in your next break-time meal.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold shadow-warm-md hover:scale-105 active:scale-95 transition-all"
        >
          Browse Campus Menu <ArrowRight className="w-4 h-4 text-[#D9A94D]" />
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === detailedItems[0].canteenId);
  const totals = calculateOrderTotals(
    detailedItems.map((item) => ({
      price: item.food.price,
      quantity: item.quantity,
      addOns: item.selectedAddOns
    })),
    settings.platformFeeRs
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            Single-Canteen Pre-Order
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#2B1D12] dark:text-white mt-0.5">
            Your Pickup Bag
          </h1>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1 flex items-center gap-1.5 font-semibold">
            <Store className="w-3.5 h-3.5 text-[#A66E2E]" /> Preparing fresh at <strong>{canteen?.name}</strong> ({canteen?.pickupCounter})
          </p>
        </div>

        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Empty Bag
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/60 p-2 rounded-xl border border-rose-200">
            <span className="text-xs text-rose-700 dark:text-rose-200 font-bold px-1">Clear all items?</span>
            <button
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold"
            >
              Yes, Clear
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-2.5 py-1 rounded-lg bg-gray-200 dark:bg-gray-800 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Item List */}
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence>
            {detailedItems.map((item) => {
              const addOnTotal = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
              const lineTotal = (item.food.price + addOnTotal) * item.quantity;
              return (
                <motion.div
                  key={item.cartItemId}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.food.image}
                      alt={item.food.name}
                      className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-[#E6CFBC]/60"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${item.food.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                        <h3 className="font-display font-bold text-sm sm:text-base text-[#2B1D12] dark:text-white">
                          {item.food.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-0.5">
                        Base: {formatINR(item.food.price)} • Prep: ~{item.food.prepTimeMins}m
                      </p>
                      {item.selectedAddOns.length > 0 && (
                        <p className="text-xs text-[#A66E2E] dark:text-[#D9A94D] font-semibold mt-1">
                          Add-ons: {item.selectedAddOns.map((a) => `${a.name} (+${formatINR(a.price)})`).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6CFBC]/40">
                    <div className="flex items-center gap-2 bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-xl px-2 py-1">
                      <button
                        onClick={() => updateCartQty(item.cartItemId, -1)}
                        className="p-1 text-[#6D4C2E] dark:text-[#D9A94D] hover:bg-[#F2E3D5] rounded-md transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-xs px-2 text-[#2B1D12] dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQty(item.cartItemId, 1)}
                        className="p-1 text-[#6D4C2E] dark:text-[#D9A94D] hover:bg-[#F2E3D5] rounded-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display font-extrabold text-sm sm:text-base text-[#2B1D12] dark:text-white block">
                        {formatINR(lineTotal)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[11px] font-semibold text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <div className="pt-2 flex justify-between items-center text-xs text-[#7E6857] dark:text-[#B8A696]">
            <span>Need more items from {canteen?.name}?</span>
            <Link to={`/canteen/${canteen?.id}`} className="text-[#6D4C2E] dark:text-[#D9A94D] font-bold hover:underline">
              + Add more from this canteen
            </Link>
          </div>
        </div>

        {/* Order Summary & Checkout Card */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 sticky top-24 shadow-warm-sm">
            <h2 className="font-display font-black text-lg text-[#2B1D12] dark:text-white">Order Summary</h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7E6857] dark:text-[#B8A696]">Items Total ({totals.itemCount} items)</span>
                <span className="font-bold text-[#2B1D12] dark:text-white">{formatINR(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857] dark:text-[#B8A696]">Campus Operations Fee</span>
                <span className="font-bold text-[#2B1D12] dark:text-white">{formatINR(totals.platformFee)}</span>
              </div>
              <div className="border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F] pt-2 flex justify-between text-base font-display font-black text-[#2B1D12] dark:text-white">
                <span>Grand Total</span>
                <span className="text-xl text-[#6D4C2E] dark:text-[#D9A94D]">{formatINR(totals.total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full py-4 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] font-bold text-xs sm:text-sm shadow-warm-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Break Slot & Checkout <ArrowRight className="w-4 h-4 text-[#D9A94D]" />
            </Link>

            <div className="pt-2 border-t border-[#E6CFBC]/40 text-[11px] text-[#7E6857] dark:text-[#B8A696] space-y-1">
              <p>✓ Zero-line queue guarantee at express counters.</p>
              <p>✓ Order ticket timestamped & tracked live in kitchen.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   CHECKOUT PAGE
   ========================================================================== */

export const CheckoutPage: React.FC = () => {
  const { cart, foods, canteens, slots, orders, profile, settings, placeOrder } = useApp();
  const navigate = useNavigate();

  const enabledSlots = slots.filter((s) => s.enabled);
  const [customerName, setCustomerName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [contact, setContact] = useState(profile.email);
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(enabledSlots[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / Card Online');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [paymentSubTab, setPaymentSubTab] = useState<'upi' | 'card' | 'mealcard'>('upi');

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-xl font-bold text-[#2B1D12] dark:text-white">
          No active items in bag to checkout
        </h2>
        <Link to="/menu" className="inline-block mt-4 px-6 py-3 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold">
          Return to Menu
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === cart[0].canteenId);
  const totals = calculateOrderTotals(
    cart.map((ci) => {
      const f = foods.find((x) => x.id === ci.foodId);
      return {
        price: f ? f.price : 0,
        quantity: ci.quantity,
        addOns: ci.selectedAddOns
      };
    }),
    settings.platformFeeRs
  );

  const getSlotUsage = (slotId: string) =>
    orders.filter((o) => o.pickupSlotId === slotId && o.status !== 'Cancelled').length;

  const validateForm = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Please enter your pickup name.');
      return false;
    }
    if (!contact.trim()) {
      setErrorMsg('Please provide a contact email or phone number for pickup notifications.');
      return false;
    }
    if (!selectedSlotId) {
      setErrorMsg('Please select an available break pickup window.');
      return false;
    }
    const chosenSlot = slots.find((s) => s.id === selectedSlotId);
    if (!chosenSlot || !chosenSlot.enabled || getSlotUsage(selectedSlotId) >= chosenSlot.capacity) {
      setErrorMsg('Selected pickup slot has reached full kitchen capacity. Please choose another break window.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingOrder) return;
    if (!validateForm()) return;

    if (paymentMethod === 'UPI / Card Online' || paymentMethod === 'Campus Meal Card') {
      setCheckoutModalOpen(true);
    } else {
      // Pay at counter (Demo)
      setIsSubmittingOrder(true);
      const created = placeOrder({
        customerName,
        studentId,
        contact,
        pickupDate,
        pickupSlotId: selectedSlotId,
        paymentMethod: 'Pay at Counter',
        paymentStatus: 'Unpaid (Pay at Counter)',
        notes
      });
      if (created) navigate(`/order-confirmation/${created.id}`);
      else setIsSubmittingOrder(false);
    }
  };

  const executeDigitalPayment = () => {
    if (isVerifyingPayment) return;
    setIsVerifyingPayment(true);
    setTimeout(() => {
      setIsVerifyingPayment(false);
      setCheckoutModalOpen(false);
      setIsSubmittingOrder(true);

      const created = placeOrder({
        customerName,
        studentId,
        contact,
        pickupDate,
        pickupSlotId: selectedSlotId,
        paymentMethod,
        paymentStatus: 'Paid',
        notes
      });

      if (created) navigate(`/order-confirmation/${created.id}`);
      else setIsSubmittingOrder(false);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          Express Canteen Dispatch
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
          Schedule Pickup & Authorize Order
        </h1>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1">
          Lock in your meal for express collection at {canteen?.name} ({canteen?.pickupCounter}).
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Student Identification */}
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 shadow-warm-sm">
            <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
              1. Student & Member Pickup Identification
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold block mb-1 text-[#2B1D12] dark:text-[#F8F3ED]">Pickup Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] bg-[#FAF6F0] dark:bg-[#140E0A] text-sm text-[#2B1D12] dark:text-white outline-none focus:border-[#A66E2E]"
                />
              </div>
              <div>
                <label className="text-xs font-bold block mb-1 text-[#2B1D12] dark:text-[#F8F3ED]">Campus / Student ID</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] bg-[#FAF6F0] dark:bg-[#140E0A] text-sm text-[#2B1D12] dark:text-white outline-none focus:border-[#A66E2E]"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1 text-[#2B1D12] dark:text-[#F8F3ED]">Contact Email / Phone *</label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] bg-[#FAF6F0] dark:bg-[#140E0A] text-sm text-[#2B1D12] dark:text-white outline-none focus:border-[#A66E2E]"
              />
            </div>
          </div>

          {/* Break Window Selection */}
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 shadow-warm-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
                2. Select Break Pickup Window
              </h2>
              <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">
                Date: {formatDate(pickupDate)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enabledSlots.map((slot) => {
                const used = getSlotUsage(slot.id);
                const isFull = used >= slot.capacity;
                const isSelected = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/40'
                        : isFull
                        ? 'border-gray-200 dark:border-gray-800 opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-900'
                        : 'border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-display font-extrabold text-xs text-[#2B1D12] dark:text-white">
                        {slot.label}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#A66E2E] dark:text-[#D9A94D]" />}
                    </div>
                    <p className="text-xs font-mono font-bold text-[#6D4C2E] dark:text-[#D9A94D]">
                      {slot.timeRange}
                    </p>
                    <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] mt-1 block">
                      {isFull ? '● Capacity Reached' : `● ${slot.capacity - used} pickup slots open`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 shadow-warm-sm">
            <h2 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
              3. Payment Method (Simulated Demo)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI / Card Online')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'UPI / Card Online'
                    ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/30'
                    : 'border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-[#A66E2E]" />
                  <span className="text-xs font-extrabold text-[#2B1D12] dark:text-white">UPI / Card Demo</span>
                </div>
                <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  Instant QR / Card simulation.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Campus Meal Card')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Campus Meal Card'
                    ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/30'
                    : 'border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-[#D9A94D]" />
                  <span className="text-xs font-extrabold text-[#2B1D12] dark:text-white">Meal Card Demo</span>
                </div>
                <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  Balance: {formatINR(profile.mealCardBalance)}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Pay at Counter')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Pay at Counter'
                    ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/30'
                    : 'border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Banknote className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-extrabold text-[#2B1D12] dark:text-white">Pay at Counter</span>
                </div>
                <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  Settle at express pickup desk.
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-4 sticky top-24 shadow-warm-sm">
            <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
              Pickup Order Summary
            </h2>
            <p className="text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D]">
              Canteen: {canteen?.name} ({canteen?.pickupCounter})
            </p>
            <div className="divide-y divide-[#E6CFBC]/60 dark:divide-[#3D2D1F] max-h-60 overflow-y-auto">
              {cart.map((ci) => {
                const f = foods.find((x) => x.id === ci.foodId);
                if (!f) return null;
                const ao = ci.selectedAddOns.reduce((a, b) => a + b.price, 0);
                return (
                  <div key={ci.cartItemId} className="py-2.5 flex justify-between text-xs">
                    <span className="text-[#2B1D12] dark:text-white">
                      <strong>{ci.quantity}x</strong> {f.name}
                    </span>
                    <span className="font-extrabold text-[#2B1D12] dark:text-white">
                      {formatINR((f.price + ao) * ci.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-[#E6CFBC] dark:border-[#3D2D1F] pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7E6857] dark:text-[#B8A696]">Subtotal</span>
                <span className="font-bold text-[#2B1D12] dark:text-white">{formatINR(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857] dark:text-[#B8A696]">Campus Operations Fee</span>
                <span className="font-bold text-[#2B1D12] dark:text-white">{formatINR(totals.platformFee)}</span>
              </div>
              <div className="flex justify-between text-base font-display font-black pt-2 text-[#2B1D12] dark:text-white">
                <span>Total Amount</span>
                <span className="text-xl text-[#6D4C2E] dark:text-[#D9A94D]">{formatINR(totals.total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingOrder}
              className="w-full py-4 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] disabled:opacity-60 text-[#F2E3D5] font-bold text-sm shadow-warm-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isSubmittingOrder ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating Kitchen Pass...
                </>
              ) : (
                <>Confirm & Place Order • {formatINR(totals.total)}</>
              )}
            </button>
            <p className="text-[11px] text-center text-[#7E6857] dark:text-[#B8A696] leading-tight">
              Notice: Simulated checkout. No real money or card charge will occur.
            </p>
          </div>
        </div>
      </form>

      {/* Simulated Payment Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-md w-full p-6 text-center space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E6CFBC]/60 dark:border-[#3D2D1F]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#A66E2E]" />
                <span className="font-display font-extrabold text-sm text-[#2B1D12] dark:text-white">
                  Campus Demo Checkout
                </span>
              </div>
              <span className="font-display font-black text-lg text-[#6D4C2E] dark:text-[#D9A94D]">
                {formatINR(totals.total)}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-[#FAF6F0] dark:bg-[#140E0A] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setPaymentSubTab('upi');
                  setPaymentMethod('UPI / Card Online');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  paymentSubTab === 'upi' ? 'bg-[#6D4C2E] text-white shadow-sm' : 'text-[#7E6857]'
                }`}
              >
                UPI QR Demo
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentSubTab('mealcard');
                  setPaymentMethod('Campus Meal Card');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  paymentSubTab === 'mealcard' ? 'bg-[#6D4C2E] text-white shadow-sm' : 'text-[#7E6857]'
                }`}
              >
                Meal Card
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentSubTab('card');
                  setPaymentMethod('UPI / Card Online');
                }}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  paymentSubTab === 'card' ? 'bg-[#6D4C2E] text-white shadow-sm' : 'text-[#7E6857]'
                }`}
              >
                Card
              </button>
            </div>

            {paymentSubTab === 'upi' && (
              <div className="space-y-3 py-2">
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl border-2 border-[#D9A94D] shadow-sm flex flex-col items-center justify-center">
                  <QrCode className="w-28 h-28 text-[#2D1F14]" />
                </div>
                <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                  Simulated UPI handle: <strong>campusbite@upi</strong>
                </p>
              </div>
            )}

            {paymentSubTab === 'mealcard' && (
              <div className="space-y-3 py-2 text-left bg-gradient-to-br from-[#6D4C2E] to-[#3D291C] text-white p-4 rounded-2xl shadow-warm-md">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold tracking-wider text-[#D9A94D]">CAMPUS MEAL PASS</span>
                  <Wallet className="w-4 h-4 text-[#D9A94D]" />
                </div>
                <p className="font-mono text-sm font-bold tracking-widest pt-2">
                  **** **** 2026 1018
                </p>
                <div className="flex justify-between items-end text-xs pt-1">
                  <div>
                    <span className="text-[9px] uppercase text-[#E6CFBC] block">Cardholder</span>
                    <span className="font-bold">{customerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase text-[#E6CFBC] block">Balance</span>
                    <span className="font-bold text-[#D9A94D]">{formatINR(profile.mealCardBalance)}</span>
                  </div>
                </div>
              </div>
            )}

            {paymentSubTab === 'card' && (
              <div className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-bold block mb-1">Demo Card Number</label>
                  <input
                    type="text"
                    readOnly
                    value="4532 •••• •••• 9821"
                    className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC] text-xs font-mono bg-[#FAF6F0] dark:bg-[#140E0A]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold block mb-1">Expiry</label>
                    <input
                      type="text"
                      readOnly
                      value="10/28"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC] text-xs font-mono bg-[#FAF6F0] dark:bg-[#140E0A]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold block mb-1">CVV</label>
                    <input
                      type="password"
                      readOnly
                      value="•••"
                      className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC] text-xs font-mono bg-[#FAF6F0] dark:bg-[#140E0A]"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isVerifyingPayment}
              onClick={executeDigitalPayment}
              className="w-full py-3.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] font-bold text-xs flex items-center justify-center gap-2 shadow-warm-md"
            >
              {isVerifyingPayment ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Demo Transaction...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-[#D9A94D]" />
                  Simulate Successful Payment ({formatINR(totals.total)})
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isVerifyingPayment}
              onClick={() => setCheckoutModalOpen(false)}
              className="w-full py-1 text-xs text-[#7E6857] hover:underline"
            >
              Cancel & Modify Order
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   ORDER CONFIRMATION PAGE
   ========================================================================== */

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-xl font-bold">Order reference not found</h2>
        <Link to="/orders" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold">
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-warm-md"
      >
        <div className="w-16 h-16 rounded-3xl bg-[#F2E3D5] text-[#6D4C2E] flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9 text-[#A66E2E]" />
        </div>
        <div>
          <span className="px-3.5 py-1 rounded-full bg-[#F2E3D5] dark:bg-[#281D15] text-[#6D4C2E] dark:text-[#D9A94D] text-xs font-extrabold border border-[#D9A94D]/30">
            ORDER CONFIRMED & KITCHEN NOTIFIED
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-black mt-3 text-[#2B1D12] dark:text-white">
            Ticket #{order.id}
          </h1>
          <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] mt-1.5">
            Placed at <strong>{formatTime(order.createdAt)}</strong> • <strong>{order.canteenName}</strong>
          </p>
        </div>

        {/* Digital Pickup Pass Details */}
        <div className="bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC]/80 dark:border-[#3D2D1F] rounded-2xl p-5 text-left space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-[#7E6857] dark:text-[#B8A696]">Scheduled Pickup Window:</span>
            <span className="font-bold text-[#A66E2E] dark:text-[#D9A94D]">{order.pickupSlotLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E6857] dark:text-[#B8A696]">Estimated Ready Time:</span>
            <span className="font-bold text-[#6D4C2E] dark:text-[#D9A94D]">{formatTime(order.estimatedReadyAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E6857] dark:text-[#B8A696]">Student / Member:</span>
            <span className="font-semibold text-[#2B1D12] dark:text-white">{order.customerName} ({order.studentId || 'Member'})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7E6857] dark:text-[#B8A696]">Payment Status:</span>
            <span className="font-semibold text-[#2B1D12] dark:text-white">{order.paymentMethod} — {order.paymentStatus}</span>
          </div>
          <div className="flex justify-between border-t border-[#E6CFBC] dark:border-[#3D2D1F] pt-2.5 text-sm font-display font-extrabold text-[#2B1D12] dark:text-white">
            <span>Total Paid / Due:</span>
            <span className="text-base text-[#6D4C2E] dark:text-[#D9A94D]">{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/track/${order.id}`}
            className="px-6 py-3.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold shadow-warm-sm hover:scale-102 transition-all"
          >
            Open Live Kitchen Tracker →
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3.5 rounded-2xl border border-[#E6CFBC] dark:border-[#3D2D1F] text-xs font-bold text-[#7E6857] dark:text-[#B8A696] hover:bg-[#FAF6F0]"
          >
            Explore More Dishes
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

/* ==========================================================================
   ORDER TRACKING PAGE
   ========================================================================== */

const TRACKING_STAGES: OrderStatus[] = ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrderStatus, advanceOrderStatus, cancelOrder } = useApp();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  const [confirmCancelModal, setConfirmCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of timetable');
  const [confirmCollectModal, setConfirmCollectModal] = useState(false);

  // Dynamic live relative time for placement
  const relativePlaced = useLiveRelativeTime(order?.createdAt);
  const relativeUpdated = useLiveRelativeTime(order?.updatedAt);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-xl font-bold">No active orders found</h2>
        <Link to="/menu" className="inline-block mt-4 px-6 py-3 rounded-2xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold">
          Place Your First Order
        </Link>
      </div>
    );
  }

  const normalizedStatus = order.status === 'Collected' ? 'Completed' : order.status;
  const currentIdx = TRACKING_STAGES.indexOf(normalizedStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            Live Campus Dining Tracker
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
            Order #{order.id}
          </h1>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-0.5">
            Placed {relativePlaced} ({formatTime(order.createdAt)}) • {order.canteenName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-black shadow-sm ${
              order.status === 'Cancelled'
                ? 'bg-rose-100 text-rose-800'
                : order.status === 'Ready for Pickup'
                ? 'bg-[#D9A94D] text-[#2D1F14] animate-bounce'
                : order.status === 'Preparing'
                ? 'bg-[#F2E3D5] text-[#6D4C2E] dark:bg-[#281D15] dark:text-[#D9A94D] ring-2 ring-[#D9A94D]/30'
                : order.status === 'Completed' || order.status === 'Collected'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-[#FAF7F2] text-[#7E6857] border border-[#6D4C2E]/20'
            }`}
          >
            ● {order.status}
          </span>
        </div>
      </div>

      {/* Special Ready Celebration Banner */}
      {order.status === 'Ready for Pickup' && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-[#D9A94D]/20 via-[#F2E3D5] to-[#D9A94D]/20 border-2 border-[#D9A94D] rounded-3xl p-6 text-center space-y-2 shadow-warm-md"
        >
          <div className="inline-flex p-3 rounded-full bg-[#D9A94D] text-[#2D1F14] mb-1">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h2 className="font-display font-black text-xl text-[#2B1D12]">
            Your Food is Ready for Pickup!
          </h2>
          <p className="text-xs text-[#6D4C2E] max-w-md mx-auto">
            Please walk up to <strong>{order.canteenName}</strong> express collection window and show your ticket token.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setConfirmCollectModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#6D4C2E] text-white text-xs font-bold hover:bg-[#A66E2E] shadow-sm transition-all"
            >
              ✓ Confirm I Have Collected My Meal
            </button>
          </div>
        </motion.div>
      )}

      {/* Visual Status Stepper */}
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 sm:p-8 shadow-warm-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-extrabold text-sm sm:text-base text-[#2B1D12] dark:text-white">
              Kitchen Preparation Pipeline
            </h2>
            <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696] mt-0.5">
              Est. Ready: <strong>{formatTime(order.estimatedReadyAt)}</strong> (Lead time ~{order.prepDurationMins}m)
            </p>
          </div>
          {order.status === 'Placed' && (
            <button
              onClick={() => setConfirmCancelModal(true)}
              className="px-3 py-1 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              Cancel Ticket
            </button>
          )}
        </div>

        {order.status === 'Cancelled' ? (
          <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 text-rose-700 dark:text-rose-200 text-xs font-bold space-y-1">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              <span>This order was cancelled on {formatDateTime(order.cancelledAt || order.updatedAt)}.</span>
            </div>
            {order.cancellationReason && (
              <p className="text-[11px] font-normal text-rose-600 dark:text-rose-300">
                Reason: {order.cancellationReason}
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {TRACKING_STAGES.map((st, idx) => {
              const isCompleted = currentIdx >= 0 && idx < currentIdx;
              const isCurrent = currentIdx >= 0 && idx === currentIdx;
              return (
                <div
                  key={st}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'border-[#A66E2E] bg-[#F2E3D5] dark:bg-[#281D15] ring-2 ring-[#D9A94D]/40'
                      : isCompleted
                      ? 'border-[#E6CFBC] dark:border-[#3D2D1F] bg-[#FAF6F0]/60 dark:bg-[#140E0A]'
                      : 'border-[#E6CFBC]/50 dark:border-gray-800 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#7E6857] dark:text-[#B8A696]">Stage {idx + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {isCurrent && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A94D] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#6D4C2E]" />
                      </span>
                    )}
                  </div>
                  <p className="font-display font-extrabold text-sm text-[#2B1D12] dark:text-white">{st}</p>
                  <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] block mt-1">
                    {idx === 0 && 'Ticket Queued'}
                    {idx === 1 && 'Chef Assigned'}
                    {idx === 2 && 'On The Griddle'}
                    {idx === 3 && 'Pass Counter'}
                    {idx === 4 && 'Pickup Done'}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Cooking Pulse Animation */}
        {order.status === 'Preparing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6D4C2E] text-[#D9A94D] flex items-center justify-center animate-pulse">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#2B1D12] dark:text-white">
                  Fresh Preparation in Progress
                </p>
                <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  Started at {formatTime(order.prepStartedAt || order.updatedAt)} • Est. completion in ~{Math.max(1, order.prepDurationMins - 5)} mins
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-[#A66E2E] dark:text-[#D9A94D] px-2 py-1 bg-white dark:bg-black/40 rounded-lg">
              Station Live
            </span>
          </motion.div>
        )}
      </div>

      {/* Timestamped Status History Log */}
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 sm:p-8 space-y-4 shadow-warm-sm">
        <h3 className="font-display font-extrabold text-sm text-[#2B1D12] dark:text-white">
          Verified Activity Timeline
        </h3>
        <div className="space-y-3">
          {(order.statusHistory || []).map((entry, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#A66E2E] mt-1.5 shrink-0" />
              <div className="flex-1 pb-3 border-b border-[#E6CFBC]/40 dark:border-[#3D2D1F] last:border-none">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#2B1D12] dark:text-white">
                    {entry.status}
                  </span>
                  <span className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                    {formatTime(entry.timestamp)} ({getRelativeTimeString(entry.timestamp)})
                  </span>
                </div>
                {entry.note && (
                  <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696] mt-0.5">
                    {entry.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket & Pickup Details */}
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 sm:p-8 space-y-5 shadow-warm-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-4 border-b border-[#E6CFBC]/60 dark:border-[#3D2D1F]">
          <div>
            <span className="text-[#7E6857] dark:text-[#B8A696] block font-semibold">Scheduled Pickup Slot</span>
            <strong className="text-sm font-display text-[#A66E2E] dark:text-[#D9A94D] mt-0.5 block">{order.pickupSlotLabel}</strong>
          </div>
          <div>
            <span className="text-[#7E6857] dark:text-[#B8A696] block font-semibold">Payment Status</span>
            <strong className="text-sm font-display text-[#2B1D12] dark:text-white mt-0.5 block">{order.paymentMethod} ({order.paymentStatus})</strong>
          </div>
          <div>
            <span className="text-[#7E6857] dark:text-[#B8A696] block font-semibold">Student / Member</span>
            <strong className="text-sm font-display text-[#2B1D12] dark:text-white mt-0.5 block">{order.customerName} ({order.studentId || 'Member'})</strong>
          </div>
        </div>

        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696]">Ordered Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1.5 border-b border-[#FAF6F0] dark:border-[#281D15]">
              <span className="text-[#2B1D12] dark:text-white">
                <strong>{item.quantity}x</strong> {item.name}
                {item.addOns.length > 0 && (
                  <span className="text-xs text-[#A66E2E] dark:text-[#D9A94D] block sm:inline sm:ml-2">
                    +{item.addOns.map((a) => a.name).join(', ')}
                  </span>
                )}
              </span>
              <span className="font-extrabold text-[#2B1D12] dark:text-white">
                {formatINR((item.price + item.addOns.reduce((a, b) => a + b.price, 0)) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 flex justify-between text-base font-display font-black text-[#2B1D12] dark:text-white">
          <span>Total Billed</span>
          <span className="text-xl text-[#6D4C2E] dark:text-[#D9A94D]">{formatINR(order.total)}</span>
        </div>
      </div>

      {/* Simulator Panel (Allows testing full lifecycle directly) */}
      <div className="bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 text-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-[#A66E2E]" />
            <span className="font-bold text-[#2B1D12] dark:text-white">
              Canteen Dispatch Simulator (Demo Controls)
            </span>
          </div>
          <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696]">
            Browser-local workflow
          </span>
        </div>
        <p className="text-[#7E6857] dark:text-[#B8A696]">
          Since this is a client-side frontend demo, you can advance this order's status through its real lifecycle directly or from the Canteen KDS tab:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          {order.status !== 'Completed' && order.status !== 'Collected' && order.status !== 'Cancelled' && (
            <button
              onClick={() => advanceOrderStatus(order.id)}
              className="px-3 py-1.5 rounded-xl bg-[#6D4C2E] text-white font-bold hover:bg-[#A66E2E] transition-colors"
            >
              Advance to Next Stage →
            </button>
          )}
          {order.status === 'Placed' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Accepted')}
              className="px-3 py-1.5 rounded-xl border border-[#E6CFBC] bg-white dark:bg-[#1E1510] text-[#2B1D12] dark:text-white font-semibold"
            >
              Simulate: Kitchen Accept
            </button>
          )}
          {order.status === 'Accepted' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Preparing')}
              className="px-3 py-1.5 rounded-xl border border-[#E6CFBC] bg-white dark:bg-[#1E1510] text-[#2B1D12] dark:text-white font-semibold"
            >
              Simulate: Start Cooking
            </button>
          )}
          {order.status === 'Preparing' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Ready for Pickup')}
              className="px-3 py-1.5 rounded-xl border border-[#D9A94D] bg-[#D9A94D] text-[#2D1F14] font-bold"
            >
              Simulate: Ready at Counter
            </button>
          )}
          {order.status === 'Ready for Pickup' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Completed')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold"
            >
              Simulate: Student Collected
            </button>
          )}
          <Link
            to="/canteen-dashboard"
            className="px-3 py-1.5 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] text-[#7E6857] hover:bg-white"
          >
            Open Operator KDS View
          </Link>
        </div>
      </div>

      {/* Confirm Collect Modal */}
      {confirmCollectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">
              Confirm Meal Collection
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
              Have you picked up your meal from {order.canteenName}? This will close out the active pass.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(order.id, 'Completed', 'Student confirmed meal collection in mobile pass');
                  setConfirmCollectModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Yes, Collected
              </button>
              <button
                onClick={() => setConfirmCollectModal(false)}
                className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-semibold"
              >
                Not Yet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Cancel Modal */}
      {confirmCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-display font-bold text-base text-rose-700 dark:text-rose-400">
              Cancel Order #{order.id}?
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
              Your reserved kitchen preparation slot will be released back to other students.
            </p>
            <div className="text-left">
              <label className="text-[11px] font-bold block mb-1">Reason for cancellation:</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
              >
                <option value="Class timetable rescheduled">Class timetable rescheduled</option>
                <option value="Accidental order">Accidental order</option>
                <option value="Want to change break window">Want to change break window</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  cancelOrder(order.id, cancelReason);
                  setConfirmCancelModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Yes, Cancel Order
              </button>
              <button
                onClick={() => setConfirmCancelModal(false)}
                className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-semibold"
              >
                Keep Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   ORDER HISTORY PAGE
   ========================================================================== */

export const OrderHistoryPage: React.FC = () => {
  const { orders, reorderPastOrder } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          Your Activity Log
        </span>
        <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
          Campus Dining Order History
        </h1>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1">
          Review previous dining tickets or reorder your favourites in a single tap.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <motion.div
            key={o.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-warm-sm hover:shadow-warm-md transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
                  #{o.id}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    o.status === 'Cancelled'
                      ? 'bg-rose-100 text-rose-800'
                      : o.status === 'Ready for Pickup'
                      ? 'bg-[#D9A94D] text-[#2D1F14] animate-bounce'
                      : o.status === 'Preparing'
                      ? 'bg-[#F2E3D5] text-[#6D4C2E] dark:bg-[#281D15] dark:text-[#D9A94D]'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {o.status}
                </span>
                <span className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                  {formatDate(o.createdAt)} • {formatTime(o.createdAt)}
                </span>
              </div>
              <p className="text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D]">
                {o.canteenName} • Window: {o.pickupSlotLabel}
              </p>
              <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display font-black text-lg text-[#2B1D12] dark:text-white mr-2">
                {formatINR(o.total)}
              </span>
              <Link
                to={`/track/${o.id}`}
                className="px-4 py-2 rounded-xl border border-[#E6CFBC] dark:border-[#3D2D1F] text-xs font-bold text-[#2B1D12] dark:text-white hover:bg-[#FAF6F0] transition-colors"
              >
                Track Pass
              </Link>
              <button
                onClick={() => {
                  reorderPastOrder(o);
                  navigate('/cart');
                }}
                className="px-4 py-2 rounded-xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#D9A94D]" /> Reorder
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};