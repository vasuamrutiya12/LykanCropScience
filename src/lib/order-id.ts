import Order from '@/models/Order';

export async function generateOrderId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `LCS-${year}-`;

  const lastOrder = await Order.findOne({
    orderId: { $regex: `^${prefix}` },
  })
    .sort({ orderId: -1 })
    .select('orderId');

  let nextNum = 1;
  if (lastOrder?.orderId) {
    const parts = lastOrder.orderId.split('-');
    const lastNum = parseInt(parts[2] || '0', 10);
    nextNum = lastNum + 1;
  }

  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

export function getEstimatedDelivery(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 5);
  return date;
}
