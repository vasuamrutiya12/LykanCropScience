import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getStripeInstance } from '@/lib/stripe';
import Order from '@/models/Order';
import { sendEmail, orderAdminAlertHtml } from '@/lib/email';
import { getSettings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { orderDbId, orderId, amount, locale, customerEmail, customerName } =
      await req.json();

    if (!orderDbId || !amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    const stripe = await getStripeInstance();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const loc = locale || 'en';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `LYKAN Order ${orderId}`,
              description: `Agrochemical products order ${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderDbId,
        orderId,
      },
      success_url: `${siteUrl}/${loc}/checkout?success=1&session_id={CHECKOUT_SESSION_ID}&order_id=${orderDbId}`,
      cancel_url: `${siteUrl}/${loc}/checkout?cancelled=1`,
    });

    await Order.findByIdAndUpdate(orderDbId, {
      stripeSessionId: session.id,
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Stripe session error:', error);
    return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
  }
}
