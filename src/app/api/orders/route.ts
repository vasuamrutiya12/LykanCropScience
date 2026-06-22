import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { orderSchema } from '@/lib/validators';
import { generateOrderId, getEstimatedDelivery } from '@/lib/order-id';
import { sendEmail, orderConfirmationHtml, orderAdminAlertHtml } from '@/lib/email';
import { buildOrderWhatsAppMessage } from '@/lib/whatsapp';
import Order from '@/models/Order';
import { getSettings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = orderSchema.parse(body);

    const orderId = await generateOrderId();
    const estimatedDelivery = getEstimatedDelivery();

    const paymentStatus =
      data.paymentMethod === 'razorpay' ? 'pending' : data.paymentMethod === 'pay_on_delivery' ? 'pending' : 'pending';

    const order = await Order.create({
      orderId,
      customerName: data.customerName,
      firmName: data.firmName,
      mobile: data.mobile,
      whatsapp: data.whatsapp,
      address: {
        street: data.street,
        city: data.city,
        district: data.district,
        state: data.state,
        pin: data.pin,
      },
      deliveryNotes: data.deliveryNotes,
      items: data.items,
      subtotal: data.subtotal,
      total: data.total,
      paymentMethod: data.paymentMethod,
      paymentStatus,
      deliveryStatus: 'Order Placed',
      estimatedDelivery,
    });

    const settings = await getSettings();

    if (data.paymentMethod !== 'razorpay') {
      await sendEmail({
        to: settings.company.email,
        subject: `New Order ${orderId}`,
        html: orderAdminAlertHtml({
          orderId,
          customerName: data.customerName,
          mobile: data.mobile,
          total: data.total,
          paymentMethod: data.paymentMethod,
          items: data.items,
        }),
      });
    }

    return NextResponse.json({
      order,
      whatsappUrl: `https://wa.me/${settings.company.whatsapp}?text=${encodeURIComponent(
        buildOrderWhatsAppMessage({
          orderId,
          customerName: data.customerName,
          mobile: data.mobile,
          total: data.total,
          items: data.items,
        })
      )}`,
    });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const paymentStatus = searchParams.get('paymentStatus');
    const deliveryStatus = searchParams.get('deliveryStatus');

    const filter: Record<string, unknown> = {};
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (deliveryStatus) filter.deliveryStatus = deliveryStatus;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
