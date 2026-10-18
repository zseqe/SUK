import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  User,
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  WifiOff,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cart,
    theme,
    toggleTheme,
    settings,
    profile,
    toasts,
    dismissToast,
    isOffline,
    vendorConflict,
    cancelVendorConflict,
    confirmVendorSwitch
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installBannerDismissed, setInstallBannerDismissed] = useState(
    () => sessionStorage.getItem('cb_pwa_dismissed') === '1'
  );

  const navigate = useNavigate();
  const location = useLocation();
  const roleMenuRef = useRef<HTMLDivElement>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setRoleMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Click outside to close role menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // PWA install prompt handler
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setSearchOpen(false);
  };

  const isKds = location.pathname.startsWith('/canteen-dashboard');
  const isAdmin = location.pathname.startsWith('/admin');
  const currentViewLabel = isKds ? 'Kitchen KDS' : isAdmin ? 'Admin Console' : 'Student Portal';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-[#16120E] text-[#2B1D12] dark:text-[#F8F3ED] transition-colors selection:bg-[#F2E3D5] selection:text-[#6D4C2E]">
      {/* Offline Alert Strip (Only visible when offline) */}
      {isOffline && (
        <div className="bg-[#D9A94D] text-[#2B1D12] px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline mode active. Using cached campus menu and local order storage.</span>
        </div>
      )}

      {/* PWA Install Notification (Subtle top bar) */}
      {deferredPrompt && !installBannerDismissed && (
        <div className="bg-[#F2E3D5] dark:bg-[#241A12] border-b border-[#6D4C2E]/10 px-4 py-2 text-xs">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#6D4C2E] dark:text-[#F2E3D5] font-medium">
              <Download className="w-3.5 h-3.5 text-[#A66E2E]" />
              <span>Install <strong>CampusBite</strong> for instantaneous classroom ordering.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 rounded-full bg-[#6D4C2E] text-[#F2E3D5] font-bold hover:bg-[#A66E2E] transition-colors"
              >
                Install App
              </button>
              <button
                onClick={() => {
                  setInstallBannerDismissed(true);
                  sessionStorage.setItem('cb_pwa_dismissed', '1');
                }}
                className="p-1 text-[#6D4C2E] dark:text-gray-400 hover:opacity-75"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single Ultra-Minimalist Floating Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 dark:bg-[#16120E]/90 backdrop-blur-md border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/15 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#6D4C2E] flex items-center justify-center text-[#F2E3D5] shadow-sm group-hover:scale-105 group-hover:bg-[#A66E2E] transition-all duration-200">
                <UtensilsCrossed className="w-4 h-4 text-[#D9A94D]" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg tracking-tight text-[#2B1D12] dark:text-white leading-none">
                  {settings.brandName}
                </span>
                <span className="text-[10px] font-semibold text-[#A66E2E] dark:text-[#D9A94D] tracking-wide mt-0.5">
                  Campus Dining
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-bold">
              {[
                { to: '/menu', label: 'Explore Menu' },
                { to: '/canteens', label: 'Canteens' },
                { to: '/orders', label: 'Track Order' },
                { to: '/how-it-works', label: 'How It Works' }
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-[#F2E3D5] text-[#6D4C2E] dark:bg-[#281D15] dark:text-[#D9A94D] shadow-sm font-extrabold'
                        : 'text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white hover:bg-[#F2E3D5]/50 dark:hover:bg-[#241A12]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search Toggle / Input */}
            <div className="relative">
              {searchOpen ? (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearchSubmit}
                  className="relative flex items-center"
                >
                  <Search className="w-3.5 h-3.5 text-[#A66E2E] absolute left-3 pointer-events-none" />
                  <input
                    type="search"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search dishes..."
                    className="w-full pl-8 pr-7 py-1.5 text-xs rounded-full bg-white dark:bg-[#201710] border border-[#6D4C2E]/20 dark:border-[#D9A94D]/30 focus:border-[#6D4C2E] outline-none text-[#2B1D12] dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                  className="p-2 rounded-full text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white hover:bg-[#F2E3D5]/60 dark:hover:bg-[#241A12] transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Minimalist View Switcher Dropdown */}
            <div className="relative hidden sm:block" ref={roleMenuRef}>
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#6D4C2E]/15 dark:border-[#D9A94D]/25 bg-white/70 dark:bg-[#201710]/70 text-[#6D4C2E] dark:text-[#F2E3D5] hover:border-[#6D4C2E]/40 transition-all duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9A94D]" />
                <span>{currentViewLabel}</span>
                <ChevronDown className="w-3 h-3 text-[#A66E2E] opacity-75" />
              </button>

              <AnimatePresence>
                {roleMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#1E1510] border border-[#6D4C2E]/15 dark:border-[#D9A94D]/20 shadow-warm-md p-1.5 z-50 text-xs font-medium"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A66E2E] dark:text-[#D9A94D]">
                      Switch Portal View
                    </div>
                    <Link
                      to="/"
                      onClick={() => setRoleMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                        !isKds && !isAdmin
                          ? 'bg-[#F2E3D5] text-[#6D4C2E] font-bold dark:bg-[#281D15] dark:text-[#D9A94D]'
                          : 'text-[#7E6857] dark:text-[#B8A696] hover:bg-[#FAF7F2] dark:hover:bg-[#241A12]'
                      }`}
                    >
                      <span>Student Portal</span>
                      {!isKds && !isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-[#6D4C2E] dark:bg-[#D9A94D]" />}
                    </Link>
                    <Link
                      to="/canteen-dashboard"
                      onClick={() => setRoleMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                        isKds
                          ? 'bg-[#F2E3D5] text-[#6D4C2E] font-bold dark:bg-[#281D15] dark:text-[#D9A94D]'
                          : 'text-[#7E6857] dark:text-[#B8A696] hover:bg-[#FAF7F2] dark:hover:bg-[#241A12]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-[#A66E2E]" /> Kitchen KDS
                      </span>
                      {isKds && <span className="w-1.5 h-1.5 rounded-full bg-[#6D4C2E] dark:bg-[#D9A94D]" />}
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setRoleMenuOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${
                        isAdmin
                          ? 'bg-[#F2E3D5] text-[#6D4C2E] font-bold dark:bg-[#281D15] dark:text-[#D9A94D]'
                          : 'text-[#7E6857] dark:text-[#B8A696] hover:bg-[#FAF7F2] dark:hover:bg-[#241A12]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A66E2E]" /> Admin Console
                      </span>
                      {isAdmin && <span className="w-1.5 h-1.5 rounded-full bg-[#6D4C2E] dark:bg-[#D9A94D]" />}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white hover:bg-[#F2E3D5]/60 dark:hover:bg-[#241A12] transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-[#D9A94D]" />}
            </button>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              aria-label="View pickup bag"
              className="relative p-2 rounded-full text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white hover:bg-[#F2E3D5]/60 dark:hover:bg-[#241A12] transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D9A94D] text-[#2B1D12] font-black text-[10px] flex items-center justify-center shadow-sm"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </Link>

            {/* Student Profile Shortcut */}
            <Link
              to="/profile"
              aria-label="Profile"
              className="p-2 rounded-full text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white hover:bg-[#F2E3D5]/60 dark:hover:bg-[#241A12] transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Order Now CTA Button */}
            <Link
              to="/menu"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] shadow-sm hover:shadow-warm-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Order Food <ArrowRight className="w-3.5 h-3.5 text-[#D9A94D]" />
            </Link>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#7E6857] dark:text-[#B8A696] hover:text-[#2B1D12] dark:hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#FAF7F2] dark:bg-[#16120E] border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/15 px-5 py-4 space-y-3 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <Link to="/menu" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10">
                  Explore Menu
                </Link>
                <Link to="/canteens" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10">
                  Campus Canteens
                </Link>
                <Link to="/orders" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10">
                  Track Order
                </Link>
                <Link to="/how-it-works" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10">
                  How It Works
                </Link>
                <Link to="/canteen-dashboard" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10 text-[#A66E2E]">
                  Kitchen KDS
                </Link>
                <Link to="/admin" className="p-2.5 rounded-xl bg-white dark:bg-[#201710] border border-[#6D4C2E]/10 text-[#A66E2E]">
                  Admin Console
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Multi-Vendor Conflict Modal */}
      {vendorConflict && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1E1510] border border-[#6D4C2E]/15 dark:border-[#D9A94D]/20 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#F2E3D5] text-[#6D4C2E] flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-[#A66E2E]" />
            </div>
            <h3 className="font-display font-extrabold text-base text-[#2B1D12] dark:text-white">
              Order from another campus canteen?
            </h3>
            <p className="text-xs text-[#7E6857] dark:text-[#B8A696] mt-2 leading-relaxed">
              To guarantee express 15-minute break delivery, each order belongs to a single kitchen. Clear current bag and add <strong>{vendorConflict.pendingFood.name}</strong> instead?
            </p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={cancelVendorConflict}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#6D4C2E]/20 text-[#7E6857] hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Keep Current
              </button>
              <button
                onClick={confirmVendorSwitch}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#6D4C2E] hover:bg-[#A66E2E] text-[#F2E3D5] shadow-sm transition-colors"
              >
                Clear & Switch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-warm-md border bg-white dark:bg-[#1E1510] border-[#6D4C2E]/15 dark:border-[#D9A94D]/20 text-xs font-semibold text-[#2B1D12] dark:text-[#F8F3ED] animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#A66E2E] shrink-0" />}
              {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
              {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-[#D9A94D] shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-[#6D4C2E] dark:text-[#D9A94D] shrink-0" />}
              <span>{t.title}</span>
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Completely Redesigned Minimalist SaaS Footer */}
      <footer className="mt-24 border-t border-[#6D4C2E]/10 dark:border-[#D9A94D]/15 bg-[#F5EFE6] dark:bg-[#18120C] text-[#7E6857] dark:text-[#B8A696] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          
          {/* Top Row: Clean Brand & Horizontal Links */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-[#6D4C2E]/10 dark:border-[#D9A94D]/15">
            <div className="space-y-1.5">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-xl bg-[#6D4C2E] flex items-center justify-center text-[#F2E3D5] shadow-sm group-hover:bg-[#A66E2E] transition-colors">
                  <UtensilsCrossed className="w-4 h-4 text-[#D9A94D]" />
                </div>
                <span className="font-display font-black text-xl tracking-tight text-[#2B1D12] dark:text-white">
                  {settings.brandName}
                </span>
              </Link>
              <p className="text-xs text-[#7E6857] dark:text-[#B8A696] max-w-sm">
                Precision break-time dining and pre-order infrastructure for university campuses.
              </p>
            </div>

            {/* Essential Minimalist Links */}
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold">
              <Link to="/menu" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Menu
              </Link>
              <Link to="/canteens" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Canteens
              </Link>
              <Link to="/orders" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Track Orders
              </Link>
              <Link to="/canteen-dashboard" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Kitchen KDS
              </Link>
              <Link to="/admin" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Admin Console
              </Link>
              <Link to="/how-it-works" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                How It Works
              </Link>
              <Link to="/privacy" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Privacy
              </Link>
              <Link to="/contact" className="hover:text-[#6D4C2E] dark:hover:text-[#D9A94D] transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Bottom Row: Copyright, Operational Status, and Hours */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-[11px] text-[#7E6857]/80 dark:text-[#B8A696]/80">
              © {new Date().getFullYear()} {settings.brandName}. Designed for zero-wait campus dining.
            </p>

            {/* Live Operational Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 dark:bg-[#201710]/60 border border-[#6D4C2E]/10 dark:border-[#D9A94D]/20 text-[11px] font-bold text-[#6D4C2E] dark:text-[#D9A94D] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>All 4 Campus Dining Hubs Live</span>
            </div>

            <div className="text-[11px] text-[#7E6857]/80 dark:text-[#B8A696]/80">
              Operating Hours: {settings.operatingHours}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};