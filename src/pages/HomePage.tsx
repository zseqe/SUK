import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
  Store,
  Smartphone,
  ShieldCheck,
  ChefHat,
  Flame,
  BellRing,
  CalendarClock,
  TrendingUp,
  Award,
  Zap,
  RotateCcw,
  Receipt
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { FoodCard } from '../components/FoodCard';
import { formatINR } from '../utils/price';
import { formatTime, getRelativeTimeString } from '../utils/time';

export const HomePage: React.FC = () => {
  const { foods, canteens, orders, reorderPastOrder } = useApp();
  const navigate = useNavigate();
  const featuredFoods = foods.filter((f) => f.popular).slice(0, 4);
  const activeOrderPreview = orders[0];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2E3D5]/40 via-[#FAF7F2] to-[#FAF7F2] dark:from-[#201710] dark:via-[#16120E] dark:to-[#16120E] pt-12 pb-20 border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2E3D5] dark:bg-[#281D15] border border-[#D9A94D]/50 text-[#6D4C2E] dark:text-[#D9A94D] text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A94D]" />
              <span>Intelligent Campus Dining & Pre-Order Automation</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2B1D12] dark:text-[#F8F3ED] leading-[1.08]">
              Your Break. <br />
              <span className="text-[#6D4C2E] dark:text-[#D9A94D]">Your Food.</span> Zero Queues.
            </h1>

            <p className="text-base sm:text-lg text-[#7E6857] dark:text-[#B8A696] max-w-xl leading-relaxed">
              Order fresh meals right from your lecture hall desk, lock in a 15-minute kitchen pickup slot, and collect your hot meal at the express counter. Built to turn college break rush into actual downtime.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="px-6 py-3.5 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] font-bold text-sm flex items-center gap-2 shadow-warm-md hover:scale-105 active:scale-95 transition-all"
              >
                Order for Next Break <ArrowRight className="w-4 h-4 text-[#D9A94D]" />
              </Link>
              <Link
                to="/canteens"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#1E1510] hover:bg-[#F2E3D5]/40 border border-[#E6CFBC] dark:border-[#3D2D1F] text-[#2B1D12] dark:text-[#F8F3ED] font-bold text-sm transition-all"
              >
                Explore Campus Canteens
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E6CFBC]/80 dark:border-[#3D2D1F] max-w-lg">
              <div>
                <span className="font-display text-2xl font-black text-[#6D4C2E] dark:text-[#D9A94D]">0 Min</span>
                <p className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold mt-0.5">Token Queue Wait</p>
              </div>
              <div>
                <span className="font-display text-2xl font-black text-[#6D4C2E] dark:text-[#D9A94D]">4 Hubs</span>
                <p className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold mt-0.5">Campus Canteens</p>
              </div>
              <div>
                <span className="font-display text-2xl font-black text-[#6D4C2E] dark:text-[#D9A94D]">15 Min</span>
                <p className="text-xs text-[#7E6857] dark:text-[#B8A696] font-semibold mt-0.5">Batch Pickup Slots</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Composition & Live Pickup Status */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="relative group">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"
                  alt="Healthy Campus Protein Bowl"
                  className="rounded-3xl h-64 w-full object-cover shadow-warm-md border-4 border-white dark:border-[#1E1510] group-hover:scale-102 transition-transform"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  Green Bowl Kitchen
                </span>
              </div>
              <div className="relative group mt-8">
                <img
                  src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"
                  alt="Fresh Masala Dosa Combo"
                  className="rounded-3xl h-64 w-full object-cover shadow-warm-md border-4 border-white dark:border-[#1E1510] group-hover:scale-102 transition-transform"
                />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                  Central Dining Hall
                </span>
              </div>
            </div>

            {/* Live Order Status Ticket Overlay */}
            <div className="mt-4 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl p-4 shadow-warm-lg">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-extrabold text-[#6D4C2E] dark:text-[#D9A94D] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D9A94D] animate-ping" />
                  LIVE BREAK-TIME TICKET
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F2E3D5] dark:bg-[#281D15] text-[#6D4C2E] dark:text-[#D9A94D] font-black text-[11px] border border-[#D9A94D]/30">
                  Token #{activeOrderPreview?.id || 'SUK-20261018-0042'}
                </span>
              </div>
              <p className="font-display font-bold text-sm text-[#2B1D12] dark:text-white">
                {activeOrderPreview?.items[0]?.name || 'Ghee Roast Masala Dosa + Filter Coffee'}
              </p>
              <div className="flex items-center justify-between text-xs text-[#7E6857] dark:text-[#B8A696] mt-1.5 pt-1.5 border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F]">
                <span>Slot: {activeOrderPreview?.pickupSlotLabel?.split('(')[0] || 'Lunch Peak (01:00 PM)'}</span>
                <Link
                  to={`/track/${activeOrderPreview?.id || 'SUK-20261018-0042'}`}
                  className="text-[#A66E2E] dark:text-[#D9A94D] font-bold hover:underline flex items-center gap-1"
                >
                  Live Kitchen Tracker →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            Zero-Wait Campus Workflow
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-1 text-[#2B1D12] dark:text-white">
            How SUK Works
          </h2>
          <p className="text-sm text-[#7E6857] dark:text-[#B8A696] mt-2 leading-relaxed">
            Engineered around class timetables and kitchen capacities so students never spend their short break waiting in line.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Explore Live Menus',
              desc: 'Browse real-time dishes across campus canteens with up-to-the-minute prep times and availability.',
              icon: Smartphone
            },
            {
              step: '02',
              title: 'Select Break Window',
              desc: 'Reserve a capacity-controlled 15-minute pickup slot aligned with your academic timetable.',
              icon: CalendarClock
            },
            {
              step: '03',
              title: 'Instant Digital Checkout',
              desc: 'Settle via Campus Meal Card, UPI, or Pay at Counter to generate your secure kitchen token.',
              icon: Zap
            },
            {
              step: '04',
              title: 'Grab & Go Collection',
              desc: 'Walk up to the express counter when your ticket turns Ready and show your verified token number.',
              icon: CheckCircle2
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 relative hover:shadow-warm-md hover:-translate-y-1 transition-all"
            >
              <span className="text-xs font-black text-[#6D4C2E] dark:text-[#D9A94D] bg-[#F2E3D5] dark:bg-[#281D15] px-3 py-1 rounded-xl border border-[#D9A94D]/30">
                STEP {item.step}
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#6D4C2E] text-[#F2E3D5] flex items-center justify-center mt-5 mb-4 shadow-sm">
                <item.icon className="w-6 h-6 text-[#D9A94D]" />
              </div>
              <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
              Menu Collections
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-1 text-[#2B1D12] dark:text-white">
              Browse by Category
            </h2>
          </div>
          <Link to="/menu" className="text-xs font-bold text-[#6D4C2E] dark:text-[#D9A94D] hover:underline flex items-center gap-1">
            Complete Menu <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="group bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl p-3 text-center hover:border-[#A66E2E] hover:shadow-warm-sm transition-all"
            >
              <div className="w-full h-20 rounded-xl overflow-hidden mb-2.5 bg-[#F2E3D5] dark:bg-[#281D15]">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-display font-bold text-xs text-[#2B1D12] dark:text-white line-clamp-1">{cat.name}</h3>
              <p className="text-[10px] text-[#A66E2E] dark:text-[#D9A94D] font-semibold mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
              Campus Favourites
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-1 text-[#2B1D12] dark:text-white">
              Most Popular This Week
            </h2>
          </div>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F2E3D5] dark:bg-[#281D15] text-[#6D4C2E] dark:text-[#D9A94D] border border-[#D9A94D]/30 hover:bg-[#E6CFBC]/60 transition-colors"
          >
            View All ({foods.length} Dishes)
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* CAMPUS CANTEENS NETWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
              Dining Network
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-1 text-[#2B1D12] dark:text-white">
              Campus Canteens & Kitchens
            </h2>
          </div>
          <Link to="/canteens" className="text-xs font-bold text-[#6D4C2E] dark:text-[#D9A94D] hover:underline flex items-center gap-1">
            All Canteens <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {canteens.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl overflow-hidden flex flex-col justify-between shadow-warm-sm hover:shadow-warm-md transition-all"
            >
              <div>
                <div className="h-44 relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                  <span
                    className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${
                      c.isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {c.isOpen ? 'Open for Pre-Orders' : 'Kitchen Closed'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">{c.name}</h3>
                  <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1 line-clamp-2 leading-relaxed">{c.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {c.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-0.5 rounded-lg bg-[#F2E3D5] dark:bg-[#281D15] text-[10px] font-bold text-[#6D4C2E] dark:text-[#D9A94D]"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 flex items-center justify-between border-t border-[#E6CFBC]/60 dark:border-[#3D2D1F] mt-2">
                <span className="text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {c.prepEstimate}
                </span>
                <Link
                  to={`/canteen/${c.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold hover:bg-[#A66E2E] transition-colors"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REAL-TIME KITCHEN PIPELINE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#2D1F14] to-[#1E1510] text-[#F2E3D5] rounded-3xl p-8 sm:p-12 shadow-warm-lg border border-[#4D331D]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <span className="px-3 py-1 rounded-full bg-[#1F150D] text-[#D9A94D] text-xs font-extrabold uppercase tracking-wider border border-[#4D331D]">
                Integrated Kitchen Display System
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black mt-3 text-white">
                Transparent Preparation Pipeline
              </h2>
              <p className="text-xs sm:text-sm text-[#E6CFBC]/80 max-w-xl mt-1.5 leading-relaxed">
                Every ticket advances seamlessly through four live stages. Canteen chefs update the Kitchen Display System (KDS), updating students' mobile passes in real time.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/track/${activeOrderPreview?.id || 'CB-9412'}`}
                className="px-4 py-2.5 rounded-xl bg-[#D9A94D] text-[#2D1F14] font-bold text-xs hover:bg-[#C78F3B] transition-colors shadow-sm"
              >
                Open Live Order Tracker
              </Link>
              <Link
                to="/canteen-dashboard"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Kitchen KDS Terminal
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { stage: '1. Ticket Placed', time: '12:45 PM', desc: 'Break slot locked & token dispatched', done: true },
              { stage: '2. Kitchen Accepted', time: '12:46 PM', desc: 'Batch allocated to chef station', done: true },
              { stage: '3. On The Griddle', time: '12:52 PM', desc: 'Fresh preparation in progress', active: true },
              { stage: '4. Ready for Pickup', time: 'Est. 01:00 PM', desc: 'Waiting at Express Counter 1', done: false }
            ].map((st) => (
              <div
                key={st.stage}
                className={`rounded-2xl p-5 border transition-all ${
                  st.active
                    ? 'bg-[#3D291C] border-[#D9A94D] shadow-warm-md'
                    : st.done
                    ? 'bg-[#23170F] border-[#4D331D]'
                    : 'bg-[#18110B]/60 border-[#2D1F14] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-black text-[#D9A94D]">{st.time}</span>
                  {st.active && (
                    <span className="px-2 py-0.5 rounded bg-[#D9A94D] text-[#2D1F14] font-black text-[10px]">
                      CURRENT STAGE
                    </span>
                  )}
                </div>
                <h3 className="font-display font-bold text-sm text-white">{st.stage}</h3>
                <p className="text-xs text-[#E6CFBC]/80 mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAVED & ACTIVE ORDERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
              Live Activity & Reorders
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-1 text-[#2B1D12] dark:text-white">
              My Orders & Saved Passes
            </h2>
            <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] mt-0.5">
              Live pickup tickets and quick one-tap reorders saved directly to your session.
            </p>
          </div>
          {orders.length > 0 && (
            <Link
              to="/orders"
              className="text-xs font-bold text-[#6D4C2E] dark:text-[#D9A94D] hover:underline flex items-center gap-1"
            >
              All Passes ({orders.length}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {orders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="bg-white dark:bg-[#1E1510] border border-[#6D4C2E]/15 dark:border-[#D9A94D]/20 rounded-3xl p-6 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/15">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#A66E2E] dark:text-[#D9A94D] block">
                        Pass Reference
                      </span>
                      <span className="font-display font-black text-lg text-[#2B1D12] dark:text-white">
                        #{o.id}
                      </span>
                      <span className="text-[10px] text-[#7E6857] dark:text-[#B8A696] font-medium block">
                        Placed {formatTime(o.createdAt)} ({getRelativeTimeString(o.createdAt)})
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black shadow-sm ${
                        o.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : o.status === 'Ready for Pickup'
                          ? 'bg-[#D9A94D] text-[#2B1D12] animate-bounce'
                          : o.status === 'Preparing'
                          ? 'bg-[#F2E3D5] text-[#6D4C2E] dark:bg-[#281D15] dark:text-[#D9A94D]'
                          : 'bg-[#FAF7F2] text-[#7E6857] border border-[#6D4C2E]/15'
                      }`}
                    >
                      ● {o.status}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-bold text-[#A66E2E] dark:text-[#D9A94D]">
                      {o.canteenName}
                    </p>
                    <p className="text-[11px] text-[#7E6857] dark:text-[#B8A696] font-semibold">
                      Pickup Window: {o.pickupSlotLabel}
                    </p>
                    <div className="text-xs font-medium text-[#2B1D12] dark:text-white pt-1 line-clamp-2">
                      {o.items.map((it) => `${it.quantity}x ${it.name}`).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#6D4C2E]/10 dark:border-[#D9A94D]/15 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#7E6857] dark:text-[#B8A696] block">
                      Amount
                    </span>
                    <span className="font-display font-black text-base text-[#2B1D12] dark:text-white">
                      {formatINR(o.total)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/track/${o.id}`}
                      className="px-3 py-1.5 rounded-xl border border-[#6D4C2E]/20 text-[#6D4C2E] dark:text-[#D9A94D] text-xs font-bold hover:bg-[#F2E3D5] transition-colors"
                    >
                      Tracker
                    </Link>
                    <button
                      onClick={() => {
                        reorderPastOrder(o);
                        navigate('/cart');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-[#D9A94D]" /> Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1E1510] border border-[#6D4C2E]/15 dark:border-[#D9A94D]/20 rounded-3xl p-10 text-center space-y-3 shadow-warm-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E3D5] text-[#6D4C2E] flex items-center justify-center mx-auto mb-2">
              <Receipt className="w-6 h-6 text-[#A66E2E]" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#2B1D12] dark:text-white">
              No saved orders yet
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696] max-w-sm mx-auto">
              When you place a campus dining pre-order, your active tickets and quick reorder passes will appear right here.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold shadow-sm hover:bg-[#A66E2E] transition-all"
            >
              Explore Menu & Order Now <ArrowRight className="w-3.5 h-3.5 text-[#D9A94D]" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};