export type CategoryId =
  | 'snacks'
  | 'meals'
  | 'burgers'
  | 'pizza'
  | 'beverages'
  | 'coffee'
  | 'desserts'
  | 'healthy';

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  canteenId: string;
  isVeg: boolean;
  prepTimeMins: number;
  available: boolean;
  popular: boolean;
  stock: number;
  calories: number;
  allergens: string[];
  image: string;
  addOns: AddOn[];
}

export interface Canteen {
  id: string;
  name: string;
  description: string;
  categories: string[];
  isOpen: boolean;
  prepEstimate: string;
  location: string;
  rating: number;
  image: string;
  pickupCounter: string;
}

export interface PickupSlot {
  id: string;
  label: string;
  timeRange: string;
  capacity: number;
  enabled: boolean;
}

export interface CartItem {
  cartItemId: string;
  foodId: string;
  canteenId: string;
  quantity: number;
  selectedAddOns: AddOn[];
  notes?: string;
}

export type OrderStatus =
  | 'Placed'
  | 'Accepted'
  | 'Preparing'
  | 'Ready for Pickup'
  | 'Completed'
  | 'Cancelled'
  | 'Collected'; // Kept as alias for Completed

export type PaymentMethod =
  | 'UPI / Card Online'
  | 'Pay at Counter'
  | 'Campus Meal Card';

export type PaymentStatus =
  | 'Paid'
  | 'Unpaid (Pay at Counter)'
  | 'Failed';

export interface OrderItemSnapshot {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  addOns: AddOn[];
  isVeg: boolean;
}

export interface OrderStatusEntry {
  status: OrderStatus;
  timestamp: string; // ISO 8601
  note?: string;
}

export interface Order {
  id: string; // Standardized: CB-YYYYMMDD-XXXX
  createdAt: string; // ISO 8601 placement timestamp
  placedAt?: string;
  updatedAt: string; // ISO 8601 last update
  prepDurationMins: number;
  estimatedReadyAt: string; // ISO 8601
  scheduledPickupTime: string;
  prepStartedAt?: string;
  readyAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  paidAt?: string;
  statusHistory: OrderStatusEntry[];

  canteenId: string;
  canteenName: string;
  customerName: string;
  studentId: string;
  contact: string;
  pickupDate: string;
  pickupSlotId: string;
  pickupSlotLabel: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  PlatformFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  notes?: string;
  isOfflineCreated?: boolean;
}

export interface UserProfile {
  name: string;
  studentId: string;
  department: string;
  email: string;
  phone: string;
  dietaryPreference: 'All' | 'Veg Only';
  notificationsEnabled: boolean;
  isAuthenticated: boolean;
  mealCardBalance: number;
}

export interface StaffUser {
  id: string;
  name: string;
  role: 'Student' | 'Canteen Operator' | 'Campus Admin';
  departmentOrCanteen: string;
  status: 'Active' | 'Inactive';
  email: string;
}

export interface AppSettings {
  brandName: string;
  operatingHours: string;
  defaultPickupLeadMins: number;
  platformFeeRs: number;
  systemNotice: string;
}