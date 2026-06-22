import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getRazorpayInstance, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { amount, orderId } = await req.json();

    const razorpay = await getRazorpayInstance();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
    });

    const keyId = await getRazorpayKeyId();

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      keyId,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error('Razorpay create error:', error);
    return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}
