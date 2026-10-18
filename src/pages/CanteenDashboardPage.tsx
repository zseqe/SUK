import React, { useState } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  MonitorPlay,
  Utensils,
  CalendarClock,
  BarChart3,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Eye,
  AlertTriangle,
  Flame,
  Check,
  QrCode,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, Order, OrderStatus, CategoryId } from '../types';
import { CATEGORIES } from '../data/seed';
import { formatINR } from '../utils/price';
import {
  formatTime,
  formatDate,
  formatDateTime,
  getRelativeTimeString,
  useCurrentClock
} from '../utils/time';

export const CanteenDashboardPage: React.FC = () => {
  const {
    orders,
    foods,
    slots,
    updateOrderStatus,
    toggleFoodAvailability,
    upsertFoodItem,
    deleteFoodItem,
    upsertSlot,
    notify
  } = useApp();

  const [tab, setTab] = useState<'overview' | 'orders' | 'kds' | 'menu' | 'slots' | 'reports'>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'slot'>('newest');

  // Scanner Modal State
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedInput, setScannedInput] = useState('');
  const [scannedMatchedOrder, setScannedMatchedOrder] = useState<Order | null>(null);

  // Inspection Modal State
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);

  // Cancellation Modal State
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Out of stock ingredient');

  // Menu Modal State
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // New Slot State
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotCap, setNewSlotCap] = useState(35);

  const currentTime = useCurrentClock(10000);
  const nowMs = currentTime.getTime();

  // Metrics
  const activeOrders = orders.filter((o) => o.status !== 'Completed' && o.status !== 'Collected' && o.status !== 'Cancelled');
  const readyOrders = orders.filter((o) => o.status === 'Ready for Pickup');
  const completedOrders = orders.filter((o) => o.status === 'Completed' || o.status === 'Collected');
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  // Overdue calculation
  const isOrderOverdue = (o: Order) => {
    if (o.status === 'Completed' || o.status === 'Collected' || o.status === 'Cancelled' || o.status === 'Ready for Pickup') {
      return false;
    }
    const placedMs = new Date(o.createdAt).getTime();
    const elapsedMins = (nowMs - placedMs) / (1000 * 60);
    return elapsedMins > (o.prepDurationMins || 10);
  };

  const overdueCount = activeOrders.filter(isOrderOverdue).length;

  // Average prep time calculation for completed orders
  const averagePrepMins = completedOrders.length > 0
    ? Math.round(
        completedOrders.reduce((acc, o) => {
          if (o.completedAt && o.createdAt) {
            const diff = (new Date(o.completedAt).getTime() - new Date(o.createdAt).getTime()) / (1000 * 60);
            return acc + (diff > 0 ? diff : o.prepDurationMins || 10);
          }
          return acc + (o.prepDurationMins || 10);
        }, 0) / completedOrders.length
      )
    : 12;

  // Filtered & sorted orders
  const filteredOrders = orders
    .filter((o) => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'Completed' && (o.status === 'Completed' || o.status === 'Collected')) return true;
        if (o.status !== statusFilter) return false;
      }
      if (orderSearch.trim()) {
        const query = orderSearch.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(query);
        const matchesCustomer = o.customerName.toLowerCase().includes(query);
        const matchesItem = o.items.some((i) => i.name.toLowerCase().includes(query));
        if (!matchesId && !matchesCustomer && !matchesItem) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'slot') {
        return a.pickupSlotLabel.localeCompare(b.pickupSlotLabel);
      }
      return 0;
    });

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;
    upsertFoodItem(editingFood);
    setEditingFood(null);
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotLabel.trim() || !newSlotTime.trim()) return;
    upsertSlot({
      id: `slot-${Date.now()}`,
      label: newSlotLabel,
      timeRange: newSlotTime,
      capacity: newSlotCap,
      enabled: true
    });
    setNewSlotLabel('');
    setNewSlotTime('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Console Notice */}
      <div className="bg-[#F2E3D5] dark:bg-[#281D15] border border-[#D9A94D]/50 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-[#6D4C2E] dark:text-[#D9A94D]">
            Kitchen Display System (KDS) & Operational Dispatch:
          </span>
          <span className="text-[#7E6857] dark:text-[#E6CFBC] hidden sm:inline">
            Status changes sync instantly across student mobile passes.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScannerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] font-bold text-xs shadow-sm transition-all"
          >
            <QrCode className="w-3.5 h-3.5 text-[#D9A94D]" />
            Scan / Claim Token
          </button>
          <span className="px-2.5 py-0.5 rounded-lg bg-[#6D4C2E] text-[#F2E3D5] font-extrabold text-[10px] uppercase tracking-wider">
            Station: Quad Central
          </span>
          <span className="text-[11px] font-mono font-bold text-[#6D4C2E] dark:text-[#D9A94D]">
            {formatTime(currentTime.toISOString())}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
            { id: 'orders', label: `Kitchen Queue (${activeOrders.length})`, icon: ClipboardList },
            { id: 'kds', label: 'Kitchen Display (KDS)', icon: MonitorPlay },
            { id: 'menu', label: 'Menu & Live Stock', icon: Utensils },
            { id: 'slots', label: 'Pickup Capacity Control', icon: CalendarClock },
            { id: 'reports', label: 'Demand & Revenue Logs', icon: BarChart3 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                tab === item.id
                  ? 'bg-[#6D4C2E] text-[#F2E3D5] shadow-warm-sm'
                  : 'bg-white dark:bg-[#1E1510] hover:bg-[#F2E3D5]/50 border border-[#E6CFBC] dark:border-[#3D2D1F] text-[#7E6857] dark:text-[#B8A696]'
              }`}
            >
              <item.icon className={`w-4 h-4 ${tab === item.id ? 'text-[#D9A94D]' : ''}`} />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Panel */}
        <section className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 shadow-warm-sm">
                  <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Today's Orders</span>
                  <p className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">{orders.length}</p>
                  <span className="text-[10px] text-[#A66E2E] dark:text-[#D9A94D] font-bold mt-1 block">
                    {completedOrders.length} completed
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 shadow-warm-sm">
                  <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Active In Kitchen</span>
                  <p className="font-display text-3xl font-black text-[#A66E2E] dark:text-[#D9A94D] mt-1">{activeOrders.length}</p>
                  <span className="text-[10px] font-bold mt-1 block text-amber-600">
                    {overdueCount > 0 ? `⚠️ ${overdueCount} overdue` : 'On track'}
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 shadow-warm-sm">
                  <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Ready at Counter</span>
                  <p className="font-display text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{readyOrders.length}</p>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold mt-1 block">
                    Awaiting collection
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-5 shadow-warm-sm">
                  <span className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold">Today's Demo Sales</span>
                  <p className="font-display text-3xl font-black text-[#6D4C2E] dark:text-[#D9A94D] mt-1">{formatINR(totalRevenue)}</p>
                  <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] font-bold mt-1 block">
                    Avg prep: ~{averagePrepMins}m
                  </span>
                </div>
              </div>

              {/* Slot Utilization Overview */}
              <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
                <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white mb-4">
                  Break Pickup Slot Throttling & Kitchen Utilization
                </h3>
                <div className="space-y-4">
                  {slots.map((s) => {
                    const count = orders.filter((o) => o.pickupSlotId === s.id && o.status !== 'Cancelled').length;
                    const pct = Math.min(100, Math.round((count / s.capacity) * 100));
                    return (
                      <div key={s.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-[#2B1D12] dark:text-white">
                          <span>{s.label} ({s.timeRange})</span>
                          <span className="text-[#A66E2E] dark:text-[#D9A94D]">{count} / {s.capacity} orders ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-[#FAF6F0] dark:bg-[#140E0A] overflow-hidden border border-[#E6CFBC]/60">
                          <div
                            className={`h-full transition-all duration-300 ${
                              pct >= 90 ? 'bg-rose-500' : pct >= 60 ? 'bg-[#D9A94D]' : 'bg-[#6D4C2E]'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INCOMING ORDERS QUEUE */}
          {tab === 'orders' && (
            <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-5 shadow-warm-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
                    Kitchen Order Queue
                  </h2>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                    Process incoming tickets, update preparation status, and track elapsed cooking times.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#7E6857]" />
                    <input
                      type="text"
                      placeholder="Search ID / student..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] text-xs text-[#2B1D12] dark:text-white outline-none"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs font-semibold rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] p-1.5 text-[#2B1D12] dark:text-white outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-semibold rounded-xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC] dark:border-[#3D2D1F] p-1.5 text-[#2B1D12] dark:text-white outline-none"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="slot">By Slot</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 text-xs text-[#7E6857] dark:text-[#B8A696]">
                    No orders matching selected criteria.
                  </div>
                ) : (
                  filteredOrders.map((o) => {
                    const overdue = isOrderOverdue(o);
                    const elapsedMins = Math.round((nowMs - new Date(o.createdAt).getTime()) / 60000);
                    return (
                      <div
                        key={o.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          overdue
                            ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/20'
                            : 'border-[#E6CFBC] dark:border-[#3D2D1F] bg-[#FAF6F0]/50 dark:bg-[#140E0A]'
                        }`}
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-display font-black text-sm text-[#2B1D12] dark:text-white">
                              #{o.id}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                o.status === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : o.status === 'Ready for Pickup'
                                  ? 'bg-[#D9A94D] text-[#2D1F14]'
                                  : o.status === 'Preparing'
                                  ? 'bg-[#F2E3D5] text-[#6D4C2E] dark:bg-[#281D15] dark:text-[#D9A94D]'
                                  : o.status === 'Completed' || o.status === 'Collected'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {o.status}
                            </span>
                            <span className="text-xs font-semibold text-[#A66E2E]">
                              Slot: {o.pickupSlotLabel}
                            </span>
                            <span className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                              Placed {formatTime(o.createdAt)} ({getRelativeTimeString(o.createdAt, nowMs)})
                            </span>
                            {overdue && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Overdue ({elapsedMins}m in queue)
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                            Customer: <strong>{o.customerName}</strong> ({o.studentId || 'Member'}) • {o.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </p>
                          {o.notes && (
                            <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md inline-block">
                              Chef Note: {o.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setInspectedOrder(o)}
                            className="p-2 rounded-xl border border-[#E6CFBC] text-[#7E6857] hover:text-[#2B1D12] hover:bg-white"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {o.status === 'Placed' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Accepted')}
                              className="px-3.5 py-1.5 rounded-xl bg-[#6D4C2E] text-white text-xs font-bold hover:bg-[#A66E2E] transition-colors"
                            >
                              Accept Ticket
                            </button>
                          )}
                          {o.status === 'Accepted' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Preparing')}
                              className="px-3.5 py-1.5 rounded-xl bg-[#A66E2E] text-white text-xs font-bold hover:bg-[#6D4C2E] transition-colors"
                            >
                              Start Cooking
                            </button>
                          )}
                          {o.status === 'Preparing' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Ready for Pickup')}
                              className="px-3.5 py-1.5 rounded-xl bg-[#D9A94D] text-[#2D1F14] text-xs font-black shadow-sm"
                            >
                              Mark Ready
                            </button>
                          )}
                          {o.status === 'Ready for Pickup' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'Completed')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold"
                            >
                              Mark Collected
                            </button>
                          )}
                          {o.status !== 'Cancelled' && o.status !== 'Completed' && o.status !== 'Collected' && (
                            <button
                              onClick={() => setCancellingOrderId(o.id)}
                              className="px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                            >
                              Void
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KITCHEN DISPLAY SYSTEM (KDS) */}
          {tab === 'kds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
                    Kitchen Display Terminal (KDS)
                  </h2>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                    High-contrast dispatch cards for grill, fryer, and assembly stations.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold">
                  {activeOrders.length} Active Orders
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map((o) => {
                  const elapsedMins = Math.round((nowMs - new Date(o.createdAt).getTime()) / 60000);
                  const isOverdue = isOrderOverdue(o);
                  return (
                    <div
                      key={o.id}
                      className={`rounded-3xl p-5 border flex flex-col justify-between shadow-warm-sm transition-all ${
                        isOverdue
                          ? 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/30'
                          : o.status === 'Preparing'
                          ? 'border-[#D9A94D] bg-[#F2E3D5]/70 dark:bg-[#281D15]'
                          : 'border-[#E6CFBC] dark:border-[#3D2D1F] bg-white dark:bg-[#1E1510]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between border-b border-[#E6CFBC]/60 dark:border-[#3D2D1F] pb-3 mb-3">
                          <span className="font-display font-black text-xl text-[#2B1D12] dark:text-white">
                            #{o.id}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              o.status === 'Preparing'
                                ? 'bg-[#6D4C2E] text-white'
                                : 'bg-[#D9A94D] text-[#2D1F14]'
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-xs mb-2">
                          <span className="font-extrabold text-[#A66E2E] dark:text-[#D9A94D]">
                            Window: {o.pickupSlotLabel?.split('(')[0]}
                          </span>
                          <span
                            className={`font-mono font-bold ${
                              isOverdue ? 'text-rose-600' : 'text-[#7E6857]'
                            }`}
                          >
                            ⏱ {elapsedMins}m elapsed (est ~{o.prepDurationMins}m)
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {o.items.map((it, idx) => (
                            <div key={idx} className="text-sm font-bold text-[#2B1D12] dark:text-white">
                              {it.quantity}x {it.name}
                              {it.addOns.length > 0 && (
                                <span className="text-xs block text-[#7E6857] dark:text-[#B8A696] font-normal">
                                  + {it.addOns.map((a) => a.name).join(', ')}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {o.notes && (
                          <div className="p-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold mb-3">
                            Special request: {o.notes}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F] flex items-center gap-2">
                        {o.status === 'Placed' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'Accepted')}
                            className="w-full py-2.5 rounded-xl bg-[#6D4C2E] text-white text-xs font-bold"
                          >
                            Accept Ticket
                          </button>
                        )}
                        {o.status === 'Accepted' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'Preparing')}
                            className="w-full py-2.5 rounded-xl bg-[#A66E2E] text-white text-xs font-bold"
                          >
                            Start Cooking
                          </button>
                        )}
                        {o.status === 'Preparing' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'Ready for Pickup')}
                            className="w-full py-2.5 rounded-xl bg-[#D9A94D] text-[#2D1F14] text-xs font-black shadow-sm"
                          >
                            Mark Ready at Pass
                          </button>
                        )}
                        {o.status === 'Ready for Pickup' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'Completed')}
                            className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                          >
                            Handed to Student (Done)
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: MENU & LIVE STOCK */}
          {tab === 'menu' && (
            <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-6 shadow-warm-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
                    Menu Catalog & Live Stock
                  </h2>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                    Toggle instant availability when dishes sell out during peak break intervals.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {foods.map((food) => (
                  <div
                    key={food.id}
                    className="p-4 rounded-2xl border border-[#E6CFBC] dark:border-[#3D2D1F] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">{food.name}</h4>
                        <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                          {formatINR(food.price)} • {food.category} • Prep: ~{food.prepTimeMins}m
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFoodAvailability(food.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          food.available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {food.available ? 'Available' : 'Sold Out'}
                      </button>
                      <button
                        onClick={() => setEditingFood(food)}
                        className="p-1.5 rounded-xl border border-[#E6CFBC] text-[#7E6857] hover:text-[#2B1D12]"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PICKUP SLOT CAPACITY */}
          {tab === 'slots' && (
            <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-6 shadow-warm-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
                    Pickup Window Throttling
                  </h2>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
                    Set capacity caps per 15-minute slot to prevent kitchen overload.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slots.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl border border-[#E6CFBC] dark:border-[#3D2D1F] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#2B1D12] dark:text-white">{s.label}</span>
                      <span className="px-2 py-0.5 rounded bg-[#F2E3D5] text-[#6D4C2E] font-extrabold">Cap: {s.capacity}</span>
                    </div>
                    <p className="text-xs text-[#A66E2E] font-semibold">{s.timeRange}</p>
                    <button
                      onClick={() => upsertSlot({ ...s, enabled: !s.enabled })}
                      className={`px-3 py-1 rounded-xl text-xs font-bold ${
                        s.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {s.enabled ? 'Enabled' : 'Disabled for Break'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Slot */}
              <form onSubmit={handleAddSlot} className="pt-4 border-t border-[#E6CFBC] dark:border-[#3D2D1F] space-y-3">
                <h3 className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">Add Break Pickup Window</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Slot Name (e.g. Afternoon Tea Slot)"
                    value={newSlotLabel}
                    onChange={(e) => setNewSlotLabel(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Time Range (e.g. 03:30 PM – 03:45 PM)"
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
                  />
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={newSlotCap}
                    onChange={(e) => setNewSlotCap(Number(e.target.value))}
                    className="px-3.5 py-2 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold hover:bg-[#A66E2E]"
                >
                  Create Pickup Slot
                </button>
              </form>
            </div>
          )}

          {/* TAB 6: REPORTS & DEMAND */}
          {tab === 'reports' && (
            <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 space-y-6 shadow-warm-sm">
              <div>
                <h2 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">Sales & Demand Analytics</h2>
                <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">Real-time item velocity and break period distribution.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC]">
                  <span className="text-xs text-[#7E6857]">Total Tickets Processed</span>
                  <p className="font-display text-2xl font-black text-[#2B1D12] dark:text-white mt-1">{orders.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC]">
                  <span className="text-xs text-[#7E6857]">Average Order Value</span>
                  <p className="font-display text-2xl font-black text-[#6D4C2E] dark:text-[#D9A94D] mt-1">
                    {orders.length ? formatINR(Math.round(totalRevenue / orders.length)) : formatINR(0)}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF6F0] dark:bg-[#140E0A] border border-[#E6CFBC]">
                  <span className="text-xs text-[#7E6857]">Average Preparation Time</span>
                  <p className="font-display text-2xl font-black text-[#A66E2E] mt-1">~{averagePrepMins} mins</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Inspect Order Modal */}
      {inspectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-[#E6CFBC]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#A66E2E] dark:text-[#D9A94D]">
                  Kitchen Ticket Details
                </span>
                <h3 className="font-display font-black text-xl text-[#2B1D12] dark:text-white">
                  #{inspectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setInspectedOrder(null)}
                className="p-1 rounded-xl text-[#7E6857] hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Customer:</span>
                <span className="font-bold text-[#2B1D12] dark:text-white">
                  {inspectedOrder.customerName} ({inspectedOrder.studentId || 'Member'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Contact:</span>
                <span className="font-semibold text-[#2B1D12] dark:text-white">{inspectedOrder.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Pickup Window:</span>
                <span className="font-bold text-[#A66E2E] dark:text-[#D9A94D]">{inspectedOrder.pickupSlotLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Payment:</span>
                <span className="font-semibold">{inspectedOrder.paymentMethod} — {inspectedOrder.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Placed At:</span>
                <span className="font-semibold">{formatDateTime(inspectedOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7E6857]">Est. Ready:</span>
                <span className="font-bold">{formatTime(inspectedOrder.estimatedReadyAt)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E6CFBC]">
              <h4 className="font-bold text-xs mb-2">Ordered Items</h4>
              <div className="space-y-1.5 text-xs">
                {inspectedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.name}</span>
                    <span className="font-bold">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-between font-black text-sm">
                <span>Total Amount:</span>
                <span className="text-[#6D4C2E] dark:text-[#D9A94D]">{formatINR(inspectedOrder.total)}</span>
              </div>
            </div>

            {/* Status History */}
            <div className="pt-2 border-t border-[#E6CFBC]">
              <h4 className="font-bold text-xs mb-2">Verified Status History</h4>
              <div className="space-y-2 text-[11px]">
                {(inspectedOrder.statusHistory || []).map((h, i) => (
                  <div key={i} className="flex justify-between text-[#7E6857]">
                    <span>● {h.status}: {h.note || ''}</span>
                    <span className="font-mono">{formatTime(h.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E6CFBC] flex justify-end gap-2">
              <button
                onClick={() => setInspectedOrder(null)}
                className="px-4 py-2 rounded-xl border border-[#E6CFBC] text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-sm w-full p-6 text-center space-y-4">
            <h3 className="font-display font-bold text-base text-rose-700">
              Void Ticket #{cancellingOrderId}?
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
              Please record the cancellation reason for auditing:
            </p>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E6CFBC] text-xs bg-[#FAF6F0] dark:bg-[#140E0A]"
            >
              <option value="Item ingredients out of stock">Item ingredients out of stock</option>
              <option value="Kitchen equipment issue">Kitchen equipment issue</option>
              <option value="Student requested cancellation">Student requested cancellation</option>
              <option value="Duplicate order placed">Duplicate order placed</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateOrderStatus(cancellingOrderId, 'Cancelled', undefined, cancelReason);
                  setCancellingOrderId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
              >
                Confirm Void
              </button>
              <button
                onClick={() => setCancellingOrderId(null)}
                className="flex-1 py-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-xs font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Food Modal */}
      {editingFood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-lg text-[#2B1D12] dark:text-white">Edit Dish Details</h3>
            <form onSubmit={handleSaveFood} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingFood.name}
                  onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingFood.price}
                    onChange={(e) => setEditingFood({ ...editingFood, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC]"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Prep Time (mins)</label>
                  <input
                    type="number"
                    value={editingFood.prepTimeMins}
                    onChange={(e) => setEditingFood({ ...editingFood, prepTimeMins: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6CFBC]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFood(null)}
                  className="px-4 py-2 rounded-xl border border-[#E6CFBC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6D4C2E] text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Canteen Express QR Scanner & Claim Modal */}
      {scannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border-2 border-[#D9A94D] rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative">
            <button
              onClick={() => {
                setScannerOpen(false);
                setScannedMatchedOrder(null);
                setScannedInput('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 text-base font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6D4C2E] text-[#D9A94D] flex items-center justify-center shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
                  Counter Express Scanner & Food Claim
                </h3>
                <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                  Scan student's mobile QR code or type token ID to verify and hand over meals.
                </p>
              </div>
            </div>

            {/* Simulated Laser Scanner Viewfinder */}
            <div className="relative rounded-2xl bg-black/90 p-5 text-center overflow-hidden border border-[#D9A94D]/40">
              <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-bounce pointer-events-none" />
              <div className="w-20 h-20 mx-auto border-2 border-dashed border-[#D9A94D]/60 rounded-xl flex items-center justify-center mb-2">
                <QrCode className="w-10 h-10 text-[#D9A94D]/80 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#D9A94D]">
                SUK Optical Token Scanner Ready
              </span>
            </div>

            {/* Token Input / Search */}
            <div>
              <label className="text-xs font-bold block mb-1 text-[#2B1D12] dark:text-white">
                Enter or Paste Token ID (e.g. SUK-20261018-0042 or 0042)
              </label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={scannedInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setScannedInput(val);
                    const matched = orders.find((o) =>
                      o.id.toLowerCase().includes(val.toLowerCase().trim()) ||
                      val.includes(o.id)
                    );
                    setScannedMatchedOrder(val.trim() ? matched || null : null);
                  }}
                  placeholder="Scan or type token..."
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white outline-none focus:border-[#6D4C2E]"
                />
              </div>
            </div>

            {/* Quick Pick: Ready for Pickup Orders */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E6857] dark:text-[#B8A696] block mb-1.5">
                Ready for Handover ({readyOrders.length})
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {readyOrders.length === 0 ? (
                  <span className="text-[11px] text-gray-400 italic">No orders currently waiting at counter</span>
                ) : (
                  readyOrders.map((ro) => (
                    <button
                      key={ro.id}
                      type="button"
                      onClick={() => {
                        setScannedInput(ro.id);
                        setScannedMatchedOrder(ro);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border transition-colors ${
                        scannedMatchedOrder?.id === ro.id
                          ? 'bg-[#6D4C2E] text-white border-[#6D4C2E]'
                          : 'bg-[#FAF6F0] dark:bg-[#201711] border-[#E6CFBC] text-[#2B1D12] dark:text-white hover:border-[#D9A94D]'
                      }`}
                    >
                      #{ro.id.slice(-4)} • {ro.customerName}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Matched Order Details Card */}
            {scannedMatchedOrder && (
              <div className="p-4 rounded-2xl bg-[#F2E3D5] dark:bg-[#281D15] border border-[#D9A94D] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-display font-extrabold text-sm text-[#2B1D12] dark:text-white">
                      Token #{scannedMatchedOrder.id}
                    </span>
                    <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696]">
                      {scannedMatchedOrder.customerName} ({scannedMatchedOrder.studentId || 'Member'})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white dark:bg-black/40 text-[10px] font-black text-[#6D4C2E] dark:text-[#D9A94D]">
                    {scannedMatchedOrder.status}
                  </span>
                </div>

                <div className="text-[11px] border-t border-[#6D4C2E]/10 dark:border-[#D9A94D]/20 pt-2 text-[#2B1D12] dark:text-white">
                  <strong>Dishes to handover:</strong>{' '}
                  {scannedMatchedOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </div>

                <div className="flex justify-between items-center text-xs font-bold pt-1">
                  <span className="text-[#7E6857] dark:text-[#B8A696]">
                    Slot: {scannedMatchedOrder.pickupSlotLabel}
                  </span>
                  <span className="text-[#6D4C2E] dark:text-[#D9A94D]">
                    {formatINR(scannedMatchedOrder.total)} ({scannedMatchedOrder.paymentStatus})
                  </span>
                </div>

                <div className="pt-2">
                  {scannedMatchedOrder.status === 'Completed' || scannedMatchedOrder.status === 'Collected' ? (
                    <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> This order has already been claimed & collected.
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        updateOrderStatus(
                          scannedMatchedOrder.id,
                          'Completed',
                          'Verified via Counter QR Scanner & food handed over'
                        );
                        notify(`Verified Token #${scannedMatchedOrder.id}! Food handed over to ${scannedMatchedOrder.customerName}.`, 'success');
                        setScannerOpen(false);
                        setScannedMatchedOrder(null);
                        setScannedInput('');
                      }}
                      className="w-full py-2.5 rounded-xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4 text-[#D9A94D]" />
                      ✓ Verify QR & Hand Over Food to Student
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setScannerOpen(false);
                  setScannedMatchedOrder(null);
                  setScannedInput('');
                }}
                className="px-4 py-2 rounded-xl border border-[#E6CFBC] text-xs font-semibold text-[#7E6857]"
              >
                Close Scanner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};