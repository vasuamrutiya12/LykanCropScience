import { COMPANY } from './constants';

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${COMPANY.whatsapp}?text=${encoded}`;
}

export function buildInquiryWhatsAppMessage(data: {
  customerName: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  state: string;
  businessType: string;
  message?: string;
  products: { brandName: string }[];
}): string {
  const products = data.products.map((p) => p.brandName).join(', ');
  return [
    `*New Inquiry - ${COMPANY.name}*`,
    '',
    `Name: ${data.customerName}`,
    `Mobile: ${data.mobile}`,
    data.whatsapp ? `WhatsApp: ${data.whatsapp}` : '',
    `City: ${data.city}`,
    `State: ${data.state}`,
    `Business: ${data.businessType}`,
    products ? `Products: ${products}` : '',
    data.message ? `Message: ${data.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildOrderWhatsAppMessage(data: {
  orderId: string;
  customerName: string;
  mobile: string;
  total: number;
  items: { brandName: string; quantity: number; packingSize: string }[];
}): string {
  const items = data.items
    .map((i) => `• ${i.brandName} (${i.packingSize}) x${i.quantity}`)
    .join('\n');
  return [
    `*New Order - ${COMPANY.name}*`,
    '',
    `Order ID: ${data.orderId}`,
    `Customer: ${data.customerName}`,
    `Mobile: ${data.mobile}`,
    `Total: ₹${data.total}`,
    '',
    'Items:',
    items,
  ].join('\n');
}

export function buildProductShareUrl(productName: string, url: string): string {
  const message = `Check out ${productName} from ${COMPANY.name}: ${url}`;
  return buildWhatsAppUrl(message);
}
