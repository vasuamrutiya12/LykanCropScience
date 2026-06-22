import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { getRazorpayInstance } from '@/lib/razorpay';
import { sendEmail, orderConfirmationHtml, orderAdminAlertHtml } from '@/lib/email';
import Order from '@/models/Order';
import { getSettings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDbId } =
      await req.json();

    const razorpay = await getRazorpayInstance();
    const settings = await getSettings();
    const isLive = settings.razorpay?.mode === 'live';
    const keySecret = isLive
      ? settings.razorpay.liveKeySecret || process.env.RAZORPAY_KEY_SECRET
      : settings.razorpay.testKeySecret || process.env.RAZORPAY_KEY_SECRET;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const order = await Order.findByIdAndUpdate(
      orderDbId,
      {
        paymentStatus: 'paid',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        deliveryStatus: 'Confirmed',
      },
      { new: true }
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const deliveryStr = order.estimatedDelivery
      ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN')
      : '3-7 business days';

    await sendEmail({
      to: settings.company.email,
      subject: `Payment Received - ${order.orderId}`,
      html: orderAdminAlertHtml({
        orderId: order.orderId,
        customerName: order.customerName,
        mobile: order.mobile,
        total: order.total,
        paymentMethod: 'razorpay',
        items: order.items,
      }),
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
