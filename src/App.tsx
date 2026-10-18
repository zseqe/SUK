import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { MenuPage, FoodDetailPage, CanteensListPage, CanteenDetailPage } from './pages/MenuPages';
import { CartPage, CheckoutPage, OrderConfirmationPage, OrderTrackingPage, OrderHistoryPage } from './pages/OrderFlowPages';
import { CanteenDashboardPage } from './pages/CanteenDashboardPage';
import { AdminDashboardPage, ProfilePage } from './pages/AdminAndProfilePages';
import {
  AboutPage,
  HowItWorksPage,
  ContactPage,
  FaqPage,
  HelpCenterPage,
  PolicyPage,
  OfflineFallbackPage,
  NotFoundPage
} from './pages/InfoAndStaticPages';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/category/:categoryId" element={<MenuPage />} />
            <Route path="/search" element={<MenuPage forcedSearch />} />
            <Route path="/food/:foodId" element={<FoodDetailPage />} />
            <Route path="/canteens" element={<CanteensListPage />} />
            <Route path="/canteen/:canteenId" element={<CanteenDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/track/:orderId" element={<OrderTrackingPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/canteen-dashboard" element={<CanteenDashboardPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/help" element={<HelpCenterPage />} />
            <Route path="/privacy" element={<PolicyPage type="privacy" />} />
            <Route path="/terms" element={<PolicyPage type="terms" />} />
            <Route path="/refund-policy" element={<PolicyPage type="refund" />} />
            <Route path="/offline" element={<OfflineFallbackPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;