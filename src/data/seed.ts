import { Canteen, FoodItem, PickupSlot, Order, StaffUser, AppSettings } from '../types';

export const CATEGORIES = [
  { id: 'snacks', name: 'Snacks & Quick Bites', icon: 'Flame', count: 'Fast-prep', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
  { id: 'meals', name: 'Meals & Thalis', icon: 'Utensils', count: 'Hearty plates', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { id: 'burgers', name: 'Burgers & Rolls', icon: 'Sandwich', count: 'Fresh grilled', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'pizza', name: 'Stone-Oven Pizza', icon: 'Pizza', count: 'Hand tossed', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80' },
  { id: 'beverages', name: 'Cold Beverages', icon: 'CupSoda', count: 'Chilled refreshers', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
  { id: 'coffee', name: 'Artisan Coffee & Chai', icon: 'Coffee', count: 'Fresh brew', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80' },
  { id: 'desserts', name: 'Desserts & Bakes', icon: 'IceCream', count: 'Sweet treats', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80' },
  { id: 'healthy', name: 'Protein & Health Bowls', icon: 'Salad', count: 'High protein', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
] as const;

export const INITIAL_CANTEENS: Canteen[] = [
  {
    id: 'canteen-central',
    name: 'Campus Central Dining',
    description: 'The primary campus dining hall serving traditional South & North Indian hot meals, crispy dosas, fresh parathas, and masala chai.',
    categories: ['Meals & Thalis', 'Snacks & Quick Bites', 'Artisan Coffee & Chai'],
    isOpen: true,
    prepEstimate: '8–12 mins',
    location: 'Ground Floor, Academic Block A',
    rating: 4.8,
    pickupCounter: 'Express Counter 1 & 2',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-greenbowl',
    name: 'Green Bowl Kitchen',
    description: 'Nutrition-focused kitchen delivering macro-balanced high-protein rice bowls, grilled chicken, tossed paneer salads, and cold-pressed juices.',
    categories: ['Protein & Health Bowls', 'Burgers & Rolls', 'Cold Beverages'],
    isOpen: true,
    prepEstimate: '6–10 mins',
    location: 'Sports Complex Wing, Ground Floor',
    rating: 4.9,
    pickupCounter: 'Nutrition Bar Counter A',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-snackcorner',
    name: 'The Break Corner',
    description: 'Fast-moving break hotspot famous for hand-crafted smash burgers, stone-baked personal pizzas, loaded peri-peri fries, and thick shakes.',
    categories: ['Burgers & Rolls', 'Stone-Oven Pizza', 'Snacks & Quick Bites', 'Desserts & Bakes'],
    isOpen: true,
    prepEstimate: '10–14 mins',
    location: 'Student Activity Hub, Central Courtyard',
    rating: 4.7,
    pickupCounter: 'Fast Track Window 3',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 'canteen-coffeehouse',
    name: 'Campus Roasters & Cafe',
    description: 'Specialty arabica brew bar, single-origin cold brews, spiced masala degree coffee, flaky pastries, and warm fudge brownies.',
    categories: ['Artisan Coffee & Chai', 'Desserts & Bakes', 'Cold Beverages'],
    isOpen: true,
    prepEstimate: '4–7 mins',
    location: 'Central Library Atrium, 1st Floor',
    rating: 4.8,
    pickupCounter: 'Barista Pass Window',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80'
  }
];

export const INITIAL_FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Ghee Roast Masala Dosa + Filter Coffee',
    description: 'Golden fermented crepe roasted in A2 pure ghee with spiced potato onion mash, served with fresh coconut chutney, tomato sambar, and hot brass-tumbler filter coffee.',
    price: 95,
    category: 'meals',
    canteenId: 'canteen-central',
    isVeg: true,
    prepTimeMins: 8,
    available: true,
    popular: true,
    stock: 45,
    calories: 480,
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-ghee', name: 'Extra Pure Ghee Roast', price: 20 },
      { id: 'ao-vada', name: 'Crispy Medu Vada (1 pc)', price: 25 },
      { id: 'ao-chutney', name: 'Extra Coconut Chutney Cup', price: 10 }
    ]
  },
  {
    id: 'food-2',
    name: 'Delhi Style Samosa Chaat Bowl',
    description: 'Two golden flaky samosas crushed and layered with spiced chole curry, chilled sweet curd, tangy tamarind drizzle, fresh mint dip, and crunchy nylon sev.',
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
      { id: 'ao-curd', name: 'Extra Whipped Dahi', price: 15 },
      { id: 'ao-sev', name: 'Extra Sev & Pomegranate', price: 10 }
    ]
  },
  {
    id: 'food-3',
    name: 'Royal Paneer Butter Masala Executive Thali',
    description: 'Slow-simmered rich tomato-cashew paneer gravy, dal makhani, cumin fragrant basmati rice, 2 whole wheat butter rotis, cucumber raita, and hot gulab jamun.',
    price: 145,
    category: 'meals',
    canteenId: 'canteen-central',
    isVeg: true,
    prepTimeMins: 11,
    available: true,
    popular: true,
    stock: 35,
    calories: 760,
    allergens: ['Dairy', 'Nuts', 'Gluten'],
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-roti', name: 'Extra Butter Roti', price: 18 },
      { id: 'ao-lassi', name: 'Sweet Malai Lassi Glass', price: 35 }
    ]
  },
  {
    id: 'food-4',
    name: 'Hyderabadi Chicken Dum Biryani',
    description: 'Aged long-grain basmati rice infused with saffron, caramelized birista, fresh mint, and tender bone-in chicken slow cooked under sealed steam, with mirchi salan & raita.',
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
      { id: 'ao-egg', name: 'Hard Boiled Spiced Egg', price: 15 },
      { id: 'ao-raita', name: 'Extra Boondi Raita', price: 20 }
    ]
  },
  {
    id: 'food-5',
    name: 'Chargrilled Peri-Peri Chicken Protein Bowl',
    description: '180g flame-grilled chicken breast seasoned with zesty peri-peri spice on herb brown rice, charred broccoli, sweet corn salsa, avocado dressing, and pickled cabbage.',
    price: 175,
    category: 'healthy',
    canteenId: 'canteen-greenbowl',
    isVeg: false,
    prepTimeMins: 8,
    available: true,
    popular: true,
    stock: 40,
    calories: 540,
    allergens: [],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-prot', name: 'Extra 60g Grilled Chicken Breast', price: 55 },
      { id: 'ao-egg2', name: 'Organic Poached Egg', price: 20 },
      { id: 'ao-avo', name: 'Fresh Guacamole Scoop', price: 35 }
    ]
  },
  {
    id: 'food-6',
    name: 'Avocado Paneer Power Crunch Bowl',
    description: 'Golden tandoori paneer skewers, organic quinoa, baby spinach, roasted bell peppers, cucumbers, chia seeds, and light lemon herb dressing.',
    price: 155,
    category: 'healthy',
    canteenId: 'canteen-greenbowl',
    isVeg: true,
    prepTimeMins: 7,
    available: true,
    popular: false,
    stock: 30,
    calories: 460,
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-paneer', name: 'Extra 50g Tandoori Paneer', price: 40 },
      { id: 'ao-seeds', name: 'Toasted Seeds Mix', price: 15 }
    ]
  },
  {
    id: 'food-7',
    name: 'Mediterranean Grilled Chicken Wrap',
    description: 'Tender garlic herb chicken, crisp iceberg lettuce, tomatoes, pickled gherkins, and homemade garlic tahini spread rolled tightly in warm flatbread.',
    price: 125,
    category: 'burgers',
    canteenId: 'canteen-greenbowl',
    isVeg: false,
    prepTimeMins: 6,
    available: true,
    popular: true,
    stock: 45,
    calories: 490,
    allergens: ['Gluten', 'Sesame'],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-cheese', name: 'Melted Cheddar Slice', price: 20 },
      { id: 'ao-jalapeno', name: 'Spicy Jalapeno Relish', price: 15 }
    ]
  },
  {
    id: 'food-8',
    name: 'Crispy Double Smash Cheeseburger',
    description: 'Two smashed prime patties seared on cast iron with caramelized onions, double American cheese slices, secret house sauce, in a toasted brioche bun.',
    price: 140,
    category: 'burgers',
    canteenId: 'canteen-snackcorner',
    isVeg: false,
    prepTimeMins: 9,
    available: true,
    popular: true,
    stock: 50,
    calories: 680,
    allergens: ['Gluten', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-bacon', name: 'Crispy Strips (Halal Chicken)', price: 30 },
      { id: 'ao-patty', name: 'Extra Smash Patty + Cheese', price: 50 }
    ]
  },
  {
    id: 'food-9',
    name: 'Artisan Margherita Burrata Pizza',
    description: 'Slow-fermented sourdough pizza topped with San Marzano tomato sauce, fresh mozzarella pearls, torn basil leaves, and cold-pressed extra virgin olive oil.',
    price: 185,
    category: 'pizza',
    canteenId: 'canteen-snackcorner',
    isVeg: true,
    prepTimeMins: 12,
    available: true,
    popular: true,
    stock: 25,
    calories: 720,
    allergens: ['Gluten', 'Dairy'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-mozz', name: 'Double Mozzarella Crust', price: 35 },
      { id: 'ao-olives', name: 'Kalamata Black Olives', price: 25 }
    ]
  },
  {
    id: 'food-10',
    name: 'Loaded Peri-Peri Crinkle Fries',
    description: 'Golden double-fried potato crinkles tossed in hot African bird’s eye chili seasoning, drenched in warm cheddar cheese sauce and garlic mayo drizzle.',
    price: 75,
    category: 'snacks',
    canteenId: 'canteen-snackcorner',
    isVeg: true,
    prepTimeMins: 6,
    available: true,
    popular: true,
    stock: 70,
    calories: 390,
    allergens: ['Dairy'],
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-dip', name: 'Smoked Chipotle Dip', price: 20 },
      { id: 'ao-baconbits', name: 'Crispy Herb Toppings', price: 15 }
    ]
  },
  {
    id: 'food-11',
    name: 'Iced Spanish Hazelnut Latte',
    description: 'Double shot of freshly pulled dark roast espresso shaken with sweet condensed milk, roasted hazelnut syrup, cold whole milk, and clear crystal ice.',
    price: 110,
    category: 'coffee',
    canteenId: 'canteen-coffeehouse',
    isVeg: true,
    prepTimeMins: 4,
    available: true,
    popular: true,
    stock: 80,
    calories: 220,
    allergens: ['Dairy', 'Nuts'],
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-oat', name: 'Switch to Barista Oat Milk', price: 25 },
      { id: 'ao-shot', name: 'Extra Espresso Shot', price: 20 }
    ]
  },
  {
    id: 'food-12',
    name: 'Warm Belgian Chocolate Fudge Brownie',
    description: 'Decadent 70% dark Belgian cocoa brownie served hot with a drizzle of salted caramel sauce and toasted walnut crunch.',
    price: 85,
    category: 'desserts',
    canteenId: 'canteen-coffeehouse',
    isVeg: true,
    prepTimeMins: 4,
    available: true,
    popular: true,
    stock: 40,
    calories: 380,
    allergens: ['Gluten', 'Dairy', 'Nuts'],
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    addOns: [
      { id: 'ao-vanilla', name: 'Vanilla Bean Gelato Scoop', price: 30 },
      { id: 'ao-fudge', name: 'Hot Dark Chocolate Fudge Shot', price: 20 }
    ]
  }
];

export const INITIAL_PICKUP_SLOTS: PickupSlot[] = [
  { id: 'slot-1', label: 'Morning Break Slot A', timeRange: '10:30 AM – 10:45 AM', capacity: 35, enabled: true },
  { id: 'slot-2', label: 'Morning Break Slot B', timeRange: '11:00 AM – 11:15 AM', capacity: 35, enabled: true },
  { id: 'slot-3', label: 'Lunch Express Slot 1', timeRange: '12:45 PM – 01:00 PM', capacity: 50, enabled: true },
  { id: 'slot-4', label: 'Lunch Peak Slot 2', timeRange: '01:00 PM – 01:15 PM', capacity: 60, enabled: true },
  { id: 'slot-5', label: 'Lunch Late Slot 3', timeRange: '01:30 PM – 01:45 PM', capacity: 40, enabled: true },
  { id: 'slot-6', label: 'Evening Tea & Snacks', timeRange: '04:15 PM – 04:30 PM', capacity: 40, enabled: true },
  { id: 'slot-7', label: 'Hostel Evening Window', timeRange: '05:00 PM – 05:15 PM', capacity: 30, enabled: true }
];

const now = Date.now();
const order1Placed = new Date(now - 1000 * 60 * 18).toISOString();
const order1Accepted = new Date(now - 1000 * 60 * 16).toISOString();
const order1PrepStart = new Date(now - 1000 * 60 * 12).toISOString();
const order1EstReady = new Date(now + 1000 * 60 * 4).toISOString();

const order2Placed = new Date(now - 1000 * 60 * 35).toISOString();
const order2Accepted = new Date(now - 1000 * 60 * 33).toISOString();
const order2PrepStart = new Date(now - 1000 * 60 * 25).toISOString();
const order2Ready = new Date(now - 1000 * 60 * 5).toISOString();
const order2EstReady = new Date(now - 1000 * 60 * 7).toISOString();

const order3Placed = new Date(now - 1000 * 60 * 110).toISOString();
const order3Accepted = new Date(now - 1000 * 60 * 108).toISOString();
const order3PrepStart = new Date(now - 1000 * 60 * 102).toISOString();
const order3Ready = new Date(now - 1000 * 60 * 95).toISOString();
const order3Collected = new Date(now - 1000 * 60 * 88).toISOString();
const order3EstReady = new Date(now - 1000 * 60 * 97).toISOString();

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'CB-20261018-0042',
    createdAt: order1Placed,
    placedAt: order1Placed,
    updatedAt: order1PrepStart,
    prepDurationMins: 14,
    estimatedReadyAt: order1EstReady,
    scheduledPickupTime: '01:00 PM – 01:15 PM',
    prepStartedAt: order1PrepStart,
    paidAt: order1Placed,
    canteenId: 'canteen-central',
    canteenName: 'Campus Central Dining',
    customerName: 'Campus Member',
    studentId: '24STU101',
    contact: 'student@campus.ac.in',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-4',
    pickupSlotLabel: 'Lunch Peak Slot 2 (01:00 PM – 01:15 PM)',
    items: [
      {
        foodId: 'food-1',
        name: 'Ghee Roast Masala Dosa + Filter Coffee',
        price: 95,
        quantity: 1,
        addOns: [{ id: 'ao-ghee', name: 'Extra Pure Ghee Roast', price: 20 }],
        isVeg: true
      },
      {
        foodId: 'food-2',
        name: 'Delhi Style Samosa Chaat Bowl',
        price: 65,
        quantity: 1,
        addOns: [],
        isVeg: true
      }
    ],
    subtotal: 180,
    PlatformFee: 5,
    total: 185,
    paymentMethod: 'UPI / Card Online',
    paymentStatus: 'Paid',
    status: 'Preparing',
    notes: 'Please make the dosa extra crisp!',
    statusHistory: [
      { status: 'Placed', timestamp: order1Placed, note: 'Order placed & payment verified via UPI' },
      { status: 'Accepted', timestamp: order1Accepted, note: 'Central Dining ticket accepted at Station 1' },
      { status: 'Preparing', timestamp: order1PrepStart, note: 'Dosa on cast iron griddle, tea brewing' }
    ]
  },
  {
    id: 'CB-20261018-0038',
    createdAt: order2Placed,
    placedAt: order2Placed,
    updatedAt: order2Ready,
    prepDurationMins: 10,
    estimatedReadyAt: order2EstReady,
    scheduledPickupTime: '12:45 PM – 01:00 PM',
    prepStartedAt: order2PrepStart,
    readyAt: order2Ready,
    paidAt: order2Placed,
    canteenId: 'canteen-greenbowl',
    canteenName: 'Green Bowl Kitchen',
    customerName: 'Campus Member',
    studentId: '24STU211',
    contact: 'member@campus.ac.in',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-3',
    pickupSlotLabel: 'Lunch Express Slot 1 (12:45 PM – 01:00 PM)',
    items: [
      {
        foodId: 'food-5',
        name: 'Chargrilled Peri-Peri Chicken Protein Bowl',
        price: 175,
        quantity: 1,
        addOns: [{ id: 'ao-prot', name: 'Extra 60g Grilled Chicken Breast', price: 55 }],
        isVeg: false
      }
    ],
    subtotal: 230,
    PlatformFee: 5,
    total: 235,
    paymentMethod: 'Campus Meal Card',
    paymentStatus: 'Paid',
    status: 'Ready for Pickup',
    statusHistory: [
      { status: 'Placed', timestamp: order2Placed, note: 'Pre-ordered via Campus Meal Card' },
      { status: 'Accepted', timestamp: order2Accepted, note: 'Green Bowl kitchen confirmed recipe prep' },
      { status: 'Preparing', timestamp: order2PrepStart, note: 'Flame-grill sear in progress' },
      { status: 'Ready for Pickup', timestamp: order2Ready, note: 'Waiting at Nutrition Bar Counter A' }
    ]
  },
  {
    id: 'CB-20261018-0029',
    createdAt: order3Placed,
    placedAt: order3Placed,
    updatedAt: order3Collected,
    prepDurationMins: 6,
    estimatedReadyAt: order3EstReady,
    scheduledPickupTime: '10:30 AM – 10:45 AM',
    prepStartedAt: order3PrepStart,
    readyAt: order3Ready,
    completedAt: order3Collected,
    canteenId: 'canteen-coffeehouse',
    canteenName: 'Campus Roasters & Cafe',
    customerName: 'Campus Member',
    studentId: '23STU088',
    contact: 'student2@campus.ac.in',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupSlotId: 'slot-1',
    pickupSlotLabel: 'Morning Break Slot A (10:30 AM – 10:45 AM)',
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
    paymentStatus: 'Paid',
    status: 'Completed',
    statusHistory: [
      { status: 'Placed', timestamp: order3Placed, note: 'Reserved for morning break' },
      { status: 'Accepted', timestamp: order3Accepted, note: 'Barista pass received' },
      { status: 'Preparing', timestamp: order3PrepStart, note: 'Espresso pulled and shaken' },
      { status: 'Ready for Pickup', timestamp: order3Ready, note: 'Chilled at Barista Pass Window' },
      { status: 'Completed', timestamp: order3Collected, note: 'Student collected at counter' }
    ]
  }
];

export const INITIAL_STAFF_USERS: StaffUser[] = [
  { id: 'u-1', name: 'Student Representative', role: 'Student', departmentOrCanteen: 'Student Council', email: 'council@campus.ac.in', status: 'Active' },
  { id: 'u-2', name: 'Campus Scholar', role: 'Student', departmentOrCanteen: 'Undergraduate Program', email: 'scholar@campus.ac.in', status: 'Active' },
  { id: 'u-3', name: 'Central Kitchen Manager', role: 'Canteen Operator', departmentOrCanteen: 'Campus Central Dining', email: 'central.kitchen@campus.ac.in', status: 'Active' },
  { id: 'u-4', name: 'Green Bowl Kitchen Lead', role: 'Canteen Operator', departmentOrCanteen: 'Green Bowl Kitchen', email: 'greenbowl.kitchen@campus.ac.in', status: 'Active' },
  { id: 'u-5', name: 'Director of Campus Dining', role: 'Campus Admin', departmentOrCanteen: 'Campus Dining Services', email: 'dining.admin@campus.ac.in', status: 'Active' }
];

export const INITIAL_SETTINGS: AppSettings = {
  brandName: 'CampusBite',
  operatingHours: '08:00 AM – 06:30 PM (Mon–Sat)',
  defaultPickupLeadMins: 10,
  platformFeeRs: 5,
  systemNotice: 'All campus canteens are operating at standard capacity. Pre-orders open 2 hours before break slots.'
};

export const CONTACT_CONFIG = {
  supportEmail: 'canteen-operations@campus.ac.in',
  campusDesk: 'Central Dining Pavilion, Operations Desk, Room 102',
  helplineHours: 'Monday to Saturday, 08:00 AM – 06:30 PM IST',
  phone: '+91 (080) 4122-8900'
};