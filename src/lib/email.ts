import nodemailer from 'nodemailer';
import Settings from '@/models/Settings';
import { connectDB } from './db';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

async function getEmailConfig(): Promise<EmailConfig> {
  await connectDB();
  const settings = await Settings.findOne();
  return {
    host: settings?.smtp?.host || process.env.SMTP_HOST || 'smtp.gmail.com',
    port: settings?.smtp?.port || parseInt(process.env.SMTP_PORT || '587'),
    user: settings?.smtp?.user || process.env.SMTP_USER || '',
    pass: settings?.smtp?.pass || process.env.SMTP_PASS || '',
    from: settings?.company?.email || process.env.ADMIN_EMAIL || 'lykancropscience@gmail.com',
  };
}

async function createTransporter() {
  const config = await getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const config = await getEmailConfig();
    if (!config.user || !config.pass) {
      console.warn('SMTP not configured, skipping email');
      return false;
    }
    const transporter = await createTransporter();
    await transporter.sendMail({ from: config.from, to, subject, html });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export function inquiryEmailHtml(data: {
  customerName: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  state: string;
  businessType: string;
  message?: string;
  products: { brandName: string }[];
}) {
  const products = data.products.map((p) => `<li>${p.brandName}</li>`).join('');
  return `
    <h2>New Product Inquiry</h2>
    <p><strong>Name:</strong> ${data.customerName}</p>
    <p><strong>Mobile:</strong> ${data.mobile}</p>
    ${data.whatsapp ? `<p><strong>WhatsApp:</strong> ${data.whatsapp}</p>` : ''}
    <p><strong>City:</strong> ${data.city}, ${data.state}</p>
    <p><strong>Business Type:</strong> ${data.businessType}</p>
    ${products ? `<p><strong>Products:</strong><ul>${products}</ul></p>` : ''}
    ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
  `;
}

export function orderConfirmationHtml(data: {
  orderId: string;
  customerName: string;
  items: { brandName: string; packingSize: string; quantity: number; price: number }[];
  total: number;
  estimatedDelivery: string;
}) {
  const items = data.items
    .map(
      (i) =>
        `<tr><td>${i.brandName}</td><td>${i.packingSize}</td><td>${i.quantity}</td><td>₹${i.price}</td></tr>`
    )
    .join('');
  return `
    <h2>Order Confirmation - ${data.orderId}</h2>
    <p>Dear ${data.customerName},</p>
    <p>Thank you for your order with LYKAN CROP SCIENCE!</p>
    <table border="1" cellpadding="8" style="border-collapse:collapse">
      <tr><th>Product</th><th>Packing</th><th>Qty</th><th>Price</th></tr>
      ${items}
    </table>
    <p><strong>Total: ₹${data.total}</strong></p>
    <p>Estimated Delivery: ${data.estimatedDelivery}</p>
    <p>Our team will contact you shortly.</p>
  `;
}

export function orderAdminAlertHtml(data: {
  orderId: string;
  customerName: string;
  mobile: string;
  total: number;
  paymentMethod: string;
  items: { brandName: string; quantity: number }[];
}) {
  const items = data.items.map((i) => `<li>${i.brandName} x${i.quantity}</li>`).join('');
  return `
    <h2>New Order Alert - ${data.orderId}</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Mobile:</strong> ${data.mobile}</p>
    <p><strong>Total:</strong> ₹${data.total}</p>
    <p><strong>Payment:</strong> ${data.paymentMethod}</p>
    <ul>${items}</ul>
  `;
}
