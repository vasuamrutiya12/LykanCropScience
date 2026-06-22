export const CATEGORIES = ['Insecticide', 'Fungicide', 'Herbicide', 'PGR'] as const;
export type Category = (typeof CATEGORIES)[number];

export const INQUIRY_STATUSES = ['New', 'Contacted', 'Closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const BUSINESS_TYPES = ['Dealer', 'Retailer', 'Farmer', 'Other'] as const;
export type BusinessType = (typeof BUSINESS_TYPES)[number];

export const PAYMENT_METHODS = ['razorpay', 'bank_transfer', 'pay_on_delivery'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const DELIVERY_STATUSES = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
] as const;
export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];

export const COMPANY = {
  name: 'LYKAN CROP SCIENCE',
  tagline: 'First Choice For Smart Farmers',
  phone: '+91 90161 96874',
  whatsapp: '919016196874',
  email: 'lykancropscience@gmail.com',
  address: 'Shop No. 102, Satyam Complex, Satyam Industrial, Jiyana-Wankaner Main Road, Opp. Jiyana Bus Stand, Jiyana, Kuwadva GIDC, Rajkot, Gujarat - 360023',
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getCategoryBadgeClass(category: Category): string {
  const map: Record<Category, string> = {
    Insecticide: 'badge-insecticide',
    Fungicide: 'badge-fungicide',
    Herbicide: 'badge-herbicide',
    PGR: 'badge-pgr',
  };
  return map[category];
}

export function getCategoryColor(category: Category): string {
  const map: Record<Category, string> = {
    Insecticide: '#dc2626',
    Fungicide: '#2563eb',
    Herbicide: '#ea580c',
    PGR: '#9333ea',
  };
  return map[category];
}
