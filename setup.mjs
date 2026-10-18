import fs from 'fs';
import path from 'path';

const files = {
  'package.json': `{
  "name": "suk-pwa",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.2.10",
    "lucide-react": "^0.395.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.23.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.4.5",
    "vite": "^5.3.1"
  }
}`,

  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}`,

  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});`,

  'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#166534',
          800: '#14532D',
          900: '#0B2E1B',
        },
        warm: {
          bg: '#FAFAF7',
          text: '#17211B',
          muted: '#667085',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};`,

  'index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#14532D" />
    <meta name="description" content="SUK — Skip the queue. Pre-order college canteen food from your classroom and pick it up hot." />
    <link rel="manifest" href="/manifest.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <title>SUK — College Canteen Pre-Ordering PWA</title>
  </head>
  <body class="bg-[#FAFAF7] dark:bg-[#0B1510] text-[#17211B] dark:text-gray-100 antialiased selection:bg-[#DCFCE7] selection:text-[#14532D]">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'public/icon.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="128" fill="#14532D"/>
  <path d="M160 220C160 175.817 195.817 140 240 140H272C316.183 140 352 175.817 352 220V240H160V220Z" fill="#22C55E"/>
  <rect x="144" y="264" width="224" height="36" rx="18" fill="#F59E0B"/>
  <path d="M176 324H336C336 359.346 307.346 388 272 388H240C204.654 388 176 359.346 176 324Z" fill="#FAFAF7"/>
  <circle cx="380" cy="140" r="44" fill="#F59E0B"/>
</svg>`,

  'public/manifest.webmanifest': `{
  "name": "SUK — College Canteen Pre-Ordering",
  "short_name": "SUK",
  "description": "Skip the queue. Order your favourites from the classroom and pick them up when they're ready.",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#FAFAF7",
  "theme_color": "#14532D",
  "icons": [
    {
      "src": "/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}`,

  'public/sw.js': `const CACHE_NAME = 'suk-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networked = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached || caches.match('/index.html'));
      return cached || networked;
    })
  );
});`,

  'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
}

/* Custom subtle scrollbars */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 9999px;
}
.dark ::-webkit-scrollbar-thumb {
  background: #1E293B;
}`,

  'src/types.ts': `export type CategoryId =
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
  | 'Collected'
  | 'Cancelled';

export interface OrderItemSnapshot {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  addOns: AddOn[];
  isVeg: boolean;
}

export interface Order {
  id: string;
  createdAt: string;
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
  paymentMethod: 'Online Payment — Demo' | 'Pay at Counter';
  paymentStatus: 'Paid (Simulated)' | 'Unpaid (Pay at Counter)' | 'Failed';
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
  isLoggedInDemo: boolean;
}

export interface DemoStaffUser {
  id: string;
  name: string;
  role: 'Student' | 'Canteen Operator' | 'Campus Admin';
  departmentOrCanteen: string;
  status: 'Active' | 'Inactive';
}

export interface AppSettings {
  brandName: string;
  operatingHours: string;
  defaultPickupLeadMins: number;
  platformFeeRs: number;
}`,

  'src/data/seed.ts': `import { Canteen, FoodItem, PickupSlot, Order, DemoStaffUser, AppSettings } from '../types';

export const CATEGORIES = [
  { id: 'snacks', name: 'Snacks', icon: 'Flame', count: 'Quick bites', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { id: 'meals', name: 'Meals & Thalis', icon: 'Utensils', count: 'Hearty plates', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { id: 'burgers', name: 'Burgers & Wraps', icon: 'Sandwich', count: 'Grilled fresh', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'pizza', name: 'Artisan Pizza', icon: 'Pizza', count: 'Oven baked', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { id: 'beverages', name: 'Cold Beverages', icon: 'CupSoda', count: 'Chilled refreshers', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'coffee', name: 'Coffee & Chai', icon: 'Coffee', count: 'Freshly brewed', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
  { id: 'desserts', name: 'Desserts', icon: 'IceCream', count: 'Sweet treats', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80' },
  { id: 'healthy', name: 'Healthy Bowls', icon: 'Salad', count: 'High protein', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
] as const;

export const INITIAL_CANTEENS: Canteen[] = [
  {
    id: 'canteen-central',
    name: 'Campus Central Canteen',
    description: 'The main quad hub serving classic North & South Indian hot meals, crispy dosas, samosas, and masala chai.',
    categories: ['Meals & Thalis', 'Snacks', 'Coffee & Chai'],
    isOpen: true,
    prepEstimate: '8–12 mins',
    location: 'Ground Floor, Main Academic Block',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-greenbowl',
    name: 'Green Bowl Kitchen',
    description: 'Macro-friendly protein bowls, grilled wraps, cold-pressed juices, and wholesome post-workout plates.',
    categories: ['Healthy Bowls', 'Burgers & Wraps', 'Cold Beverages'],
    isOpen: true,
    prepEstimate: '6–10 mins',
    location: 'Near Sports Complex & Student Gym',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-snackcorner',
    name: 'The Snack Corner',
    description: 'Fast-moving break-time favourite for hand-tossed pizzas, loaded smash burgers, peri-peri fries, and shakes.',
    categories: ['Burgers & Wraps', 'Artisan Pizza', 'Snacks', 'Desserts'],
    isOpen: true,
    prepEstimate: '10–14 mins',
    location: 'Student Activity Center Courtyard',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-coffeehouse',
    name: 'Campus Coffee House',
    description: 'Specialty arabica espresso, iced matcha, artisan croissants, and warm brownies for study sessions.',
    categories: ['Coffee & Chai', 'Desserts', 'Cold Beverages'],
    isOpen: true,
    prepEstimate: '4–7 mins',
    location: 'Central Library Annex',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Masala Dosa with Filter Coffee Combo',
    description: 'Crispy golden fermented crepe stuffed with spiced potato mash, served with coconut chutney, sambar, and hot degree filter coffee.',
    price: 95,
    category: 'meals',
    canteenId: 'canteen-central',
    isVeg: true,
    prepTimeMins: 8,
    available: true,
    popular: true,
    stock: 42,
    calories: 480,
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-ghee', name: 'Extra Pure Ghee Roast', price: 20 },
      { id: 'ao-vada', name: 'Single Medu Vada', price: 25 }
    ]
  },
  {
    id: 'food-2',
    name: 'Punjabi Samosa Chaat Bowl',
    description: 'Two crushed flaky samosas topped with spiced chickpea curry, охлажденный sweet curd, tamarind glaze, mint chutney, and nylon sev.',
    price: 65,
    category: 'snacks',
    canteenId: 'canteen-central',
    isVeg: true,
    prepTimeMins: 5,
    available: true,
    popular: true,
    stock: 60,
    calories: 410,
    allergens: ['Gluten', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-curd', name: 'Extra Sweetened Curd', price: 15 },
      { id: 'ao-sev', name: 'Extra Sev & Pomegranate', price: 10 }
    ]
  },
  {
    id: 'food-3',
    name: 'Royal Paneer Butter Masala Thali',
    description: 'Rich tomato-cashew paneer gravy, dal tadka, jeera basmati rice, 2 tandoori butter rotis, raita, and gulab jamun.',
    price: 145,
    category: 'meals',
    canteenId: 'canteen-central',
    isVeg: true,
    prepTimeMins: 11,
    available: true,
    popular: true,
    stock: 28,
    calories: 760,
    allergens: ['Dairy', 'Nuts', 'Gluten'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-roti', name: 'Extra Butter Roti', price: 18 },
      { id: 'ao-lassi', name: 'Mini Sweet Lassi', price: 35 }
    ]
  },
  {
    id: 'food-4',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Long-grain aged basmati rice slow-cooked with saffron, caramelized onions, mint, and tender spiced chicken, served with mirchi ka salan.',
    price: 160,
    category: 'meals',
    canteenId: 'canteen-central',
    isVeg: false,
    prepTimeMins: 10,
    available: true,
    popular: true,
    stock: 35,
    calories: 820,
    allergens: ['Dairy', 'Nuts'],
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-egg', name: 'Boiled Masala Egg', price: 15 },
      { id: 'ao-raita', name: 'Extra Boondi Raita', price: 20 }
    ]
  },
  {
    id: 'food-5',
    name: 'Chargrilled Peri-Peri Chicken Protein Bowl',
    description: '180g flame-grilled peri-peri chicken breast over herb brown rice, roasted broccoli, corn salsa, avocado crema, and pickled slaw.',
    price: 175,
    category: 'healthy',
    canteenId: 'canteen-greenbowl',
    isVeg: false,
    prepTimeMins: 8,
    available: true,
    popular: true,
    stock: 24,
    calories: 540,
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-prot', name: 'Extra 60g Grilled Chicken', price: 55 },
      { id: 'ao-hummus', name: 'Scoop of Classic Hummus', price: 30 }
    ]
  },
  {
    id: 'food-6',
    name: 'Mediterranean Falafel & Quinoa Power Salad',
    description: 'Baked herb falafel, tri-color quinoa, Kalamata olives, cherry tomatoes, cucumber ribbons, feta crumbles, and lemon-tahini dressing.',
    price: 150,
    category: 'healthy',
    canteenId: 'canteen-greenbowl',
    isVeg: true,
    prepTimeMins: 6,
    available: true,
    popular: false,
    stock: 30,
    calories: 440,
    allergens: ['Sesame', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-feta', name: 'Extra Feta Cheese', price: 30 },
      { id: 'ao-pita', name: 'Warm Whole-Wheat Pita', price: 20 }
    ]
  },
  {
    id: 'food-7',
    name: 'Smoky Chipotle Paneer Tortilla Wrap',
    description: 'Charred tikka paneer cubes, bell peppers, crisp romaine, cheddar cheese, and smoky chipotle mayo wrapped in a toasted spinach tortilla.',
    price: 115,
    category: 'burgers',
    canteenId: 'canteen-greenbowl',
    isVeg: true,
    prepTimeMins: 7,
    available: true,
    popular: true,
    stock: 32,
    calories: 490,
    allergens: ['Gluten', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-jalapeno', name: 'Pickled Jalapeños', price: 15 },
      { id: 'ao-cheese', name: 'Double Cheddar Slice', price: 25 }
    ]
  },
  {
    id: 'food-8',
    name: 'Double Truffle Mushroom & Swiss Burger',
    description: 'Crispy herb-crusted cottage cheese & mushroom patty, caramelized onions, melted Swiss cheese, and truffle aioli in a toasted brioche bun.',
    price: 135,
    category: 'burgers',
    canteenId: 'canteen-snackcorner',
    isVeg: true,
    prepTimeMins: 10,
    available: true,
    popular: true,
    stock: 25,
    calories: 640,
    allergens: ['Gluten', 'Dairy', 'Soy'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-fries', name: 'Side of Peri-Peri Fries', price: 45 },
      { id: 'ao-coke', name: 'Chilled Lime Soda', price: 35 }
    ]
  },
  {
    id: 'food-9',
    name: 'Wood-Fired Margherita & Fresh Basil Pizza (9")',
    description: 'Hand-stretched sourdough crust, San Marzano style tomato sauce, fresh bocconcini mozzarella, basil leaves, and extra virgin olive oil.',
    price: 185,
    category: 'pizza',
    canteenId: 'canteen-snackcorner',
    isVeg: true,
    prepTimeMins: 12,
    available: true,
    popular: true,
    stock: 18,
    calories: 710,
    allergens: ['Gluten', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-olives', name: 'Black Olives & Sweet Corn', price: 30 },
      { id: 'ao-burst', name: 'Liquid Cheese Crust Upgrade', price: 45 }
    ]
  },
  {
    id: 'food-10',
    name: 'Crispy Korean Gochujang Chicken Tenders',
    description: '5 piece buttermilk crispy chicken tenders tossed in sweet-spicy Korean gochujang glaze with toasted white sesame seeds.',
    price: 140,
    category: 'snacks',
    canteenId: 'canteen-snackcorner',
    isVeg: false,
    prepTimeMins: 9,
    available: true,
    popular: false,
    stock: 20,
    calories: 520,
    allergens: ['Gluten', 'Sesame', 'Soy'],
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-ranch', name: 'Garlic Ranch Dip', price: 20 }
    ]
  },
  {
    id: 'food-11',
    name: 'Iced Spanish Hazelnut Latte',
    description: 'Double shot 100% Chikmagalur Arabica espresso shaken with condensed milk, roasted hazelnut syrup, cold milk, and ice.',
    price: 110,
    category: 'coffee',
    canteenId: 'canteen-coffeehouse',
    isVeg: true,
    prepTimeMins: 4,
    available: true,
    popular: true,
    stock: 50,
    calories: 230,
    allergens: ['Dairy', 'Nuts'],
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-oat', name: 'Swap for Barista Oat Milk', price: 30 },
      { id: 'ao-shot', name: 'Extra Espresso Shot', price: 25 }
    ]
  },
  {
    id: 'food-12',
    name: 'Warm Belgian Dark Chocolate Walnut Brownie',
    description: 'Fudgy 70% dark chocolate brownie baked with roasted Kashmir walnuts, served warm with a scoop of Madagascar vanilla bean ice cream.',
    price: 105,
    category: 'desserts',
    canteenId: 'canteen-coffeehouse',
    isVeg: true,
    prepTimeMins: 4,
    available: true,
    popular: true,
    stock: 22,
    calories: 460,
    allergens: ['Gluten', 'Dairy', 'Nuts'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-fudge', name: 'Extra Hot Chocolate Fudge', price: 20 }
    ]
  },
  {
    id: 'food-13',
    name: 'Watermelon Mint & Chia Cooler',
    description: 'Freshly cold-pressed watermelon juice infused with crushed garden mint, organic chia seeds, and a squeeze of Himalayan pink lime.',
    price: 75,
    category: 'beverages',
    canteenId: 'canteen-greenbowl',
    isVeg: true,
    prepTimeMins: 4,
    available: true,
    popular: false,
    stock: 40,
    calories: 110,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    addOns: []
  }
];

export const INITIAL_PICKUP_SLOTS: PickupSlot[] = [
  { id: 'slot-1', label: 'Morning Short Break', timeRange: '10:30 AM – 10:45 AM', capacity: 25, enabled: true },
  { id: 'slot-2', label: 'Pre-Lunch Express', timeRange: '12:15 PM – 12:30 PM', capacity: 30, enabled: true },
  { id: 'slot-3', label: 'Main Lunch Hour (Wave 1)', timeRange: '01:00 PM – 01:15 PM', capacity: 40, enabled: true },
  { id: 'slot-4', label: 'Main Lunch Hour (Wave 2)', timeRange: '01:15 PM – 01:30 PM', capacity: 40, enabled: true },
  { id: 'slot-5', label: 'Afternoon Lab Break', timeRange: '03:15 PM – 03:30 PM', capacity: 25, enabled: true },
  { id: 'slot-6', label: 'Evening Post-Lecture', timeRange: '04:30 PM – 04:45 PM', capacity: 30, enabled: true }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CB-4829',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    canteenId: 'canteen-central',
    canteenName: 'Campus Central Canteen',
    customerName: 'Campus Member',
    studentId: '24STU101',
    contact: 'member@campus.ac.in',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-3',
    pickupSlotLabel: '01:00 PM – 01:15 PM',
    items: [
      {
        foodId: 'food-1',
        name: 'Masala Dosa with Filter Coffee Combo',
        price: 95,
        quantity: 1,
        addOns: [{ id: 'ao-ghee', name: 'Extra Pure Ghee Roast', price: 20 }],
        isVeg: true
      },
      {
        foodId: 'food-2',
        name: 'Punjabi Samosa Chaat Bowl',
        price: 65,
        quantity: 1,
        addOns: [],
        isVeg: true
      }
    ],
    subtotal: 180,
    PlatformFee: 5,
    total: 185,
    paymentMethod: 'Online Payment — Demo',
    paymentStatus: 'Paid (Simulated)',
    status: 'Preparing',
    notes: 'Extra crispy dosa please!'
  },
  {
    id: 'CB-4825',
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    canteenId: 'canteen-greenbowl',
    canteenName: 'Green Bowl Kitchen',
    customerName: 'Ananya Rao',
    studentId: '24BBA211',
    contact: 'ananya.demo@campus.edu',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-2',
    pickupSlotLabel: '12:15 PM – 12:30 PM',
    items: [
      {
        foodId: 'food-5',
        name: 'Chargrilled Peri-Peri Chicken Protein Bowl',
        price: 175,
        quantity: 1,
        addOns: [{ id: 'ao-prot', name: 'Extra 60g Grilled Chicken', price: 55 }],
        isVeg: false
      }
    ],
    subtotal: 230,
    PlatformFee: 5,
    total: 235,
    paymentMethod: 'Online Payment — Demo',
    paymentStatus: 'Paid (Simulated)',
    status: 'Ready for Pickup'
  },
  {
    id: 'CB-4819',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    canteenId: 'canteen-coffeehouse',
    canteenName: 'Campus Coffee House',
    customerName: 'Rohan Kulkarni',
    studentId: '23CSE088',
    contact: 'rohan.demo@campus.edu',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-1',
    pickupSlotLabel: '10:30 AM – 10:45 AM',
    items: [
      {
        foodId: 'food-11',
        name: 'Iced Spanish Hazelnut Latte',
        price: 110,
        quantity: 2,
        addOns: [],
        isVeg: true
      }
    ],
    subtotal: 220,
    PlatformFee: 5,
    total: 225,
    paymentMethod: 'Pay at Counter',
    paymentStatus: 'Unpaid (Pay at Counter)',
    status: 'Collected'
  }
];

export const INITIAL_DEMO_USERS: DemoStaffUser[] = [
  { id: 'u-1', name: 'Campus Student Lead', role: 'Student', departmentOrCanteen: 'Student Council', status: 'Active' },
  { id: 'u-2', name: 'Campus Member', role: 'Student', departmentOrCanteen: 'Management Studies', status: 'Active' },
  { id: 'u-3', name: 'Chef Ramesh Nair', role: 'Canteen Operator', departmentOrCanteen: 'Campus Central Canteen', status: 'Active' },
  { id: 'u-4', name: 'Meera Krishnan', role: 'Canteen Operator', departmentOrCanteen: 'Green Bowl Kitchen', status: 'Active' },
  { id: 'u-5', name: 'Campus Dining Admin', role: 'Campus Admin', departmentOrCanteen: 'Student Welfare Committee', status: 'Active' }
];

export const INITIAL_SETTINGS: AppSettings = {
  brandName: 'SUK',
  operatingHours: '08:30 AM – 05:30 PM (Mon–Sat)',
  defaultPickupLeadMins: 10,
  platformFeeRs: 5
};

export const CONTACT_CONFIG = {
  supportEmail: 'demo-support@suk.edu.in (Placeholder)',
  campusDesk: 'Student Activity Center, Desk 4, Main Quad (Demo)',
  helplineHours: 'Monday to Saturday, 8:30 AM – 5:30 PM IST',
  phone: '+91 (0821) 000-0000 (Demonstration Placeholder)'
};`,

  'src/context/AppContext.tsx': `import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FoodItem,
  Canteen,
  PickupSlot,
  CartItem,
  Order,
  OrderStatus,
  UserProfile,
  DemoStaffUser,
  AppSettings,
  AddOn
} from '../types';
import {
  INITIAL_CANTEENS,
  INITIAL_FOOD_ITEMS,
  INITIAL_PICKUP_SLOTS,
  INITIAL_ORDERS,
  INITIAL_DEMO_USERS,
  INITIAL_SETTINGS
} from '../data/seed';

const STORAGE_KEYS = {
  FOODS: 'cb_v1_foods',
  CANTEENS: 'cb_v1_canteens',
  SLOTS: 'cb_v1_slots',
  CART: 'cb_v1_cart',
  ORDERS: 'cb_v1_orders',
  FAVS: 'cb_v1_favs',
  PROFILE: 'cb_v1_profile',
  THEME: 'cb_v1_theme',
  USERS: 'cb_v1_users',
  SETTINGS: 'cb_v1_settings'
};

function safeLoad<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
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
  demoUsers: DemoStaffUser[];
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
    paymentMethod: 'Online Payment — Demo' | 'Pay at Counter';
    paymentStatus: 'Paid (Simulated)' | 'Unpaid (Pay at Counter)' | 'Failed';
    notes?: string;
  }) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reorderPastOrder: (order: Order) => void;
  upsertFoodItem: (item: FoodItem) => void;
  deleteFoodItem: (id: string) => void;
  toggleFoodAvailability: (id: string) => void;
  upsertCanteen: (canteen: Canteen) => void;
  upsertSlot: (slot: PickupSlot) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
  upsertDemoUser: (u: DemoStaffUser) => void;
  removeDemoUser: (id: string) => void;
  updateSettings: (s: Partial<AppSettings>) => void;
  resetAllDemoData: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Campus Member',
  studentId: '24STU101',
  department: 'Computer Applications',
  email: 'member@campus.ac.in',
  phone: '+91 98000 00000',
  dietaryPreference: 'All',
  notificationsEnabled: true,
  isLoggedInDemo: true
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
  const [demoUsers, setDemoUsers] = useState<DemoStaffUser[]>(() => safeLoad(STORAGE_KEYS.USERS, INITIAL_DEMO_USERS));
  const [settings, setSettings] = useState<AppSettings>(() => safeLoad(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [vendorConflict, setVendorConflict] = useState<VendorConflictState | null>(null);

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
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers)); }, [demoUsers]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);

  // Cross-tab localStorage synchronization
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) setOrders(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.FOODS && e.newValue) setFoods(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.SLOTS && e.newValue) setSlots(JSON.parse(e.newValue));
      if (e.key === STORAGE_KEYS.CART && e.newValue) setCart(JSON.parse(e.newValue));
    };
    const handleOnline = () => {
      setIsOffline(false);
      notify('Back online! Local demo state synchronized.', 'info');
    };
    const handleOffline = () => {
      setIsOffline(true);
      notify('Offline mode active. Using cached menu & browser storage.', 'warning');
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const notify = (title: string, type: ToastMsg['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, title, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const addToCart = (food: FoodItem, quantity = 1, addOns: AddOn[] = [], forceClear = false): boolean => {
    if (!food.available || food.stock <= 0) {
      notify(\`\${food.name} is currently unavailable.\`, 'error');
      return false;
    }

    const activeCart = forceClear ? [] : cart;
    if (activeCart.length > 0 && activeCart[0].canteenId !== food.canteenId) {
      setVendorConflict({ pendingFood: food, quantity, addOns });
      return false;
    }

    const addOnKey = addOns.map((a) => a.id).sort().join('|');
    const cartItemId = \`\${food.id}__\${addOnKey}\`;

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

    notify(\`Added \${quantity}x \${food.name} to cart\`, 'success');
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
    notify('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (foodId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(foodId);
      notify(exists ? 'Removed from saved favourites' : 'Saved to your favourites', 'info');
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

    const subtotal = snapshots.reduce((sum, item) => {
      const addOnTotal = item.addOns.reduce((a, b) => a + b.price, 0);
      return sum + (item.price + addOnTotal) * item.quantity;
    }, 0);

    const newOrder: Order = {
      id: \`CB-\${Math.floor(5000 + Math.random() * 4999)}\`,
      createdAt: new Date().toISOString(),
      canteenId,
      canteenName: canteen?.name || 'Campus Canteen',
      customerName: payload.customerName,
      studentId: payload.studentId,
      contact: payload.contact,
      pickupDate: payload.pickupDate,
      pickupSlotId: payload.pickupSlotId,
      pickupSlotLabel: slot ? \`\${slot.label} (\${slot.timeRange})\` : 'Standard Pickup',
      items: snapshots,
      subtotal,
      PlatformFee: settings.platformFeeRs,
      total: subtotal + settings.platformFeeRs,
      paymentMethod: payload.paymentMethod,
      paymentStatus: payload.paymentStatus,
      status: 'Placed',
      notes: payload.notes,
      isOfflineCreated: isOffline
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    notify(\`Demo Order \${newOrder.id} placed! No real payment processed.\`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    notify(\`Order \${orderId} updated to "\${status}"\`, 'info');
  };

  const reorderPastOrder = (order: Order) => {
    let addedCount = 0;
    const validItems: CartItem[] = [];
    for (const item of order.items) {
      const liveFood = foods.find((f) => f.id === item.foodId && f.available);
      if (liveFood) {
        const addOnKey = item.addOns.map((a) => a.id).sort().join('|');
        validItems.push({
          cartItemId: \`\${liveFood.id}__\${addOnKey}\`,
          foodId: liveFood.id,
          canteenId: liveFood.canteenId,
          quantity: item.quantity,
          selectedAddOns: item.addOns
        });
        addedCount++;
      }
    }
    if (addedCount === 0) {
      notify('Items from this past order are currently unavailable.', 'error');
      return;
    }
    setCart(validItems);
    notify(\`Restored \${addedCount} item(s) from order \${order.id} to your cart!\`, 'success');
  };

  const upsertFoodItem = (item: FoodItem) => {
    setFoods((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      return exists ? prev.map((f) => (f.id === item.id ? item : f)) : [item, ...prev];
    });
    notify(\`Saved "\${item.name}" to local menu\`, 'success');
  };

  const deleteFoodItem = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    notify('Removed food item from demo menu', 'info');
  };

  const toggleFoodAvailability = (id: string) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, available: !f.available } : f))
    );
    notify('Updated item availability', 'info');
  };

  const upsertCanteen = (canteen: Canteen) => {
    setCanteens((prev) => {
      const exists = prev.some((c) => c.id === canteen.id);
      return exists ? prev.map((c) => (c.id === canteen.id ? canteen : c)) : [...prev, canteen];
    });
    notify(\`Updated canteen "\${canteen.name}"\`, 'success');
  };

  const upsertSlot = (slot: PickupSlot) => {
    setSlots((prev) => {
      const exists = prev.some((s) => s.id === slot.id);
      return exists ? prev.map((s) => (s.id === slot.id ? slot : s)) : [...prev, slot];
    });
    notify(\`Saved pickup slot "\${slot.label}"\`, 'success');
  };

  const updateProfile = (p: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
    notify('Saved local profile preferences', 'success');
  };

  const upsertDemoUser = (u: DemoStaffUser) => {
    setDemoUsers((prev) => {
      const exists = prev.some((item) => item.id === u.id);
      return exists ? prev.map((item) => (item.id === u.id ? u : item)) : [...prev, u];
    });
    notify('Saved demo directory entry', 'success');
  };

  const removeDemoUser = (id: string) => {
    setDemoUsers((prev) => prev.filter((u) => u.id !== id));
    notify('Removed demo user record', 'info');
  };

  const updateSettings = (s: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
    notify('Saved application settings', 'success');
  };

  const resetAllDemoData = () => {
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
    setDemoUsers(INITIAL_DEMO_USERS);
    setSettings(INITIAL_SETTINGS);
    notify('All demonstration data reset to initial factory state!', 'info');
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
        demoUsers,
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
        reorderPastOrder,
        upsertFoodItem,
        deleteFoodItem,
        toggleFoodAvailability,
        upsertCanteen,
        upsertSlot,
        updateProfile,
        upsertDemoUser,
        removeDemoUser,
        updateSettings,
        resetAllDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};`,

  'src/components/FoodCard.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Plus, Flame, Store } from 'lucide-react';
import { FoodItem } from '../types';
import { useApp } from '../context/AppContext';

export const FoodCard: React.FC<{ food: FoodItem }> = ({ food }) => {
  const { addToCart, favorites, toggleFavorite, canteens } = useApp();
  const isFav = favorites.includes(food.id);
  const canteen = canteens.find((c) => c.id === food.canteenId);

  return (
    <div className="group bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Link to={\`/food/\${food.id}\`}>
          <img
            src={food.image}
            alt={food.name}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={\`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1 \${
              food.isVeg
                ? 'bg-green-50/95 text-green-800 border border-green-300'
                : 'bg-amber-50/95 text-amber-900 border border-amber-300'
            }\`}
          >
            <span className={\`w-2 h-2 rounded-full \${food.isVeg ? 'bg-green-600' : 'bg-red-600'}\`} />
            {food.isVeg ? 'VEG' : 'NON-VEG'}
          </span>
          {food.popular && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F59E0B] text-white flex items-center gap-1 shadow-sm">
              <Flame className="w-3 h-3" /> Popular
            </span>
          )}
        </div>
        <button
          onClick={() => toggleFavorite(food.id)}
          aria-label="Toggle Favourite"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/70 text-gray-700 dark:text-gray-200 hover:text-red-500 transition-colors"
        >
          <Heart className={\`w-4 h-4 \${isFav ? 'fill-red-500 text-red-500' : ''}\`} />
        </button>
        {!food.available && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Sold Out for Break
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#667085] dark:text-gray-400 mb-1.5">
            <span className="flex items-center gap-1 truncate max-w-[70%]">
              <Store className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              {canteen?.name || 'Campus Canteen'}
            </span>
            <span className="flex items-center gap-1 font-medium text-brand-700 dark:text-brand-400">
              <Clock className="w-3.5 h-3.5" /> {food.prepTimeMins}m
            </span>
          </div>
          <Link
            to={\`/food/\${food.id}\`}
            className="font-bold text-base text-[#17211B] dark:text-white hover:text-brand-700 dark:hover:text-brand-400 line-clamp-1 transition-colors"
          >
            {food.name}
          </Link>
          <p className="text-xs text-[#667085] dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {food.description}
          </p>
        </div>

        <div className="pt-4 mt-3 border-t border-gray-100 dark:border-green-900/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#667085] dark:text-gray-400 block">Price</span>
            <span className="text-lg font-extrabold text-[#17211B] dark:text-white">₹{food.price}</span>
          </div>
          <button
            disabled={!food.available}
            onClick={() => addToCart(food, 1, [])}
            className={\`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all \${
              food.available
                ? 'bg-[#14532D] hover:bg-[#166534] text-white shadow-sm active:scale-95'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
            }\`}
          >
            <Plus className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};`,

  'src/components/Layout.tsx': `import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  ShieldAlert,
  WifiOff,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    cart,
    theme,
    toggleTheme,
    settings,
    toasts,
    dismissToast,
    isOffline,
    vendorConflict,
    cancelVendorConflict,
    confirmVendorSwitch
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installBannerDismissed, setInstallBannerDismissed] = useState(
    () => sessionStorage.getItem('cb_pwa_dismissed') === '1'
  );
  const navigate = useNavigate();
  const location = useLocation();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
    navigate(\`/search?q=\${encodeURIComponent(searchQuery.trim())}\`);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] dark:bg-[#0B1510] text-[#17211B] dark:text-gray-100 transition-colors">
      {/* Top Demo Role Switcher Bar */}
      <div className="bg-[#0B2E1B] text-white text-xs py-2 px-4 border-b border-green-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#22C55E] text-[#0B2E1B] font-bold uppercase tracking-wider text-[10px]">
              Interactive Prototype
            </span>
            <span className="text-green-100 hidden sm:inline">
              100% Frontend Browser-Storage Simulation — Switch Views Anytime:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className={\`px-2.5 py-1 rounded-md font-medium transition-colors \${
                !location.pathname.startsWith('/canteen-dashboard') && !location.pathname.startsWith('/admin')
                  ? 'bg-white text-[#0B2E1B]'
                  : 'text-green-200 hover:bg-green-900/60'
              }\`}
            >
              Student App
            </Link>
            <Link
              to="/canteen-dashboard"
              className={\`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors \${
                location.pathname.startsWith('/canteen-dashboard')
                  ? 'bg-[#F59E0B] text-black font-semibold'
                  : 'text-green-200 hover:bg-green-900/60'
              }\`}
            >
              <ChefHat className="w-3.5 h-3.5" /> Canteen Dashboard
            </Link>
            <Link
              to="/admin"
              className={\`px-2.5 py-1 rounded-md font-medium flex items-center gap-1 transition-colors \${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#F59E0B] text-black font-semibold'
                  : 'text-green-200 hover:bg-green-900/60'
              }\`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Admin SaaS View
            </Link>
          </div>
        </div>
      </div>

      {/* Offline Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2">
          <WifiOff className="w-4 h-4" />
          You are currently offline. Viewing cached SUK menu & local browser orders.
        </div>
      )}

      {/* PWA Install Banner */}
      {deferredPrompt && !installBannerDismissed && (
        <div className="bg-[#DCFCE7] dark:bg-green-950/90 border-b border-green-300 dark:border-green-800 px-4 py-2.5 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#14532D] dark:text-green-200 font-medium">
              <Download className="w-4 h-4 shrink-0" />
              <span>Install <strong>SUK PWA</strong> on your home screen for instant classroom ordering & offline menu access.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallClick}
                className="px-3 py-1 rounded-lg bg-[#14532D] text-white font-semibold hover:bg-[#166534]"
              >
                Install App
              </button>
              <button
                onClick={() => {
                  setInstallBannerDismissed(true);
                  sessionStorage.setItem('cb_pwa_dismissed', '1');
                }}
                className="p-1 text-gray-600 dark:text-gray-400"
                aria-label="Dismiss Install Banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1510]/95 backdrop-blur-md border-b border-gray-200 dark:border-green-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#14532D] flex items-center justify-center text-white shadow-sm group-hover:bg-[#166534] transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-[#17211B] dark:text-white block leading-none">
                  {settings.brandName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-brand-700 dark:text-brand-400">
                  Campus Pre-Order
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Explore Menu' },
                { to: '/canteens', label: 'Canteens' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/about', label: 'About' },
                { to: '/contact', label: 'Contact' }
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    \`px-3 py-2 rounded-lg transition-colors \${
                      isActive
                        ? 'bg-[#F0FDF4] dark:bg-green-950/60 text-[#14532D] dark:text-[#22C55E] font-semibold'
                        : 'text-[#667085] dark:text-gray-300 hover:text-[#17211B] dark:hover:text-white'
                    }\`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dosa, bowls, coffee..."
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-[#122017] border border-transparent focus:border-brand-600 focus:bg-white dark:focus:bg-[#17291E] outline-none w-48 lg:w-56 transition-all"
              />
            </form>

            <button
              onClick={toggleTheme}
              aria-label="Toggle colour theme"
              className="p-2 rounded-xl border border-gray-200 dark:border-green-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-green-950/50 transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>

            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative p-2 rounded-xl border border-gray-200 dark:border-green-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-green-950/50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#22C55E] text-[#0B2E1B] font-extrabold text-[11px] flex items-center justify-center shadow">
                  {totalCartItems}
                </span>
              )}
            </Link>

            <Link
              to="/profile"
              aria-label="Student Demo Profile"
              className="p-2 rounded-xl border border-gray-200 dark:border-green-900/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-green-950/50 transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>

            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#14532D] hover:bg-[#166534] text-white shadow-sm transition-all"
            >
              Order Now
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-green-900/50"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#122017] border-b border-gray-200 dark:border-green-900/50 px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex items-center relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search campus food..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-100 dark:bg-[#0B1510] border border-gray-200 dark:border-green-900/50"
              />
            </form>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/menu', label: 'Explore Menu' },
                { to: '/canteens', label: 'Canteens' },
                { to: '/orders', label: 'Order History' },
                { to: '/how-it-works', label: 'How It Works' },
                { to: '/about', label: 'About Us' },
                { to: '/faq', label: 'FAQs' },
                { to: '/contact', label: 'Contact' }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-50 dark:bg-[#0B1510] hover:bg-[#DCFCE7] dark:hover:bg-green-950"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Vendor Conflict Modal */}
      {vendorConflict && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900 rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#17211B] dark:text-white">
              Replace cart items from another canteen?
            </h3>
            <p className="text-sm text-[#667085] dark:text-gray-300 mt-2 leading-relaxed">
              To guarantee accurate break-time pickup windows, each order belongs to a single campus canteen. Would you like to clear your current cart and add <strong>{vendorConflict.pendingFood.name}</strong> instead?
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={cancelVendorConflict}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-green-800"
              >
                Keep Current Cart
              </button>
              <button
                onClick={confirmVendorSwitch}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#14532D] hover:bg-[#166534] text-white"
              >
                Clear & Switch Canteen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border bg-white dark:bg-[#122017] border-gray-200 dark:border-green-800 text-xs font-semibold"
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />}
              {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
              {t.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0" />}
              <span>{t.title}</span>
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Multi-Column Footer */}
      <footer className="bg-[#0B2E1B] text-gray-300 pt-14 pb-10 border-t border-green-900 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#22C55E] flex items-center justify-center text-[#0B2E1B]">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                {settings.brandName}
              </span>
            </div>
            <p className="text-sm text-green-100/80 max-w-sm leading-relaxed">
              Solving the 15-minute college break rush. Pre-order freshly prepared campus meals from your lecture hall and pick them up right on schedule.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-950/90 border border-green-800 text-xs text-green-300">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>Frontend-Only Interactive Prototype (Local Storage Mode)</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Discovery</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/menu" className="hover:text-white transition-colors">Explore Full Menu</Link></li>
              <li><Link to="/canteens" className="hover:text-white transition-colors">Browse Canteens</Link></li>
              <li><Link to="/category/meals" className="hover:text-white transition-colors">Meals & Thalis</Link></li>
              <li><Link to="/category/healthy" className="hover:text-white transition-colors">Healthy Protein Bowls</Link></li>
              <li><Link to="/category/coffee" className="hover:text-white transition-colors">Coffee & Chai</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Student & Demo Hubs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track & Order History</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Student Demo Profile</Link></li>
              <li><Link to="/canteen-dashboard" className="text-[#F59E0B] hover:underline font-medium">Canteen Operator Dashboard</Link></li>
              <li><Link to="/admin" className="text-[#22C55E] hover:underline font-medium">Admin SaaS Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Support & Policies</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About SUK</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy (Demo)</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/offline" className="hover:text-white transition-colors">Offline Fallback Preview</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-green-900/80 flex flex-col sm:flex-row items-center justify-between text-xs text-green-300/70 gap-4">
          <p>© {new Date().getFullYear()} {settings.brandName} College Canteen Pre-Ordering PWA. Demonstration Prototype.</p>
          <p>No real payments or server accounts are processed.</p>
        </div>
      </footer>
    </div>
  );
};`,

  'src/pages/HomePage.tsx': `import React from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { FoodCard } from '../components/FoodCard';

export const HomePage: React.FC = () => {
  const { foods, canteens, orders } = useApp();
  const featuredFoods = foods.filter((f) => f.popular).slice(0, 4);
  const demoPreviewOrder = orders[0];

  return (
    <div className="space-y-20 pb-12">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F0FDF4] to-[#FAFAF7] dark:from-[#0B2E1B]/50 dark:to-[#0B1510] pt-10 pb-20 border-b border-green-100 dark:border-green-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DCFCE7] dark:bg-green-950 text-[#14532D] dark:text-[#22C55E] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Break-Time Pre-Ordering for Modern Campuses</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#17211B] dark:text-white leading-[1.08]">
              Your Break. <br />
              <span className="text-[#166534] dark:text-[#22C55E]">Your Food.</span> Your Time.
            </h1>

            <p className="text-base sm:text-lg text-[#667085] dark:text-gray-300 max-w-xl leading-relaxed">
              Skip the queue. Order your favourites from the classroom and pick them up when they're ready. Built to turn 15-minute college breaks into actual downtime.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/menu"
                className="px-6 py-3.5 rounded-2xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all"
              >
                Order Food <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/canteens"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#122017] hover:bg-gray-50 border border-gray-200 dark:border-green-800 text-[#17211B] dark:text-white font-bold text-sm transition-all"
              >
                Explore Canteens
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 dark:border-green-900/40 max-w-lg">
              <div>
                <span className="text-2xl font-extrabold text-[#14532D] dark:text-[#22C55E]">0 Min</span>
                <p className="text-xs text-[#667085] dark:text-gray-400">Counter Queue Wait</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#14532D] dark:text-[#22C55E]">4 Hubs</span>
                <p className="text-xs text-[#667085] dark:text-gray-400">Campus Canteens</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#14532D] dark:text-[#22C55E]">15 Min</span>
                <p className="text-xs text-[#667085] dark:text-gray-400">Precision Pickup Slots</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Visual Composition & Live Order Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80"
                alt="Healthy Campus Protein Bowl"
                className="rounded-3xl h-64 w-full object-cover shadow-lg border-4 border-white dark:border-[#122017]"
              />
              <img
                src="https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=80"
                alt="Fresh Masala Dosa Combo"
                className="rounded-3xl h-64 w-full object-cover shadow-lg border-4 border-white dark:border-[#122017] mt-8"
              />
            </div>

            {/* Live Order Status Card Overlay */}
            <div className="mt-4 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-800 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#14532D] dark:text-[#22C55E] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  LIVE DEMO PICKUP PREVIEW
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                  Token #{demoPreviewOrder?.id || 'CB-4829'}
                </span>
              </div>
              <p className="text-sm font-bold text-[#17211B] dark:text-white">
                Masala Dosa + Filter Coffee Combo
              </p>
              <div className="flex items-center justify-between text-xs text-[#667085] dark:text-gray-400 mt-1">
                <span>Pickup Slot: 01:00 PM – 01:15 PM</span>
                <Link
                  to={\`/track/\${demoPreviewOrder?.id || 'CB-4829'}\`}
                  className="text-brand-700 dark:text-brand-400 font-semibold hover:underline"
                >
                  Interactive Tracker →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Zero Queue Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">How SUK Works</h2>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-2">
            Designed around academic timetables so you spend your break eating with friends, not standing at a billing counter.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Browse the Menu',
              desc: 'Explore live menus across all campus canteens with real-time item availability and prep estimates.',
              icon: Smartphone
            },
            {
              step: '02',
              title: 'Customize & Order',
              desc: 'Select dietary preferences, add-ons, and place your demo order right from your classroom desk.',
              icon: Flame
            },
            {
              step: '03',
              title: 'Choose Pickup Slot',
              desc: 'Lock in a capacity-controlled 15-minute break window so the kitchen prepares your meal fresh.',
              icon: CalendarClock
            },
            {
              step: '04',
              title: 'Walk In & Collect',
              desc: 'Watch live status move from Preparing to Ready for Pickup and grab your order from the express counter.',
              icon: CheckCircle2
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 relative"
            >
              <span className="text-xs font-black text-brand-700 dark:text-brand-400 bg-[#F0FDF4] dark:bg-green-950 px-2.5 py-1 rounded-lg">
                STEP {item.step}
              </span>
              <div className="w-11 h-11 rounded-xl bg-[#14532D] text-white flex items-center justify-center mt-4 mb-3">
                <item.icon className="w-5 h-5 text-[#22C55E]" />
              </div>
              <h3 className="font-bold text-base mb-1.5">{item.title}</h3>
              <p className="text-xs text-[#667085] dark:text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BROWSE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Craving Something Specific?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Browse by Category</h2>
          </div>
          <Link to="/menu" className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">
            Full Menu →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={\`/category/\${cat.id}\`}
              className="group bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-3 text-center hover:border-brand-600 transition-all"
            >
              <div className="w-full h-20 rounded-xl overflow-hidden mb-2.5 bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-xs text-[#17211B] dark:text-white line-clamp-1">{cat.name}</h3>
              <p className="text-[11px] text-[#667085] dark:text-gray-400">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED POPULAR ITEMS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Campus Bestsellers
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Most Popular This Week</h2>
          </div>
          <Link
            to="/menu"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#F0FDF4] dark:bg-green-950 text-[#14532D] dark:text-[#22C55E] border border-green-200 dark:border-green-800"
          >
            View All ({foods.length} Items)
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>

      {/* EXPLORE CANTEENS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
              Demonstration Vendors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">Explore Campus Canteens</h2>
          </div>
          <Link to="/canteens" className="text-xs font-bold text-brand-700 dark:text-brand-400 hover:underline">
            All Canteens →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {canteens.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="h-40 relative">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                  <span
                    className={\`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold \${
                      c.isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }\`}
                  >
                    {c.isOpen ? 'Open for Pre-Orders' : 'Closed'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base">{c.name}</h3>
                  <p className="text-xs text-[#667085] dark:text-gray-400 mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {c.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 rounded bg-gray-100 dark:bg-green-950/60 text-[10px] font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-700 dark:text-brand-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {c.prepEstimate}
                </span>
                <Link
                  to={\`/canteen/\${c.id}\`}
                  className="px-3.5 py-1.5 rounded-xl bg-[#14532D] text-white text-xs font-semibold hover:bg-[#166534]"
                >
                  Browse Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE ORDER TRACKING PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0B2E1B] text-white rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <span className="px-3 py-1 rounded-full bg-green-900 text-[#22C55E] text-xs font-bold uppercase tracking-wider">
                Demonstration Order Pipeline
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Real-Time Pickup Visibility
              </h2>
              <p className="text-sm text-green-100/80 max-w-xl mt-1">
                Every order moves through four transparent kitchen stages. Try updating statuses in the Canteen Dashboard and watch the student tracker update in your browser.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={\`/track/\${demoPreviewOrder?.id || 'CB-4829'}\`}
                className="px-4 py-2.5 rounded-xl bg-[#22C55E] text-[#0B2E1B] font-bold text-xs"
              >
                Open Live Order Tracker
              </Link>
              <Link
                to="/canteen-dashboard"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Open Kitchen Display
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { stage: '1. Order Placed', time: '12:42 PM', desc: 'Slot locked & token generated', done: true },
              { stage: '2. Accepted', time: '12:43 PM', desc: 'Kitchen queue confirmed', done: true },
              { stage: '3. Preparing', time: '12:51 PM', desc: 'On the griddle right now', active: true },
              { stage: '4. Ready for Pickup', time: 'Est. 01:00 PM', desc: 'Collect at Express Counter', done: false }
            ].map((st) => (
              <div
                key={st.stage}
                className={\`rounded-2xl p-4 border \${
                  st.active
                    ? 'bg-green-900/90 border-[#22C55E] shadow-md'
                    : st.done
                    ? 'bg-green-950/60 border-green-800'
                    : 'bg-green-950/30 border-green-900/50 opacity-70'
                }\`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-[#22C55E]">{st.time}</span>
                  {st.active && (
                    <span className="px-2 py-0.5 rounded bg-[#F59E0B] text-black font-extrabold text-[10px]">
                      CURRENT
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm">{st.stage}</h3>
                <p className="text-xs text-green-200/80 mt-1">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL BENEFITS SECTION (STUDENTS VS CANTEEN STAFF) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center mb-4">
            <BellRing className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold">Built for Busy Students</h3>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-1 mb-6">
            Never miss lunch between back-to-back lab sessions and lectures again.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'Skip the crowded billing and token queues entirely.',
              'Pre-order from any classroom, library desk, or hostel.',
              'Know the exact minute your meal hits the pickup counter.',
              'Reserve a guaranteed 15-minute break pickup slot.',
              'One-tap reorder for your daily filter coffee or thali.'
            ].map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
            <ChefHat className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold">Built for Canteen Operators</h3>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-1 mb-6">
            Turn chaotic 1:00 PM rush-hour shouting into a calm, predictable kitchen batch line.
          </p>
          <ul className="space-y-3 text-sm">
            {[
              'See incoming orders grouped by 15-minute pickup slots.',
              'Dedicated big-screen Kitchen Display Mode (KDS) for chefs.',
              'Instant one-click toggle when an item sells out.',
              'Cap slot capacities to prevent kitchen overload.',
              'Track peak break-hour demand and top-selling dishes.'
            ].map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <TrendingUp className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};`,

  'src/pages/MenuPages.tsx': `import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  Clock,
  Store,
  ArrowLeft,
  Plus,
  Minus,
  Heart,
  ShieldAlert,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/seed';
import { FoodCard } from '../components/FoodCard';
import { AddOn, CategoryId } from '../types';

export const MenuPage: React.FC<{ forcedCategory?: CategoryId; forcedSearch?: boolean }> = ({
  forcedCategory,
  forcedSearch
}) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const { foods, canteens } = useApp();
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState<string>(forcedCategory || categoryId || 'all');
  const [selectedCanteen, setSelectedCanteen] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(250);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyPopular, setOnlyPopular] = useState<boolean>(false);
  const [maxPrep, setMaxPrep] = useState<number>(20);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'prep' | 'alpha'>('popular');

  React.useEffect(() => {
    if (categoryId) setSelectedCategory(categoryId);
  }, [categoryId]);

  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  const filteredFoods = useMemo(() => {
    return foods
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedCanteen !== 'all' && item.canteenId !== selectedCanteen) return false;
        if (dietFilter === 'veg' && !item.isVeg) return false;
        if (dietFilter === 'nonveg' && item.isVeg) return false;
        if (item.price > maxPrice) return false;
        if (onlyAvailable && !item.available) return false;
        if (onlyPopular && !item.popular) return false;
        if (item.prepTimeMins > maxPrep) return false;
        if (query.trim()) {
          const q = query.toLowerCase();
          const canteenName = canteens.find((c) => c.id === item.canteenId)?.name.toLowerCase() || '';
          const match =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            canteenName.includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return Number(b.popular) - Number(a.popular);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'prep') return a.prepTimeMins - b.prepTimeMins;
        return a.name.localeCompare(b.name);
      });
  }, [foods, canteens, selectedCategory, selectedCanteen, dietFilter, maxPrice, onlyAvailable, onlyPopular, maxPrep, query, sortBy]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCanteen('all');
    setDietFilter('all');
    setMaxPrice(250);
    setOnlyAvailable(false);
    setOnlyPopular(false);
    setMaxPrep(20);
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            {forcedSearch ? 'Instant Campus Search' : 'Fresh Break-Time Menu'}
          </span>
          <h1 className="text-3xl font-extrabold mt-1">
            {selectedCategory !== 'all'
              ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || 'Explore Menu'
              : 'Explore Campus Menu'}
          </h1>
          <p className="text-sm text-[#667085] dark:text-gray-400 mt-1">
            Showing {filteredFoods.length} of {foods.length} freshly prepared campus dishes.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dish, ingredient, or canteen..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/50 text-sm outline-none focus:border-brand-600"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={\`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all \${
            selectedCategory === 'all'
              ? 'bg-[#14532D] text-white shadow-sm'
              : 'bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40'
          }\`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={\`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all \${
              selectedCategory === cat.id
                ? 'bg-[#14532D] text-white shadow-sm'
                : 'bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40'
            }\`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Multi-Filter Bar */}
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-center">
        <div>
          <label className="text-[11px] font-bold uppercase text-[#667085] block mb-1">Canteen Vendor</label>
          <select
            value={selectedCanteen}
            onChange={(e) => setSelectedCanteen(e.target.value)}
            className="w-full text-xs font-semibold rounded-lg bg-gray-50 dark:bg-[#0B1510] border border-gray-200 dark:border-green-900 p-2"
          >
            <option value="all">All Canteens</option>
            {canteens.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-[#667085] block mb-1">Dietary Preference</label>
          <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-[#0B1510] p-1 rounded-lg text-xs font-semibold">
            {(['all', 'veg', 'nonveg'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDietFilter(d)}
                className={\`py-1 rounded capitalize \${
                  dietFilter === d ? 'bg-white dark:bg-[#14532D] shadow-sm' : 'text-gray-500'
                }\`}
              >
                {d === 'all' ? 'All' : d === 'veg' ? 'Veg' : 'Non-Veg'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-[#667085] block mb-1">
            Max Price: ₹{maxPrice}
          </label>
          <input
            type="range"
            min={50}
            max={250}
            step={10}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#14532D]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-[#667085] block mb-1">
            Max Prep Time: {maxPrep} mins
          </label>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={maxPrep}
            onChange={(e) => setMaxPrep(Number(e.target.value))}
            className="w-full accent-[#14532D]"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase text-[#667085] block mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs font-semibold rounded-lg bg-gray-50 dark:bg-[#0B1510] border border-gray-200 dark:border-green-900 p-2"
          >
            <option value="popular">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="prep">Fastest Prep Time</option>
            <option value="alpha">Alphabetical (A–Z)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 pt-2 sm:pt-0">
          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded accent-[#14532D]"
            />
            In-Stock Only
          </label>
          <button
            onClick={clearFilters}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Product Grid or Empty State */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-12 text-center max-w-md mx-auto">
          <SlidersHorizontal className="w-10 h-10 text-brand-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold">No matching dishes found</h3>
          <p className="text-xs text-[#667085] dark:text-gray-400 mt-1 mb-6">
            Try widening your price range, switching dietary filters, or clearing your search query.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FoodDetailPage: React.FC = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const navigate = useNavigate();
  const { foods, canteens, addToCart, favorites, toggleFavorite } = useApp();

  const food = foods.find((f) => f.id === foodId);
  const [qty, setQty] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  if (!food) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Food item not found</h2>
        <p className="text-sm text-gray-500 mt-2">This item may have been removed from the demo menu.</p>
        <Link to="/menu" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          Back to Menu
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === food.canteenId);
  const isFav = favorites.includes(food.id);
  const related = foods.filter((f) => f.category === food.category && f.id !== food.id).slice(0, 4);

  const toggleAddOn = (ao: AddOn) => {
    setSelectedAddOns((prev) =>
      prev.some((x) => x.id === ao.id) ? prev.filter((x) => x.id !== ao.id) : [...prev, ao]
    );
  };

  const unitTotal = food.price + selectedAddOns.reduce((s, a) => s + a.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-14">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#667085] hover:text-[#17211B] dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden border border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#122017] shadow-sm">
            <img src={food.image} alt={food.name} className="w-full h-[380px] object-cover" />
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={\`px-3 py-1 rounded-full text-xs font-bold \${
                  food.isVeg ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }\`}
              >
                {food.isVeg ? '100% Vegetarian' : 'Non-Vegetarian'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-green-950">
                {food.calories} kcal
              </span>
            </div>
            <button
              onClick={() => toggleFavorite(food.id)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-green-800 text-xs font-semibold flex items-center gap-1.5"
            >
              <Heart className={\`w-4 h-4 \${isFav ? 'fill-red-500 text-red-500' : ''}\`} />
              {isFav ? 'Saved' : 'Save Favourite'}
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold">{food.name}</h1>
            <Link
              to={\`/canteen/\${food.canteenId}\`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-400 mt-2 hover:underline"
            >
              <Store className="w-4 h-4" /> Prepared by {canteen?.name} • Est. {food.prepTimeMins} mins
            </Link>
            <p className="text-sm text-[#667085] dark:text-gray-300 mt-3 leading-relaxed">{food.description}</p>
          </div>

          {food.allergens.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-3.5 py-2.5 rounded-xl">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                <strong>Allergen Info:</strong> Contains {food.allergens.join(', ')}.
              </span>
            </div>
          )}

          {/* Customizations */}
          {food.addOns.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#667085]">
                Optional Customizations & Add-Ons
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {food.addOns.map((ao) => {
                  const active = selectedAddOns.some((x) => x.id === ao.id);
                  return (
                    <button
                      key={ao.id}
                      type="button"
                      onClick={() => toggleAddOn(ao)}
                      className={\`p-3 rounded-xl border text-left flex items-center justify-between transition-all \${
                        active
                          ? 'border-brand-600 bg-[#F0FDF4] dark:bg-green-950/70'
                          : 'border-gray-200 dark:border-green-900/40 bg-white dark:bg-[#122017]'
                      }\`}
                    >
                      <div>
                        <p className="text-xs font-bold">{ao.name}</p>
                        <p className="text-[11px] text-[#667085]">+₹{ao.price}</p>
                      </div>
                      <div
                        className={\`w-5 h-5 rounded-md flex items-center justify-center \${
                          active ? 'bg-[#14532D] text-white' : 'border border-gray-300'
                        }\`}
                      >
                        {active && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-4 border-t border-gray-200 dark:border-green-900/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-800 rounded-2xl px-3 py-2">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-green-900"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm w-6 text-center">{qty}</span>
              <button
                onClick={() => setQty(Math.min(15, qty + 1))}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-green-900"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              disabled={!food.available}
              onClick={() => addToCart(food, qty, selectedAddOns)}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-[#14532D] hover:bg-[#166534] disabled:bg-gray-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              {food.available ? \`Add to Cart • ₹\${unitTotal * qty}\` : 'Currently Sold Out'}
            </button>
          </div>
        </div>
      </div>

      {/* Related Items */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-extrabold mb-6">Similar Campus Favourites</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((item) => (
              <FoodCard key={item.id} food={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CanteensListPage: React.FC = () => {
  const { canteens, foods } = useApp();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Campus Dining Network (Demo Data)
        </span>
        <h1 className="text-3xl font-extrabold mt-1">All Campus Canteens & Vendors</h1>
        <p className="text-sm text-[#667085] dark:text-gray-400 mt-1">
          Select a vendor below to browse its dedicated break-time menu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canteens.map((c) => {
          const itemCount = foods.filter((f) => f.canteenId === c.id).length;
          return (
            <div
              key={c.id}
              className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl overflow-hidden shadow-sm flex flex-col sm:flex-row"
            >
              <img src={c.image} alt={c.name} className="sm:w-52 h-48 sm:h-auto object-cover" />
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={\`px-2.5 py-0.5 rounded-full text-[11px] font-bold \${
                        c.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }\`}
                    >
                      {c.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">{itemCount} Dishes</span>
                  </div>
                  <h2 className="text-xl font-extrabold mt-2">{c.name}</h2>
                  <p className="text-xs text-[#667085] dark:text-gray-400 mt-1">{c.description}</p>
                  <p className="text-xs font-medium text-brand-700 dark:text-brand-400 mt-2">
                    📍 {c.location}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-green-900/30 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Avg Prep: {c.prepEstimate}</span>
                  <Link
                    to={\`/canteen/\${c.id}\`}
                    className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold hover:bg-[#166534]"
                  >
                    View Canteen Menu →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CanteenDetailPage: React.FC = () => {
  const { canteenId } = useParams<{ canteenId: string }>();
  const { canteens, foods } = useApp();
  const canteen = canteens.find((c) => c.id === canteenId);
  const canteenFoods = foods.filter((f) => f.canteenId === canteenId);

  if (!canteen) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Canteen not found</h2>
        <Link to="/canteens" className="inline-block mt-4 px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          All Canteens
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl overflow-hidden">
        <div className="h-56 relative">
          <img src={canteen.image} alt={canteen.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="px-2.5 py-1 rounded-full bg-[#22C55E] text-[#0B2E1B] text-xs font-bold">
                {canteen.isOpen ? 'Accepting Pre-Orders' : 'Currently Closed'}
              </span>
              <h1 className="text-3xl font-extrabold mt-2">{canteen.name}</h1>
              <p className="text-xs text-gray-200 mt-1">
                {canteen.location} • Prep Estimate: {canteen.prepEstimate}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-extrabold mb-6">Available Menu ({canteenFoods.length} Items)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {canteenFoods.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </div>
      </div>
    </div>
  );
};`,

  'src/pages/OrderFlowPages.tsx': `import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  Store
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold">Your SUK cart is empty</h1>
        <p className="text-sm text-[#667085] dark:text-gray-400 mt-2 mb-6">
          Browse live menus from Campus Central Canteen, Green Bowl Kitchen, or Campus Coffee House to schedule your break pickup.
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#14532D] text-white text-xs font-bold"
        >
          Browse Campus Menu <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === detailedItems[0].canteenId);
  const subtotal = detailedItems.reduce((sum, item) => {
    const addOnSum = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
    return sum + (item.food.price + addOnSum) * item.quantity;
  }, 0);
  const total = subtotal + settings.platformFeeRs;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Single-Canteen Pre-Order
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Your Pickup Cart</h1>
          <p className="text-xs text-[#667085] mt-1 flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-brand-600" /> Preparing at <strong>{canteen?.name}</strong>
          </p>
        </div>

        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-semibold">Confirm clear?</span>
            <button
              onClick={() => {
                clearCart();
                setConfirmClear(false);
              }}
              className="px-2.5 py-1 rounded bg-red-600 text-white text-xs font-bold"
            >
              Yes, Clear
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-800 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {detailedItems.map((item) => {
            const addOnTotal = item.selectedAddOns.reduce((a, b) => a + b.price, 0);
            const lineTotal = (item.food.price + addOnTotal) * item.quantity;
            return (
              <div
                key={item.cartItemId}
                className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-bold text-sm sm:text-base">{item.food.name}</h3>
                    <p className="text-xs text-[#667085]">Base Price: ₹{item.food.price}</p>
                    {item.selectedAddOns.length > 0 && (
                      <p className="text-xs text-brand-700 dark:text-brand-400 mt-1">
                        Add-ons: {item.selectedAddOns.map((a) => \`\${a.name} (+₹\${a.price})\`).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#0B1510] rounded-xl px-2.5 py-1">
                    <button
                      onClick={() => updateCartQty(item.cartItemId, -1)}
                      className="p-1"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.cartItemId, 1)}
                      className="p-1"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <span className="font-extrabold text-sm block">₹{lineTotal}</span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-[11px] text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4 sticky top-24">
            <h2 className="font-extrabold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm border-b border-gray-100 dark:border-green-900/40 pb-4">
              <div className="flex justify-between">
                <span className="text-[#667085]">Items Subtotal</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#667085]">Campus Token Fee (Demo)</span>
                <span className="font-semibold">₹{settings.platformFeeRs}</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-extrabold">
              <span>Total Payable</span>
              <span>₹{total}</span>
            </div>
            <Link
              to="/checkout"
              className="w-full py-3.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              Proceed to Pickup & Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/menu"
              className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-green-900 text-center text-xs font-semibold block"
            >
              + Add More Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage: React.FC = () => {
  const { cart, foods, canteens, slots, orders, profile, settings, placeOrder } = useApp();
  const navigate = useNavigate();

  const enabledSlots = slots.filter((s) => s.enabled);
  const [customerName, setCustomerName] = useState(profile.name);
  const [studentId, setStudentId] = useState(profile.studentId);
  const [contact, setContact] = useState(profile.email);
  const [pickupDate, setPickupDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSlotId, setSelectedSlotId] = useState(enabledSlots[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'Online Payment — Demo' | 'Pay at Counter'>('Online Payment — Demo');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [simulatingModal, setSimulatingModal] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No items in cart to checkout</h2>
        <Link to="/menu" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          Return to Menu
        </Link>
      </div>
    );
  }

  const canteen = canteens.find((c) => c.id === cart[0].canteenId);
  const subtotal = cart.reduce((sum, ci) => {
    const f = foods.find((x) => x.id === ci.foodId);
    if (!f) return sum;
    const ao = ci.selectedAddOns.reduce((a, b) => a + b.price, 0);
    return sum + (f.price + ao) * ci.quantity;
  }, 0);
  const total = subtotal + settings.platformFeeRs;

  const getSlotUsage = (slotId: string) =>
    orders.filter((o) => o.pickupSlotId === slotId && o.status !== 'Cancelled').length;

  const validateForm = () => {
    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return false;
    }
    if (!contact.trim()) {
      setErrorMsg('Please provide a contact email or phone number for the demo receipt.');
      return false;
    }
    if (!selectedSlotId) {
      setErrorMsg('Please select an available break pickup slot.');
      return false;
    }
    const chosenSlot = slots.find((s) => s.id === selectedSlotId);
    if (!chosenSlot || !chosenSlot.enabled || getSlotUsage(selectedSlotId) >= chosenSlot.capacity) {
      setErrorMsg('Selected pickup slot is full or unavailable. Please choose another break window.');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (paymentMethod === 'Online Payment — Demo') {
      setSimulatingModal(true);
    } else {
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
      if (created) navigate(\`/order-confirmation/\${created.id}\`);
    }
  };

  const completeSimulatedOnlinePayment = (outcome: 'success' | 'fail') => {
    if (outcome === 'fail') {
      setSimulatingModal(false);
      setErrorMsg('Simulated Online Payment Declined (Demo Test). Your cart has been preserved — try again or choose Pay at Counter.');
      return;
    }
    const created = placeOrder({
      customerName,
      studentId,
      contact,
      pickupDate,
      pickupSlotId: selectedSlotId,
      paymentMethod: 'Online Payment — Demo',
      paymentStatus: 'Paid (Simulated)',
      notes
    });
    setSimulatingModal(false);
    if (created) navigate(\`/order-confirmation/\${created.id}\`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Schedule Pickup & Checkout</h1>
      <p className="text-xs text-[#667085] mb-8">
        Demonstration Checkout — No real money is charged and no sensitive card details are requested.
      </p>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-200 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Student Details */}
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-base">1. Student Pickup Identity (Demo)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Roll / Student ID (Optional)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 24BCA104"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Contact Email or Phone *</label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Pickup Slot Selection */}
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-base">2. Choose Break Pickup Slot</h2>
              <span className="text-[11px] text-[#667085]">Simulated Slot Capacity Rules</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot) => {
                const used = getSlotUsage(slot.id);
                const isFull = used >= slot.capacity;
                const disabled = !slot.enabled || isFull;
                const active = selectedSlotId === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={\`p-3.5 rounded-xl border text-left transition-all \${
                      disabled
                        ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900 border-gray-200'
                        : active
                        ? 'border-brand-600 bg-[#F0FDF4] dark:bg-green-950/80 ring-2 ring-brand-500/30'
                        : 'border-gray-200 dark:border-green-900/40 hover:border-brand-600'
                    }\`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{slot.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-gray-200 dark:bg-green-900">
                        {used}/{slot.capacity} orders
                      </span>
                    </div>
                    <p className="text-xs text-brand-700 dark:text-brand-400 font-semibold mt-1">
                      {slot.timeRange}
                    </p>
                    {disabled && (
                      <span className="text-[10px] text-red-600 font-bold block mt-1">
                        {!slot.enabled ? 'Disabled by Canteen' : 'Slot Full'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1">Cooking Notes (Optional)</label>
              <input
                type="text"
                maxLength={120}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Less spicy, pack chutney separately..."
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] text-sm"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
            <h2 className="font-bold text-base">3. Payment Method (Simulated)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('Online Payment — Demo')}
                className={\`p-4 rounded-xl border text-left flex items-start gap-3 \${
                  paymentMethod === 'Online Payment — Demo'
                    ? 'border-brand-600 bg-[#F0FDF4] dark:bg-green-950/70'
                    : 'border-gray-200 dark:border-green-900/40'
                }\`}
              >
                <CreditCard className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Online Payment — Demo</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Instant simulated campus UPI/Web checkout. No real card numbers or money used.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Pay at Counter')}
                className={\`p-4 rounded-xl border text-left flex items-start gap-3 \${
                  paymentMethod === 'Pay at Counter'
                    ? 'border-brand-600 bg-[#F0FDF4] dark:bg-green-950/70'
                    : 'border-gray-200 dark:border-green-900/40'
                }\`}
              >
                <Banknote className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold">Pay at Counter</p>
                  <p className="text-[11px] text-[#667085] mt-0.5">
                    Order marked as Unpaid. Settle cash/UPI directly at the canteen pickup desk.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4 sticky top-24">
            <h2 className="font-extrabold text-lg">Pickup Order Summary</h2>
            <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
              Canteen: {canteen?.name}
            </p>
            <div className="divide-y divide-gray-100 dark:divide-green-900/30 max-h-60 overflow-y-auto">
              {cart.map((ci) => {
                const f = foods.find((x) => x.id === ci.foodId);
                if (!f) return null;
                const ao = ci.selectedAddOns.reduce((a, b) => a + b.price, 0);
                return (
                  <div key={ci.cartItemId} className="py-2.5 flex justify-between text-xs">
                    <span>
                      <strong>{ci.quantity}x</strong> {f.name}
                    </span>
                    <span className="font-bold">₹{(f.price + ao) * ci.quantity}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 dark:border-green-900 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Demo Platform Fee</span>
                <span>₹{settings.platformFeeRs}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold pt-2">
                <span>Total Amount</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-sm shadow-md"
            >
              Place Demo Order • ₹{total}
            </button>
            <p className="text-[11px] text-center text-[#667085]">
              By placing this demo order, you acknowledge this is a frontend-only simulation stored in your browser.
            </p>
          </div>
        </div>
      </form>

      {/* Simulated Online Payment Modal */}
      {simulatingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-800 rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-[#14532D] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
              SIMULATED PAYMENT GATEWAY
            </span>
            <h3 className="text-xl font-extrabold">Demo Payment of ₹{total}</h3>
            <p className="text-xs text-[#667085] dark:text-gray-300 leading-relaxed">
              No real money is transferred. Choose an outcome below to test how SUK handles successful or failed transactions:
            </p>
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => completeSimulatedOnlinePayment('success')}
                className="w-full py-3 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-xs"
              >
                ✓ Simulate Instant Payment Success
              </button>
              <button
                type="button"
                onClick={() => completeSimulatedOnlinePayment('fail')}
                className="w-full py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-bold text-xs"
              >
                ✕ Simulate Payment Failure (Test Error Handling)
              </button>
              <button
                type="button"
                onClick={() => setSimulatingModal(false)}
                className="w-full py-2 text-xs text-gray-500 hover:underline"
              >
                Cancel & Return to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useApp();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">Order reference not found</h2>
        <Link to="/orders" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          View Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-8 text-center space-y-6 shadow-sm">
        <div className="w-16 h-16 rounded-3xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div>
          <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-950 text-brand-800 dark:text-brand-400 text-xs font-bold">
            DEMO ORDER CONFIRMED
          </span>
          <h1 className="text-3xl font-extrabold mt-2">Token #{order.id}</h1>
          <p className="text-xs text-[#667085] dark:text-gray-400 mt-1">
            Saved locally in your browser. Head to <strong>{order.canteenName}</strong> during your pickup window!
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-[#0B1510] rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Pickup Slot:</span>
            <span className="font-bold text-brand-700 dark:text-brand-400">{order.pickupSlotLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Student Name:</span>
            <span className="font-semibold">{order.customerName} ({order.studentId || 'Guest'})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="font-semibold">{order.paymentMethod} — {order.paymentStatus}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-green-900 pt-2 text-sm font-extrabold">
            <span>Total Demo Amount:</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to={\`/track/\${order.id}\`}
            className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold"
          >
            Track Live Order Status →
          </Link>
          <Link
            to="/menu"
            className="px-6 py-3 rounded-xl border border-gray-200 dark:border-green-800 text-xs font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

const STAGES: OrderStatus[] = ['Placed', 'Accepted', 'Preparing', 'Ready for Pickup', 'Collected'];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders, updateOrderStatus } = useApp();
  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold">No demo orders found</h2>
        <Link to="/menu" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          Place Your First Demo Order
        </Link>
      </div>
    );
  }

  const currentIdx = STAGES.indexOf(order.status);

  const advanceDemoStage = () => {
    if (order.status === 'Cancelled') return;
    const nextIdx = Math.min(STAGES.length - 1, currentIdx + 1);
    updateOrderStatus(order.id, STAGES[nextIdx]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Same-Browser Live Synchronized Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold">Order #{order.id}</h1>
          <p className="text-xs text-[#667085]">
            Placed at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.canteenName}
          </p>
        </div>
        <span
          className={\`px-4 py-1.5 rounded-full text-xs font-extrabold \${
            order.status === 'Cancelled'
              ? 'bg-red-100 text-red-800'
              : order.status === 'Ready for Pickup'
              ? 'bg-[#22C55E] text-[#0B2E1B]'
              : 'bg-amber-100 text-amber-900'
          }\`}
        >
          Status: {order.status}
        </span>
      </div>

      {/* Interactive Demo Control Banner */}
      <div className="bg-[#F0FDF4] dark:bg-green-950/60 border border-green-300 dark:border-green-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-xs space-y-0.5">
          <p className="font-bold text-[#14532D] dark:text-[#22C55E]">
            Interactive Demonstration Controls
          </p>
          <p className="text-[#667085] dark:text-gray-300">
            Advance this order manually below or switch to the Canteen Dashboard in another tab to test live browser synchronization.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {order.status !== 'Collected' && order.status !== 'Cancelled' && (
            <button
              onClick={advanceDemoStage}
              className="px-4 py-2 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-bold"
            >
              Advance to Next Stage →
            </button>
          )}
          {order.status === 'Placed' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'Cancelled')}
              className="px-3 py-2 rounded-xl bg-red-100 text-red-700 text-xs font-bold"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Visual Status Timeline */}
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-6">
        <h2 className="font-bold text-sm mb-6">Kitchen Preparation Timeline</h2>
        {order.status === 'Cancelled' ? (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-200 text-xs font-bold">
            This demonstration order was cancelled.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {STAGES.map((st, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              return (
                <div
                  key={st}
                  className={\`p-4 rounded-2xl border transition-all \${
                    isCurrent
                      ? 'border-brand-600 bg-[#F0FDF4] dark:bg-green-950 ring-2 ring-brand-500/30'
                      : isCompleted
                      ? 'border-green-200 dark:border-green-900 bg-white dark:bg-[#122017]'
                      : 'border-gray-100 dark:border-gray-800 opacity-50'
                  }\`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span>Step {idx + 1}</span>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    {isCurrent && <Clock className="w-4 h-4 text-amber-500 animate-spin" />}
                  </div>
                  <p className="font-extrabold text-sm">{st}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Details */}
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pb-4 border-b border-gray-100 dark:border-green-900/40">
          <div>
            <span className="text-gray-400 block">Pickup Slot</span>
            <strong className="text-sm text-brand-700 dark:text-brand-400">{order.pickupSlotLabel}</strong>
          </div>
          <div>
            <span className="text-gray-400 block">Payment Status</span>
            <strong className="text-sm">{order.paymentMethod} ({order.paymentStatus})</strong>
          </div>
          <div>
            <span className="text-gray-400 block">Student</span>
            <strong className="text-sm">{order.customerName} ({order.studentId})</strong>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase text-gray-400">Ordered Items</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1">
              <span>
                <strong>{item.quantity}x</strong> {item.name}
                {item.addOns.length > 0 && (
                  <span className="text-xs text-gray-500"> ({item.addOns.map((a) => a.name).join(', ')})</span>
                )}
              </span>
              <span className="font-bold">
                ₹{(item.price + item.addOns.reduce((a, b) => a + b.price, 0)) * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-green-900/40 flex justify-between text-base font-extrabold">
          <span>Total Amount</span>
          <span>₹{order.total}</span>
        </div>
      </div>
    </div>
  );
};

export const OrderHistoryPage: React.FC = () => {
  const { orders, reorderPastOrder } = useApp();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Browser-Persisted Records
        </span>
        <h1 className="text-3xl font-extrabold mt-1">Your Demo Order History</h1>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="font-extrabold text-base">#{o.id}</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F0FDF4] dark:bg-green-950 text-brand-700 dark:text-brand-400">
                  {o.status}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(o.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                {o.canteenName} • Slot: {o.pickupSlotLabel}
              </p>
              <p className="text-xs text-[#667085]">
                {o.items.map((i) => \`\${i.quantity}x \${i.name}\`).join(', ')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-extrabold text-base mr-2">₹{o.total}</span>
              <Link
                to={\`/track/\${o.id}\`}
                className="px-3.5 py-2 rounded-xl border border-gray-200 dark:border-green-800 text-xs font-bold"
              >
                Track / Details
              </Link>
              <button
                onClick={() => {
                  reorderPastOrder(o);
                  navigate('/cart');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reorder
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};`,

  'src/pages/CanteenDashboardPage.tsx': `import React, { useState } from 'react';
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
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodItem, OrderStatus, CategoryId } from '../types';
import { CATEGORIES } from '../data/seed';

export const CanteenDashboardPage: React.FC = () => {
  const {
    orders,
    foods,
    slots,
    updateOrderStatus,
    toggleFoodAvailability,
    upsertFoodItem,
    deleteFoodItem,
    upsertSlot
  } = useApp();

  const [tab, setTab] = useState<'overview' | 'orders' | 'kds' | 'menu' | 'slots' | 'reports'>('overview');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Menu Modal State
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // New Slot State
  const [newSlotLabel, setNewSlotLabel] = useState('');
  const [newSlotTime, setNewSlotTime] = useState('');
  const [newSlotCap, setNewSlotCap] = useState(30);

  const activeOrders = orders.filter((o) => o.status !== 'Collected' && o.status !== 'Cancelled');
  const readyOrders = orders.filter((o) => o.status === 'Ready for Pickup');
  const completedOrders = orders.filter((o) => o.status === 'Collected');
  const sampleRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (orderSearch.trim() && !o.id.toLowerCase().includes(orderSearch.toLowerCase()) && !o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) {
      return false;
    }
    return true;
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
      id: \`slot-\${Date.now()}\`,
      label: newSlotLabel,
      timeRange: newSlotTime,
      capacity: newSlotCap,
      enabled: true
    });
    setNewSlotLabel('');
    setNewSlotTime('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-3.5 mb-6 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-amber-900 dark:text-amber-200">
          👨‍🍳 <strong>Canteen Operator Dashboard (Simulated):</strong> Any order status or menu updates you make here immediately update the Student Interface in this browser.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-1.5">
          {[
            { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
            { id: 'orders', label: \`Incoming Orders (\${activeOrders.length})\`, icon: ClipboardList },
            { id: 'kds', label: 'Kitchen Display (KDS)', icon: MonitorPlay },
            { id: 'menu', label: 'Menu & Availability', icon: Utensils },
            { id: 'slots', label: 'Pickup Slot Capacities', icon: CalendarClock },
            { id: 'reports', label: 'Sales & Slot Reports', icon: BarChart3 }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id as any)}
              className={\`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all \${
                tab === item.id
                  ? 'bg-[#14532D] text-white shadow-sm'
                  : 'bg-white dark:bg-[#122017] hover:bg-gray-100 dark:hover:bg-green-950/50 border border-gray-200 dark:border-green-900/40'
              }\`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Main Panel */}
        <section className="lg:col-span-9 space-y-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4">
                  <span className="text-xs text-gray-500">Orders Today (Demo)</span>
                  <p className="text-2xl font-extrabold mt-1">{orders.length}</p>
                </div>
                <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4">
                  <span className="text-xs text-gray-500">Active Kitchen Queue</span>
                  <p className="text-2xl font-extrabold text-amber-600 mt-1">{activeOrders.length}</p>
                </div>
                <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4">
                  <span className="text-xs text-gray-500">Ready for Pickup</span>
                  <p className="text-2xl font-extrabold text-green-600 mt-1">{readyOrders.length}</p>
                </div>
                <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4">
                  <span className="text-xs text-gray-500">Simulated Revenue</span>
                  <p className="text-2xl font-extrabold mt-1">₹{sampleRevenue}</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6">
                <h3 className="font-bold text-base mb-4">Pickup Slot Utilization</h3>
                <div className="space-y-3">
                  {slots.map((s) => {
                    const count = orders.filter((o) => o.pickupSlotId === s.id && o.status !== 'Cancelled').length;
                    const pct = Math.min(100, Math.round((count / s.capacity) * 100));
                    return (
                      <div key={s.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span>{s.label} ({s.timeRange})</span>
                          <span>{count} / {s.capacity} orders ({pct}%)</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div className="h-full bg-[#22C55E]" style={{ width: \`\${pct}%\` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-extrabold text-lg">Manage Demo Orders</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search token or student..."
                      className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-xs font-semibold rounded-xl border border-gray-200 dark:border-green-900 bg-gray-50 dark:bg-[#0B1510] px-3 py-1.5"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready for Pickup">Ready for Pickup</option>
                    <option value="Collected">Collected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredOrders.map((o) => (
                  <div
                    key={o.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-green-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm">#{o.id}</span>
                        <span className="text-xs font-semibold text-brand-700 dark:text-brand-400">
                          {o.pickupSlotLabel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-green-950 text-[11px] font-bold">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium">
                        {o.customerName} ({o.studentId}) • {o.paymentStatus}
                      </p>
                      <p className="text-xs text-gray-500">
                        {o.items.map((i) => \`\${i.quantity}x \${i.name}\`).join(', ')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {(['Accepted', 'Preparing', 'Ready for Pickup', 'Collected'] as OrderStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => updateOrderStatus(o.id, st)}
                          className={\`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all \${
                            o.status === st
                              ? 'bg-[#14532D] text-white border-[#14532D]'
                              : 'border-gray-200 dark:border-green-800 hover:bg-gray-100 dark:hover:bg-green-950'
                          }\`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'kds' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-xl">Kitchen Display Mode (High-Contrast Touch Screen)</h2>
                <span className="text-xs text-gray-500">Tap buttons to move tickets across the line</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'NEW / ACCEPTED', statuses: ['Placed', 'Accepted'], next: 'Preparing' as OrderStatus, color: 'border-amber-500' },
                  { title: 'ON THE GRIDDLE', statuses: ['Preparing'], next: 'Ready for Pickup' as OrderStatus, color: 'border-blue-500' },
                  { title: 'READY AT COUNTER', statuses: ['Ready for Pickup'], next: 'Collected' as OrderStatus, color: 'border-green-500' }
                ].map((col) => {
                  const colOrders = orders.filter((o) => col.statuses.includes(o.status));
                  return (
                    <div
                      key={col.title}
                      className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-black text-xs tracking-wider">{col.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-green-950 text-xs font-bold">
                          {colOrders.length}
                        </span>
                      </div>
                      {colOrders.map((o) => (
                        <div
                          key={o.id}
                          className={\`p-4 rounded-xl border-l-4 \${col.color} bg-gray-50 dark:bg-[#0B1510] space-y-2\`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-black">#{o.id}</span>
                            <span className="text-[11px] font-bold text-brand-700 dark:text-brand-400">
                              {o.pickupSlotLabel}
                            </span>
                          </div>
                          <ul className="text-sm font-bold space-y-1">
                            {o.items.map((item, idx) => (
                              <li key={idx}>
                                {item.quantity}x {item.name}
                              </li>
                            ))}
                          </ul>
                          {o.notes && (
                            <p className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 p-1.5 rounded">
                              Note: {o.notes}
                            </p>
                          )}
                          <button
                            onClick={() => updateOrderStatus(o.id, col.next)}
                            className="w-full py-2.5 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white text-xs font-extrabold"
                          >
                            Mark as {col.next} →
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === 'menu' && (
            <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-lg">Menu & Live Availability Editor</h2>
                <button
                  onClick={() =>
                    setEditingFood({
                      id: \`food-\${Date.now()}\`,
                      name: 'New Campus Special',
                      description: 'Freshly prepared canteen dish.',
                      price: 90,
                      category: 'snacks',
                      canteenId: 'canteen-central',
                      isVeg: true,
                      prepTimeMins: 8,
                      available: true,
                      popular: false,
                      stock: 25,
                      calories: 380,
                      allergens: [],
                      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
                      addOns: []
                    })
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Dish
                </button>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-green-900/30">
                {foods.map((f) => (
                  <div key={f.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={f.image} alt={f.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-sm">{f.name}</p>
                        <p className="text-xs text-gray-500">
                          ₹{f.price} • Prep: {f.prepTimeMins}m • Stock: {f.stock}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleFoodAvailability(f.id)}
                        className={\`px-3 py-1 rounded-lg text-xs font-bold \${
                          f.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }\`}
                      >
                        {f.available ? 'Available' : 'Sold Out'}
                      </button>
                      <button
                        onClick={() => setEditingFood(f)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-green-800"
                        aria-label="Edit Dish"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFoodItem(f.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        aria-label="Delete Dish"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'slots' && (
            <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-6">
              <h2 className="font-extrabold text-lg">Break Pickup Slot Configuration</h2>
              <div className="space-y-3">
                {slots.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-green-900/40 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-sm">{s.label}</p>
                      <p className="text-xs text-gray-500">{s.timeRange} • Max Capacity: {s.capacity} orders</p>
                    </div>
                    <button
                      onClick={() => upsertSlot({ ...s, enabled: !s.enabled })}
                      className={\`px-3 py-1.5 rounded-xl text-xs font-bold \${
                        s.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'
                      }\`}
                    >
                      {s.enabled ? 'Slot Enabled' : 'Disabled'}
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSlot} className="pt-4 border-t border-gray-200 dark:border-green-900 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Slot Name (e.g. Lab Break)"
                  value={newSlotLabel}
                  onChange={(e) => setNewSlotLabel(e.target.value)}
                  className="px-3 py-2 rounded-xl border text-xs bg-gray-50 dark:bg-[#0B1510]"
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 02:15 PM - 02:30 PM)"
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="px-3 py-2 rounded-xl border text-xs bg-gray-50 dark:bg-[#0B1510]"
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={newSlotCap}
                  onChange={(e) => setNewSlotCap(Number(e.target.value))}
                  className="px-3 py-2 rounded-xl border text-xs bg-gray-50 dark:bg-[#0B1510]"
                />
                <button type="submit" className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold">
                  + Add Pickup Slot
                </button>
              </form>
            </div>
          )}

          {tab === 'reports' && (
            <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="font-extrabold text-lg">Demonstration Analytics & Order Distribution</h2>
                <p className="text-xs text-gray-500">Calculated directly from current local browser orders.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0B1510]">
                  <span className="text-xs text-gray-500">Completed Pickups</span>
                  <p className="text-2xl font-extrabold text-green-600">{completedOrders.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0B1510]">
                  <span className="text-xs text-gray-500">Average Order Value</span>
                  <p className="text-2xl font-extrabold">
                    ₹{orders.length ? Math.round(sampleRevenue / orders.length) : 0}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#0B1510]">
                  <span className="text-xs text-gray-500">Active Menu Dishes</span>
                  <p className="text-2xl font-extrabold">{foods.filter((f) => f.available).length}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Edit Food Modal */}
      {editingFood && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveFood}
            className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-800 rounded-3xl max-w-lg w-full p-6 space-y-4"
          >
            <h3 className="font-extrabold text-lg">Edit Menu Item (Local Demo)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={editingFood.name}
                  onChange={(e) => setEditingFood({ ...editingFood, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingFood.price}
                  onChange={(e) => setEditingFood({ ...editingFood, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Category</label>
                <select
                  value={editingFood.category}
                  onChange={(e) => setEditingFood({ ...editingFood, category: e.target.value as CategoryId })}
                  className="w-full px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Prep Time (Mins)</label>
                <input
                  type="number"
                  value={editingFood.prepTimeMins}
                  onChange={(e) => setEditingFood({ ...editingFood, prepTimeMins: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                />
              </div>
            </div>
            <div className="text-xs">
              <label className="font-bold block mb-1">Description</label>
              <textarea
                rows={2}
                value={editingFood.description}
                onChange={(e) => setEditingFood({ ...editingFood, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingFood(null)}
                className="px-4 py-2 rounded-xl border text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold">
                Save Dish
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};`,

  'src/pages/AdminAndProfilePages.tsx': `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  RotateCcw,
  Users,
  Store,
  Settings,
  User,
  Heart,
  ClipboardList,
  LogOut,
  Plus,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FoodCard } from '../components/FoodCard';

export const AdminDashboardPage: React.FC = () => {
  const {
    orders,
    canteens,
    demoUsers,
    settings,
    upsertCanteen,
    upsertDemoUser,
    removeDemoUser,
    updateSettings,
    resetAllDemoData
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Student' | 'Canteen Operator' | 'Campus Admin'>('Student');
  const [newUserDept, setNewUserDept] = useState('');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    upsertDemoUser({
      id: \`u-\${Date.now()}\`,
      name: newUserName,
      role: newUserRole,
      departmentOrCanteen: newUserDept || 'General Campus',
      status: 'Active'
    });
    setNewUserName('');
    setNewUserDept('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="bg-green-950 text-white rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded bg-[#22C55E] text-[#0B2E1B] text-[10px] font-black uppercase">
            SaaS Multi-Canteen Admin Preview (Frontend Simulation)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-2">SUK Administration Console</h1>
          <p className="text-xs text-green-200 mt-1">
            Manage demonstration canteens, sample directory listings, and reset browser localStorage state.
          </p>
        </div>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset All Demo Data
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-red-950 p-2 rounded-xl border border-red-700">
            <span className="text-xs font-bold px-2">Restore initial seed data?</span>
            <button
              onClick={() => {
                resetAllDemoData();
                setConfirmReset(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-extrabold"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-5">
          <span className="text-xs text-gray-500">Total Demo Orders</span>
          <p className="text-3xl font-extrabold mt-1">{orders.length}</p>
        </div>
        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-5">
          <span className="text-xs text-gray-500">Active Campus Canteens</span>
          <p className="text-3xl font-extrabold mt-1">{canteens.filter((c) => c.isOpen).length} / {canteens.length}</p>
        </div>
        <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-5">
          <span className="text-xs text-gray-500">Sample Directory Users</span>
          <p className="text-3xl font-extrabold mt-1">{demoUsers.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Canteen Management */}
        <div className="lg:col-span-6 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <Store className="w-4 h-4 text-brand-600" /> Canteen Vendor Controls
          </h2>
          <div className="space-y-3">
            {canteens.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl border border-gray-200 dark:border-green-900/40 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.location} • Prep: {c.prepEstimate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => upsertCanteen({ ...c, isOpen: !c.isOpen })}
                    className={\`px-3 py-1 rounded-lg text-xs font-bold \${
                      c.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }\`}
                  >
                    {c.isOpen ? 'Open' : 'Closed'}
                  </button>
                  <Link
                    to={\`/canteen/\${c.id}\`}
                    className="px-2.5 py-1 rounded-lg border text-xs font-semibold"
                  >
                    Menu
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Settings */}
        <div className="lg:col-span-6 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
          <h2 className="font-extrabold text-base flex items-center gap-2">
            <Settings className="w-4 h-4 text-brand-600" /> Global Prototype Settings
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Brand Display Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => updateSettings({ brandName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Sample Operating Hours</label>
              <input
                type="text"
                value={settings.operatingHours}
                onChange={(e) => updateSettings({ operatingHours: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Demonstration Token Fee (₹)</label>
              <input
                type="number"
                value={settings.platformFeeRs}
                onChange={(e) => updateSettings({ platformFeeRs: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fictional User Directory */}
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
        <h2 className="font-extrabold text-base flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-600" /> Sample Student & Staff Directory (Fictional Demo Records)
        </h2>
        <div className="divide-y divide-gray-100 dark:divide-green-900/30">
          {demoUsers.map((u) => (
            <div key={u.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-sm">{u.name}</span>
                <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-green-950 font-semibold">
                  {u.role}
                </span>
                <span className="ml-2 text-gray-500">{u.departmentOrCanteen}</span>
              </div>
              <button
                onClick={() => removeDemoUser(u.id)}
                className="text-red-500 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddUser} className="pt-4 border-t grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <input
            type="text"
            placeholder="Fictional Name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value as any)}
            className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
          >
            <option value="Student">Student</option>
            <option value="Canteen Operator">Canteen Operator</option>
            <option value="Campus Admin">Campus Admin</option>
          </select>
          <input
            type="text"
            placeholder="Department or Canteen"
            value={newUserDept}
            onChange={(e) => setNewUserDept(e.target.value)}
            className="px-3 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
          />
          <button type="submit" className="px-4 py-2 rounded-xl bg-[#14532D] text-white font-bold flex items-center justify-center gap-1">
            <Plus className="w-4 h-4" /> Add Demo Record
          </button>
        </form>
      </div>
    </div>
  );
};

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, favorites, foods, orders, theme, toggleTheme } = useApp();
  const favFoods = foods.filter((f) => favorites.includes(f.id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#14532D] text-white flex items-center justify-center font-extrabold text-2xl">
            {profile.name.charAt(0)}
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#14532D] text-[10px] font-bold uppercase">
              Local Demo Student Profile
            </span>
            <h1 className="text-2xl font-extrabold mt-1">{profile.name}</h1>
            <p className="text-xs text-[#667085]">
              ID: {profile.studentId} • {profile.department}
            </p>
          </div>
        </div>

        <button
          onClick={() => updateProfile({ isLoggedInDemo: !profile.isLoggedInDemo })}
          className="px-4 py-2 rounded-xl border border-gray-200 dark:border-green-800 text-xs font-bold flex items-center gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          {profile.isLoggedInDemo ? 'Switch to Guest Demo Mode' : 'Activate Demo Student Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold text-base flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" /> Edit Local Profile & Preferences
          </h2>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Student Registration ID</label>
              <input
                type="text"
                value={profile.studentId}
                onChange={(e) => updateProfile({ studentId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">Class / Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => updateProfile({ department: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="font-bold">Color Theme</span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-green-950 font-semibold capitalize"
              >
                {theme} Mode
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-brand-600" /> Recent Demo Orders ({orders.length})
              </h2>
              <Link to="/orders" className="text-xs font-bold text-brand-700 hover:underline">
                Full History →
              </Link>
            </div>
            <div className="space-y-2.5">
              {orders.slice(0, 3).map((o) => (
                <div
                  key={o.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#0B1510] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold">#{o.id}</span> • {o.canteenName} ({o.pickupSlotLabel})
                  </div>
                  <Link to={\`/track/\${o.id}\`} className="font-bold text-brand-700 hover:underline">
                    {o.status} →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Favourites */}
      <div>
        <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Saved Favourite Dishes ({favFoods.length})
        </h2>
        {favFoods.length === 0 ? (
          <p className="text-xs text-gray-500">Tap the heart icon on any dish to save it here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favFoods.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};`,

  'src/pages/InfoAndStaticPages.tsx': `import React, { useState } from 'react';
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
  ShieldCheck
} from 'lucide-react';
import { CONTACT_CONFIG } from '../data/seed';

export const AboutPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
    <div>
      <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
        Project Concept & Vision
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold mt-1">About SUK</h1>
    </div>
    <p className="text-base text-[#667085] dark:text-gray-300 leading-relaxed">
      Across college campuses, hundreds of students pour out of lecture halls simultaneously for a 15-to-20-minute break. Traditional canteen counters get overwhelmed with dual bottlenecks: first waiting in line to pay for a paper token, and then crowding around the kitchen pass waiting for food to be cooked.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-2">Why SUK Was Conceptualized</h3>
        <p className="text-xs text-[#667085] dark:text-gray-400 leading-relaxed">
          SUK decouples ordering from physical queuing. Students browse live menus before the bell rings, lock in a capacity-controlled 15-minute pickup slot, and walk straight to the express pickup counter when their order status turns Ready.
        </p>
      </div>
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6">
        <h3 className="font-bold text-lg mb-2">Frontend Prototype Architecture</h3>
        <p className="text-xs text-[#667085] dark:text-gray-400 leading-relaxed">
          This application is a complete, installable Progressive Web App (PWA) prototype running entirely in your browser via React, TypeScript, and localStorage synchronization—allowing instant demonstration of the Student App, Kitchen Display System, and Admin Portal without server setup.
        </p>
      </div>
    </div>
  </div>
);

export const HowItWorksPage: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
    <div className="text-center max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold">How Pre-Ordering Works</h1>
      <p className="text-sm text-[#667085] mt-2">
        From classroom tap to canteen counter collection in four predictable steps.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: '1. Select Canteen & Dish',
          body: 'Browse Campus Central Canteen, Green Bowl Kitchen, The Snack Corner, or Campus Coffee House. Filter by veg/non-veg, prep time, or price.'
        },
        {
          title: '2. Pick Your Break Window',
          body: 'Each 15-minute break slot has a realistic kitchen capacity cap so canteen staff can batch-cook orders cleanly.'
        },
        {
          title: '3. Simulated Online or Counter Payment',
          body: 'Test the simulated online checkout flow or choose Pay at Counter. A unique token reference (e.g., #CB-4829) is saved immediately.'
        },
        {
          title: '4. Live Kitchen Status Updates',
          body: 'Follow your token from Placed → Accepted → Preparing → Ready for Pickup. Test status changes live via the Canteen Dashboard.'
        }
      ].map((step) => (
        <div
          key={step.title}
          className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6"
        >
          <h3 className="font-bold text-base text-brand-700 dark:text-brand-400">{step.title}</h3>
          <p className="text-xs text-[#667085] dark:text-gray-300 mt-2 leading-relaxed">{step.body}</p>
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
          <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
            Campus Support Desk (Demo)
          </span>
          <h1 className="text-3xl font-extrabold mt-1">Contact Us</h1>
          <p className="text-xs text-[#667085] mt-2">
            Have feedback on the SUK prototype or want to onboard a new college vendor?
          </p>
        </div>
        <div className="space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Email (Placeholder)</p>
              <p className="text-gray-500">{CONTACT_CONFIG.supportEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Campus Desk</p>
              <p className="text-gray-500">{CONTACT_CONFIG.campusDesk}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Hours</p>
              <p className="text-gray-500">{CONTACT_CONFIG.helplineHours}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-3xl p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-lg font-extrabold">Demonstration Message Recorded Locally</h3>
            <p className="text-xs text-[#667085] max-w-md mx-auto">
              Because SUK is running in frontend-only prototype mode without a backend mail server, no real email was dispatched.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setSubject('');
                setMessage('');
              }}
              className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold"
            >
              Send Another Demo Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h2 className="font-bold text-base">Send Feedback (Frontend Simulation)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Campus Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
                />
              </div>
            </div>
            <div>
              <label className="font-bold block mb-1">Subject *</label>
              <input
                type="text"
                required
                maxLength={80}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">
                Message * ({message.length}/400 chars)
              </label>
              <textarea
                rows={4}
                required
                maxLength={400}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border bg-gray-50 dark:bg-[#0B1510]"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-bold text-xs"
            >
              Submit Demo Inquiry
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const FAQ_ITEMS = [
  {
    q: 'How does classroom pre-ordering work?',
    a: 'Select items from a single campus canteen, pick an available 15-minute break slot, and place your demo order. Your order reference is generated immediately.'
  },
  {
    q: 'Are online payments real in this prototype?',
    a: 'No. Online Payment — Demo simulates a payment screen so you can test both successful and declined payment states without entering any card or banking credentials.'
  },
  {
    q: 'How do I test real-time order tracking updates?',
    a: 'Open the Order Tracking page, and either use the built-in "Advance Stage" demo button or switch to the Canteen Dashboard to update the order status. Both views share browser localStorage.'
  },
  {
    q: 'What happens if an item sells out?',
    a: 'Canteen operators can toggle item availability in the Menu tab of the Canteen Dashboard. Sold-out items immediately display a badge and cannot be added to student carts.'
  },
  {
    q: 'Can I install SUK as a Progressive Web App (PWA)?',
    a: 'Yes! SUK includes a standard webmanifest and service worker. Use your browser’s "Install App" or "Add to Home Screen" action for standalone launch and offline menu caching.'
  }
];

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-brand-700 dark:text-brand-400">
          Got Questions?
        </span>
        <h1 className="text-3xl font-extrabold mt-1">Frequently Asked Questions</h1>
      </div>
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm flex items-center justify-between"
              >
                <span>{item.q}</span>
                <ChevronDown className={\`w-4 h-4 transition-transform \${isOpen ? 'rotate-180' : ''}\`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 text-xs text-[#667085] dark:text-gray-300 leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const HelpCenterPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
    <div className="flex items-center gap-2 text-brand-700 dark:text-brand-400">
      <HelpCircle className="w-6 h-6" />
      <h1 className="text-3xl font-extrabold text-[#17211B] dark:text-white">SUK Help Center</h1>
    </div>
    <p className="text-sm text-[#667085]">
      Quick guides for testing every part of the SUK college canteen pre-ordering prototype:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div className="p-5 rounded-2xl bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 space-y-2">
        <h3 className="font-bold text-sm">Testing Student Flow</h3>
        <p className="text-gray-500">Add items to your cart, test the single-canteen cart protection modal, and schedule a pickup slot.</p>
        <Link to="/menu" className="text-brand-700 font-bold block pt-1">Go to Menu →</Link>
      </div>
      <div className="p-5 rounded-2xl bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 space-y-2">
        <h3 className="font-bold text-sm">Testing Kitchen Display</h3>
        <p className="text-gray-500">Switch to the Canteen Dashboard and use Kitchen Display Mode to bump orders to Ready for Pickup.</p>
        <Link to="/canteen-dashboard" className="text-brand-700 font-bold block pt-1">Open Canteen Dashboard →</Link>
      </div>
      <div className="p-5 rounded-2xl bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 space-y-2">
        <h3 className="font-bold text-sm">Resetting Demo State</h3>
        <p className="text-gray-500">Edited the menu or placed many test orders? Use the Admin Console to restore factory seed data.</p>
        <Link to="/admin" className="text-brand-700 font-bold block pt-1">Open Admin Console →</Link>
      </div>
    </div>
  </div>
);

export const PolicyPage: React.FC<{ type: 'privacy' | 'terms' | 'refund' }> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy (Demonstration Prototype)',
    terms: 'Terms & Conditions (Demonstration Prototype)',
    refund: 'Cancellation & Refund Policy (Demonstration Prototype)'
  };
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
        <ShieldCheck className="w-4 h-4" /> Sample Demonstration Policy — Not Legal Advice
      </div>
      <h1 className="text-3xl font-extrabold">{titles[type]}</h1>
      <div className="bg-white dark:bg-[#122017] border border-gray-200 dark:border-green-900/40 rounded-2xl p-6 space-y-3 text-xs text-[#667085] dark:text-gray-300 leading-relaxed">
        <p>
          <strong>1. Local-Only Browser Storage:</strong> SUK is a frontend demonstration prototype. Any orders, cart items, profile names, or menu edits you create are saved strictly inside your browser's <code>localStorage</code> and are never transmitted to an external server.
        </p>
        <p>
          <strong>2. Simulated Payments Only:</strong> No real payment gateway is connected. Selecting "Online Payment — Demo" or "Pay at Counter" simulates order states for academic and product demonstration purposes only.
        </p>
        <p>
          <strong>3. Order Cancellations in Demo Mode:</strong> Orders in the "Placed" stage can be cancelled immediately from the Order Tracking screen or the Canteen Operator Dashboard. You can wipe all stored browser data at any time from the Admin Dashboard.
        </p>
      </div>
    </div>
  );
};

export const OfflineFallbackPage: React.FC = () => {
  const { orders, foods } = useApp();
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
        <WifiOff className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold">Offline Mode & Cached PWA State</h1>
      <p className="text-sm text-[#667085] dark:text-gray-400 max-w-lg mx-auto">
        SUK caches static application assets and preserves your local menu ({foods.length} dishes) and saved demo orders ({orders.length} orders) inside your browser even when campus Wi-Fi drops.
      </p>
      <div className="flex justify-center gap-3">
        <Link to="/menu" className="px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
          Browse Cached Menu
        </Link>
        <Link to="/orders" className="px-5 py-2.5 rounded-xl border text-xs font-bold">
          View Saved Browser Orders
        </Link>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => (
  <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
    <Compass className="w-12 h-12 text-brand-600 mx-auto" />
    <h1 className="text-3xl font-extrabold">404 — Page Not On The Menu</h1>
    <p className="text-xs text-[#667085]">
      The route you visited doesn't exist in SUK. Head back to the main quad or explore the live canteen menu.
    </p>
    <div className="flex justify-center gap-3">
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-[#14532D] text-white text-xs font-bold">
        Back to Home
      </Link>
      <Link to="/menu" className="px-5 py-2.5 rounded-xl border text-xs font-bold">
        Explore Menu
      </Link>
    </div>
  </div>
);`,

  'src/App.tsx': `import React from 'react';
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

export default App;`,

  'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration optional during local dev
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', filePath);
}

console.log('\\n✅ SUK PWA project extracted! Run:\\n  npm install\\n  npm run dev');