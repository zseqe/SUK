import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Mail,
  MapPin,
  Clock,
  ChevronDown,
  CheckCircle2,
  WifiOff,
  Compass,
  ShieldCheck,
  Phone,
  FileText
} from 'lucide-react';
import { CONTACT_CONFIG } from '../data/seed';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
        University Dining Cloud
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2B1D12] dark:text-white mt-1">
        About SUK
      </h1>
    </div>
    <p className="text-base text-[#7E6857] dark:text-[#B8A696] leading-relaxed">
      Across university campuses, thousands of students and faculty members flood dining halls simultaneously for brief 15-to-20-minute academic breaks. Traditional canteen counters collapse under bottlenecks: first queuing up for manual billing tokens, and then crowding kitchen counters while food is prepared on-demand.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
        <h3 className="font-display font-bold text-lg text-[#2B1D12] dark:text-white mb-2">
          Decoupled Pre-Ordering
        </h3>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed">
          SUK separates ordering from physical counter crowding. Students browse live availability from classrooms, lock in a guaranteed 15-minute pickup slot, and walk straight to the express pickup pass counter when their order is ready.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm">
        <h3 className="font-display font-bold text-lg text-[#2B1D12] dark:text-white mb-2">
          Intelligent Batch Preparation
        </h3>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed">
          Kitchen operators receive orders grouped into timed slots rather than erratic tickets. This enables batch preparation, maintains food temperature, eliminates wasted prep time, and reduces food waste across campus dining hubs.
        </p>
      </div>
    </div>
  </div>
);

export const HowItWorksPage: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
    <div className="text-center max-w-2xl mx-auto">
      <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
        Break-Time Optimization
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2B1D12] dark:text-white mt-1">
        How Pre-Ordering Works
      </h1>
      <p className="text-sm text-[#7E6857] dark:text-[#B8A696] mt-2">
        From lecture hall tap to express counter collection in four synchronized steps.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: '1. Select Canteen & Custom Meal',
          body: 'Browse Campus Central Dining, Green Bowl Kitchen, The Break Corner, or Campus Roasters with transparent allergen declarations and prep estimates.'
        },
        {
          title: '2. Reserve Your Break Window',
          body: 'Each 15-minute slot features dynamic capacity limits, ensuring the kitchen team batches your dish fresh right before your arrival.'
        },
        {
          title: '3. Instant Authorization',
          body: 'Settle in seconds using your Campus Student Meal Card, fast UPI QR, card, or choose Pay at Counter. Your ticket is registered immediately in the kitchen queue.'
        },
        {
          title: '4. Live Preparation Tracker & Pickup',
          body: 'Watch your order move from Placed to Preparing and Ready. Show your digital token number at the express pass counter and grab your warm meal.'
        }
      ].map((step) => (
        <div
          key={step.title}
          className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 shadow-warm-sm"
        >
          <h3 className="font-display font-bold text-base text-[#6D4C2E] dark:text-[#D9A94D]">{step.title}</h3>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-2 leading-relaxed">{step.body}</p>
        </div>
      ))}
    </div>
  </div>
);

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-5 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
            Support & Operations
          </span>
          <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
            Contact Operations
          </h1>
          <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-2 leading-relaxed">
            Have questions regarding campus meal cards, vendor onboarding, or dietary accommodations?
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#A66E2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2B1D12] dark:text-white">Operations Email</p>
              <p className="text-[#7E6857] dark:text-[#B8A696]">{CONTACT_CONFIG.supportEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#A66E2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2B1D12] dark:text-white">Helpline</p>
              <p className="text-[#7E6857] dark:text-[#B8A696]">{CONTACT_CONFIG.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#A66E2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2B1D12] dark:text-white">Campus Desk</p>
              <p className="text-[#7E6857] dark:text-[#B8A696]">{CONTACT_CONFIG.campusDesk}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#A66E2E] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#2B1D12] dark:text-white">Service Hours</p>
              <p className="text-[#7E6857] dark:text-[#B8A696]">{CONTACT_CONFIG.helplineHours}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-6 sm:p-8 shadow-warm-sm">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#A66E2E] mx-auto" />
            <h3 className="font-display font-extrabold text-lg text-[#2B1D12] dark:text-white">
              Inquiry Dispatched to Campus Operations
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696] max-w-sm mx-auto leading-relaxed">
              Your inquiry has been logged in the campus ticketing queue. An operations manager will reply to your registered campus email shortly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold hover:bg-[#A66E2E]"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h2 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">
              Dispatch Campus Message
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
              <div>
                <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Campus Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.ac.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Subject *</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Meal Card Recharge or Canteen Inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold block mb-1 text-[#2B1D12] dark:text-white">Message Details *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your inquiry..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6CFBC] bg-[#FAF6F0] dark:bg-[#140E0A] text-[#2B1D12] dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] text-xs font-bold transition-all shadow-warm-sm"
            >
              Submit Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export const FaqPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does express break-time pre-ordering work?',
      a: 'Select dishes from any campus canteen, choose an available 15-minute break slot, and place your order. Your kitchen token reference is generated immediately.'
    },
    {
      q: 'Which payment methods are supported on SUK?',
      a: 'SUK supports instant Campus Student Meal Cards, fast UPI QR codes, debit/credit cards, and cash or POS settlement at the express counter.'
    },
    {
      q: 'Can I cancel an order once placed and how do refunds work?',
      a: 'Orders in the "Placed" stage can be cancelled directly from your Order Tracking page before cooking begins. When an order is cancelled, refunds can either be collected directly from the canteen counter or credited instantly to the student wallet available in the app.'
    },
    {
      q: 'Can I order dishes from multiple canteens in a single order?',
      a: 'To guarantee exact 15-minute pickup windows, each ticket is prepared at a single designated canteen. If you want dishes from multiple venues, place separate quick orders.'
    },
    {
      q: 'What happens if a pickup slot is full?',
      a: 'To protect food quality and ensure kitchen staff are never overwhelmed, each 15-minute slot has a capacity cap. If a slot is full, simply choose the preceding or succeeding window.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          Frequently Asked Questions
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2B1D12] dark:text-white mt-1">
          Campus Dining FAQ
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-2xl p-6 shadow-warm-sm"
          >
            <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">{f.q}</h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-2 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HelpCenterPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
        Help & Guidance
      </span>
      <h1 className="font-display text-3xl sm:text-4xl font-black text-[#2B1D12] dark:text-white mt-1">
        Help Center
      </h1>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <Link
        to="/orders"
        className="p-6 rounded-3xl bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E] transition-all"
      >
        <Clock className="w-6 h-6 text-[#A66E2E] mb-3" />
        <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">Track Order Status</h3>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1">Check real-time status of your active token.</p>
      </Link>
      <Link
        to="/profile"
        className="p-6 rounded-3xl bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E] transition-all"
      >
        <HelpCircle className="w-6 h-6 text-[#D9A94D] mb-3" />
        <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">Meal Card & Balance</h3>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1">Manage dietary filters and meal card balance.</p>
      </Link>
      <Link
        to="/contact"
        className="p-6 rounded-3xl bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] hover:border-[#A66E2E] transition-all"
      >
        <Mail className="w-6 h-6 text-[#6D4C2E] mb-3" />
        <h3 className="font-display font-bold text-base text-[#2B1D12] dark:text-white">Operations Desk</h3>
        <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-1">Reach out to campus canteen staff directly.</p>
      </Link>
    </div>
  </div>
);

export const PolicyPage: React.FC<{ type: 'privacy' | 'terms' | 'refund' }> = ({ type }) => {
  const titles = {
    privacy: 'Campus Privacy Charter',
    terms: 'University Dining Terms of Service',
    refund: 'Cancellation & Refund Policy'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-[#A66E2E] dark:text-[#D9A94D]">
          Legal & Compliance
        </span>
        <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white mt-1">
          {titles[type]}
        </h1>
      </div>

      <div className="bg-white dark:bg-[#1E1510] border border-[#E6CFBC] dark:border-[#3D2D1F] rounded-3xl p-8 space-y-4 text-xs text-[#7E6857] dark:text-[#B8A696] leading-relaxed shadow-warm-sm">
        <p>
          <strong className="text-[#2B1D12] dark:text-white">1. University Data Protection:</strong> SUK encrypts all student identification numbers, meal card accounts, and contact records in compliance with academic privacy regulations.
        </p>
        <p>
          <strong className="text-[#2B1D12] dark:text-white">2. Payment & Pre-Order Policy:</strong> All digital orders processed through the platform lock in preparation slots at the designated campus kitchen. Orders not picked up within 20 minutes of the scheduled window may be cleared from the express pass station.
        </p>
        <p>
          <strong className="text-[#2B1D12] dark:text-white">3. Cancellations & Refund Policy:</strong> Cancellations are permitted while an order status is marked as "Placed". When an order is cancelled, refunds can either be collected directly in cash/POS from the canteen counter or credited instantly to the student wallet available in the app.
        </p>
      </div>
    </div>
  );
};

export const OfflineFallbackPage: React.FC = () => {
  const { orders, foods } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#F2E3D5] text-[#6D4C2E] flex items-center justify-center mx-auto shadow-sm">
        <WifiOff className="w-8 h-8 text-[#A66E2E]" />
      </div>
      <h1 className="font-display text-3xl font-black text-[#2B1D12] dark:text-white">Offline Mode Active</h1>
      <p className="text-xs sm:text-sm text-[#7E6857] dark:text-[#B8A696] max-w-lg mx-auto leading-relaxed">
        SUK caches static assets and preserves your local menu ({foods.length} dishes) and recent orders ({orders.length} orders) inside your device even when campus Wi-Fi drops.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/menu" className="px-6 py-3 rounded-2xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold shadow-warm-sm">
          Browse Cached Menu
        </Link>
        <Link to="/orders" className="px-6 py-3 rounded-2xl border border-[#E6CFBC] text-xs font-bold">
          View Saved Passes
        </Link>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
    <h1 className="font-display text-6xl font-black text-[#6D4C2E] dark:text-[#D9A94D]">404</h1>
    <h2 className="font-display text-2xl font-bold text-[#2B1D12] dark:text-white">Page Not Found</h2>
    <p className="text-xs text-[#7E6857] dark:text-[#B8A696]">
      The dining link you are attempting to access does not exist or has been relocated.
    </p>
    <Link
      to="/"
      className="inline-block mt-4 px-6 py-3 rounded-2xl bg-[#6D4C2E] text-[#F2E3D5] text-xs font-bold shadow-warm-sm"
    >
      Return to SUK Home
    </Link>
  </div>
);