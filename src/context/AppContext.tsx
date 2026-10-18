import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  FoodItem,
  Canteen,
  PickupSlot,
  CartItem,
  Order,
  OrderStatus,
  OrderStatusEntry,
  UserProfile,
  StaffUser,
  AppSettings,
  AddOn,
  PaymentMethod,
  PaymentStatus
} from '../types';
import {
  INITIAL_CANTEENS,
  INITIAL_FOOD_ITEMS,
  INITIAL_PICKUP_SLOTS,
  INITIAL_ORDERS,
  INITIAL_STAFF_USERS,
  INITIAL_SETTINGS
} from '../data/seed';
import { calculateOrderPrepDuration, generateOrderId } from '../utils/time';
import { calculateOrderTotals } from '../utils/price';

const STORAGE_KEYS = {
  FOODS: 'cb_v5_foods',
  CANTEENS: 'cb_v5_canteens',
  SLOTS: 'cb_v5_slots',
  CART: 'cb_v5_cart',
  ORDERS: 'cb_v5_orders',
  FAVS: 'cb_v5_favs',
  PROFILE: 'cb_v5_profile',
  THEME: 'cb_v5_theme',
  USERS: 'cb_v5_staff_users',
  SETTINGS: 'cb_v5_settings'
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    // Sanitize any historical personal names
    if (typeof parsed === 'object' && parsed !== null && (parsed as any).name?.includes('Aman')) {
      return fallback;
    }
    return parsed as T;
  } catch {
    return fallback;
  }
}

export interface ToastMsg {
  id: string;
  title: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface VendorConflictState {
  pendingFood: FoodItem;
  quantity: number;
  addOns: AddOn[];
}

interface AppContextType {
  foods: FoodItem[];
  canteens: Canteen[];
  slots: PickupSlot[];
  cart: CartItem[];
  orders: Order[];
  favorites: string[];
  profile: UserProfile;
  staffUsers: StaffUser[];
  settings: AppSettings;
  theme: 'light' | 'dark';
  toasts: ToastMsg[];
  isOffline: boolean;
  vendorConflict: VendorConflictState | null;
  toggleTheme: () => void;
  notify: (title: string, type?: ToastMsg['type']) => void;
  dismissToast: (id: string) => void;
  addToCart: (food: FoodItem, quantity?: number, addOns?: AddOn[], forceClear?: boolean) => boolean;
  cancelVendorConflict: () => void;
  confirmVendorSwitch: () => void;
  updateCartQty: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  toggleFavorite: (foodId: string) => void;
  placeOrder: (payload: {
    customerName: string;
    studentId: string;
    contact: string;
    pickupDate: string;
    pickupSlotId: string;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    note?: string,
    cancellationReason?: string
  ) => void;
  advanceOrderStatus: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  reorderPastOrder: (order: Order) => void;
  upsertFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  upsertCanteen: (canteen: Canteen) => void;
  upsertSlot: (slot: PickupSlot) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  upsertStaffUser: (u: StaffUser) => void;
  removeStaffUser: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  resetToDefaultData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Campus Member',
  studentId: '24STU101',
  department: 'Undergraduate Studies',
  email: 'student@campus.ac.in',
  phone: '+91 98000 00000',
  dietaryPreference: 'All',
  notificationsEnabled: true,
  isAuthenticated: true,
  mealCardBalance: 850
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<FoodItem[]>(() => safeLoad(STORAGE_KEYS.FOODS, INITIAL_FOOD_ITEMS));
  const [canteens, setCanteens] = useState<Canteen[]>(() => safeLoad(STORAGE_KEYS.CANTEENS, INITIAL_CANTEENS));
  const [slots, setSlots] = useState<PickupSlot[]>(() => safeLoad(STORAGE_KEYS.SLOTS, INITIAL_PICKUP_SLOTS));
  const [cart, setCart] = useState<CartItem[]>(() => safeLoad(STORAGE_KEYS.CART, []));
  const [orders, setOrders] = useState<Order[]>(() => safeLoad(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
  const [favorites, setFavorites] = useState<string[]>(() => safeLoad(STORAGE_KEYS.FAVS, ['food-1', 'food-5', 'food-11']));
  const [profile, setProfile] = useState<UserProfile>(() => safeLoad(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE));
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>(() => safeLoad(STORAGE_KEYS.USERS, INITIAL_STAFF_USERS));
  const [settings, setSettings] = useState<AppSettings>(() => safeLoad(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [vendorConflict, setVendorConflict] = useState<VendorConflictState | null>(null);

  const broadcastRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FOODS, JSON.stringify(foods)); }, [foods]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens)); }, [canteens]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots)); }, [slots]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.FAVS, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(staffUsers)); }, [staffUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);

  // Realtime multi-tab synchronization with BroadcastChannel & storage events
  useEffect(() => {
    try {
      broadcastRef.current = new BroadcastChannel('campusbite_sync');
      broadcastRef.current.onmessage = (event) => {
        if (!event.data) return;
        const { type, payload } = event.data;
        if (type === 'ORDERS_UPDATE' && Array.isArray(payload)) {
          setOrders(payload);
        } else if (type === 'FOODS_UPDATE' && Array.isArray(payload)) {
          setFoods(payload);
        }
      };
    } catch {
      // BroadcastChannel not available, fall back to storage events
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) setOrders(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.FOODS && e.newValue) setFoods(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SLOTS && e.newValue) setSlots(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.CART && e.newValue) setCart(JSON.parse(e.newValue));
    };
    const handleOnline = () => {
      setIsOffline(false);
      notify('Network connection restored. Syncing campus dining hub.', 'info');
    };
    const handleOffline = () => {
      setIsOffline(true);
      notify('Offline mode active. Using cached campus menu & local storage.', 'warning');
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      broadcastRef.current?.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const broadcast = (type: string, payload: any) => {
    try {
      broadcastRef.current?.postMessage({ type, payload });
    } catch {
      // silently fail if not supported
    }
  };

  const notify = (title: string, type: ToastMsg['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const addToCart = (food: FoodItem, quantity = 1, addOns: AddOn[] = [], forceClear = false): boolean => {
    if (!food.available || food.stock <= 0) {
      notify(`${food.name} is currently sold out.`, 'error');
      return false;
    }

    const activeCart = forceClear ? [] : cart;
    if (activeCart.length > 0 && activeCart[0].canteenId !== food.canteenId) {
      setVendorConflict({ pendingFood: food, quantity, addOns });
      return false;
    }

    const addOnKey = addOns.map((a) => a.id).sort().join('|');
    const cartItemId = `${food.id}__${addOnKey}`;

    setCart((prev) => {
      const base = forceClear ? [] : prev;
      const existing = base.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return base.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: Math.min(20, i.quantity + quantity) } : i
        );
      }
      return [
        ...base,
        {
          cartItemId,
          foodId: food.id,
          canteenId: food.canteenId,
          quantity,
          selectedAddOns: addOns
        }
      ];
    });

    notify(`Added ${quantity}x ${food.name} to pickup bag`, 'success');
    return true;
  };

  const cancelVendorConflict = () => setVendorConflict(null);

  const confirmVendorSwitch = () => {
    if (!vendorConflict) return;
    addToCart(vendorConflict.pendingFood, vendorConflict.quantity, vendorConflict.addOns, true);
    setVendorConflict(null);
  };

  const updateCartQty = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    notify('Item removed from order', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (foodId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(foodId);
      notify(exists ? 'Removed from saved items' : 'Saved to your favourite meals', 'info');
      return exists ? prev.filter((id) => id !== foodId) : [...prev, foodId];
    });
  };

  const placeOrder: AppContextType['placeOrder'] = (payload) => {
    if (cart.length === 0) return null;
    const canteenId = cart[0].canteenId;
    const canteen = canteens.find((c) => c.id === canteenId);
    const slot = slots.find((s) => s.id === payload.pickupSlotId);

    const snapshots = cart
      .map((ci) => {
        const food = foods.find((f) => f.id === ci.foodId);
        if (!food) return null;
        return {
          foodId: food.id,
          name: food.name,
          price: food.price,
          quantity: ci.quantity,
          addOns: ci.selectedAddOns,
          isVeg: food.isVeg
        };
      })
      .filter(Boolean) as Order['items'];

    if (snapshots.length === 0) return null;

    // Use unified price calculation utility
    const totals = calculateOrderTotals(
      snapshots.map((s) => ({
        price: s.price,
        quantity: s.quantity,
        addOns: s.addOns
      })),
      settings.platformFeeRs
    );

    // If payment method is Campus Meal Card, deduct balance
    if (payload.paymentMethod === 'Campus Meal Card') {
      if (profile.mealCardBalance < totals.total) {
        notify('Insufficient balance on Campus Meal Card.', 'error');
        return null;
      }
      setProfile((prev) => ({
        ...prev,
        mealCardBalance: Math.max(0, prev.mealCardBalance - totals.total)
      }));
    }

    const now = new Date();
    const nowIso = now.toISOString();

    // Calculate realistic preparation time based on items ordered
    const itemPrepTimes = snapshots.map((s) => {
      const originalFood = foods.find((f) => f.id === s.foodId);
      return originalFood?.prepTimeMins || 10;
    });
    const prepDurationMins = calculateOrderPrepDuration(itemPrepTimes, 10);
    const estimatedReadyAt = new Date(now.getTime() + prepDurationMins * 60 * 1000).toISOString();

    const orderId = generateOrderId(now);

    const initialHistoryEntry: OrderStatusEntry = {
      status: 'Placed',
      timestamp: nowIso,
      note:
        payload.paymentMethod === 'Pay at Counter'
          ? 'Ticket placed — scheduled for express counter collection'
          : `Order placed & payment verified via ${payload.paymentMethod}`
    };

    const newOrder: Order = {
      id: orderId,
      createdAt: nowIso,
      placedAt: nowIso,
      updatedAt: nowIso,
      prepDurationMins,
      estimatedReadyAt,
      scheduledPickupTime: slot ? slot.timeRange : 'Next Break Window',
      paidAt: payload.paymentStatus === 'Paid' ? nowIso : undefined,
      canteenId,
      canteenName: canteen?.name || 'Campus Dining',
      customerName: payload.customerName,
      studentId: payload.studentId,
      contact: payload.contact,
      pickupDate: payload.pickupDate,
      pickupSlotId: payload.pickupSlotId,
      pickupSlotLabel: slot ? `${slot.label} (${slot.timeRange})` : 'Standard Break Window',
      items: snapshots,
      subtotal: totals.subtotal,
      PlatformFee: totals.platformFee,
      total: totals.total,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: 'Placed',
      notes: payload.notes,
      isOfflineCreated: isOffline,
      statusHistory: [initialHistoryEntry]
    };

    setOrders((prev) => {
      const next = [newOrder, ...prev];
      broadcast('ORDERS_UPDATE', next);
      return next;
    });
    setCart([]);
    notify(`Order #${newOrder.id} confirmed! Kitchen has received your ticket.`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    note?: string,
    cancellationReason?: string
  ) => {
    const nowIso = new Date().toISOString();

    setOrders((prev) => {
      const updated = prev.map((o) => {
        if (o.id !== orderId) return o;

        const defaultNote =
          note ||
          (status === 'Accepted'
            ? 'Kitchen station accepted ticket'
            : status === 'Preparing'
            ? 'Chef commenced preparation at griddle station'
            : status === 'Ready for Pickup'
            ? 'Order assembled and placed at Express Counter'
            : status === 'Completed' || status === 'Collected'
            ? 'Order collected by student'
            : status === 'Cancelled'
            ? `Order cancelled (${cancellationReason || 'Requested by user/canteen'})`
            : `Status changed to ${status}`);

        const newHistoryEntry: OrderStatusEntry = {
          status,
          timestamp: nowIso,
          note: defaultNote
        };

        const existingHistory = o.statusHistory || [
          { status: 'Placed', timestamp: o.createdAt || nowIso, note: 'Order placed' }
        ];

        return {
          ...o,
          status,
          updatedAt: nowIso,
          prepStartedAt: status === 'Preparing' ? o.prepStartedAt || nowIso : o.prepStartedAt,
          readyAt: status === 'Ready for Pickup' ? o.readyAt || nowIso : o.readyAt,
          completedAt:
            status === 'Completed' || status === 'Collected'
              ? o.completedAt || nowIso
              : o.completedAt,
          cancelledAt: status === 'Cancelled' ? nowIso : o.cancelledAt,
          cancellationReason: status === 'Cancelled' ? cancellationReason || 'Cancelled by staff' : o.cancellationReason,
          statusHistory: [...existingHistory, newHistoryEntry]
        };
      });

      broadcast('ORDERS_UPDATE', updated);
      return updated;
    });

    notify(`Order #${orderId} marked as "${status}"`, 'info');
  };

  const advanceOrderStatus = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const pipeline: OrderStatus[] = ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Completed'];
    const currentNormalized = order.status === 'Collected' ? 'Completed' : order.status;
    const currentIdx = pipeline.indexOf(currentNormalized);

    if (currentIdx >= 0 && currentIdx < pipeline.length - 1) {
      const nextStatus = pipeline[currentIdx + 1];
      updateOrderStatus(orderId, nextStatus);
    }
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'Cancelled', undefined, reason || 'Order cancelled by customer');
  };

  const reorderPastOrder = (order: Order) => {
    let addedCount = 0;
    const validItems: CartItem[] = [];
    for (const item of order.items) {
      const liveFood = foods.find((f) => f.id === item.foodId && f.available);
      if (liveFood) {
        const addOnKey = item.addOns.map((a) => a.id).sort().join('|');
        validItems.push({
          cartItemId: `${liveFood.id}__${addOnKey}`,
          foodId: liveFood.id,
          canteenId: liveFood.canteenId,
          quantity: item.quantity,
          selectedAddOns: item.addOns
        });
        addedCount++;
      }
    }
    if (addedCount === 0) {
      notify('Items from this previous order are currently unavailable.', 'error');
      return;
    }
    setCart(validItems);
    notify(`Restored ${addedCount} item(s) from order #${order.id} to your pickup cart!`, 'success');
  };

  const upsertFoodItem = (item: FoodItem) => {
    setFoods((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      const next = exists ? prev.map((f) => (f.id === item.id ? item : f)) : [item, ...prev];
      broadcast('FOODS_UPDATE', next);
      return next;
    });
    notify(`Dish "${item.name}" updated successfully`, 'success');
  };

  const deleteFoodItem = (id: string) => {
    setFoods((prev) => {
      const next = prev.filter((f) => f.id !== id);
      broadcast('FOODS_UPDATE', next);
      return next;
    });
    notify('Food item removed from menu', 'info');
  };

  const toggleFoodAvailability = (id: string) => {
    setFoods((prev) => {
      const next = prev.map((f) => (f.id === id ? { ...f, available: !f.available } : f));
      broadcast('FOODS_UPDATE', next);
      return next;
    });
    notify('Item live status updated', 'info');
  };

  const upsertCanteen = (canteen: Canteen) => {
    setCanteens((prev) => {
      const exists = prev.some((c) => c.id === canteen.id);
      return exists ? prev.map((c) => (c.id === canteen.id ? canteen : c)) : [...prev, canteen];
    });
    notify(`Canteen "${canteen.name}" updated`, 'success');
  };

  const upsertSlot = (slot: PickupSlot) => {
    setSlots((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      return exists ? prev.map((s) => (s.id === slot.id ? slot : s)) : [...prev, slot];
    });
    notify(`Pickup window "${slot.label}" saved`, 'success');
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
    notify('Profile updated successfully', 'success');
  };

  const upsertStaffUser = (u: StaffUser) => {
    setStaffUsers((prev) => {
      const exists = prev.some((item) => item.id === u.id);
      return exists ? prev.map((item) => (item.id === u.id ? u : item)) : [...prev, u];
    });
    notify('User record saved to directory', 'success');
  };

  const removeStaffUser = (id: string) => {
    setStaffUsers((prev) => prev.filter((u) => u.id !== id));
    notify('User removed from directory', 'info');
  };

  const updateSettings = (s: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
    notify('System configurations saved', 'success');
  };

  const resetToDefaultData = () => {
    Object.values(STORAGE_KEYS).forEach((k) => {
      if (k !== STORAGE_KEYS.THEME) localStorage.removeItem(k);
    });
    setFoods(INITIAL_FOOD_ITEMS);
    setCanteens(INITIAL_CANTEENS);
    setSlots(INITIAL_PICKUP_SLOTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setFavorites(['food-1', 'food-5', 'food-11']);
    setProfile(DEFAULT_PROFILE);
    setStaffUsers(INITIAL_STAFF_USERS);
    setSettings(INITIAL_SETTINGS);
    broadcast('ORDERS_UPDATE', INITIAL_ORDERS);
    broadcast('FOODS_UPDATE', INITIAL_FOOD_ITEMS);
    notify('All records refreshed to initial production state!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        foods,
        canteens,
        slots,
        cart,
        orders,
        favorites,
        profile,
        staffUsers,
        settings,
        theme,
        toasts,
        isOffline,
        vendorConflict,
        toggleTheme,
        notify,
        dismissToast,
        addToCart,
        cancelVendorConflict,
        confirmVendorSwitch,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleFavorite,
        placeOrder,
        updateOrderStatus,
        advanceOrderStatus,
        cancelOrder,
        reorderPastOrder,
        upsertFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        upsertCanteen,
        upsertSlot,
        updateProfile,
        upsertStaffUser,
        removeStaffUser,
        updateSettings,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};