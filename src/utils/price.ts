/**
 * Price and currency calculation utilities for SUK.
 * Ensures consistent math across menu, cart, checkout, receipt, and dashboard.
 */

export interface AddOnLike {
  id: string;
  name: string;
  price: number;
}

export interface CartItemLike {
  foodId: string;
  quantity: number;
  selectedAddOns: AddOnLike[];
}

export interface FoodPriceLike {
  id: string;
  price: number;
}

/**
 * Formats a number into Indian Rupee string (e.g. ₹95, ₹1,240).
 */
export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Calculates single item total including any selected add-ons multiplied by quantity.
 */
export function calculateItemTotal(
  basePrice: number,
  addOns: AddOnLike[] = [],
  quantity: number = 1
): number {
  const addOnsSum = addOns.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  return (basePrice + addOnsSum) * Math.max(1, quantity);
}

/**
 * Calculates subtotal, platform fee, and final payable total for an order or cart.
 */
export function calculateOrderTotals(
  items: Array<{
    price: number;
    quantity: number;
    addOns?: AddOnLike[];
  }>,
  platformFee: number = 5
): {
  subtotal: number;
  platformFee: number;
  total: number;
  itemCount: number;
} {
  const subtotal = items.reduce((acc, item) => {
    const addOnTotal = (item.addOns || []).reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    return acc + (item.price + addOnTotal) * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = subtotal > 0 ? subtotal + platformFee : 0;

  return {
    subtotal,
    platformFee: subtotal > 0 ? platformFee : 0,
    total,
    itemCount
  };
}
