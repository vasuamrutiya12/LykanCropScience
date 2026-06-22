import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { trackOrderSchema } from '@/lib/validators';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const mobile = searchParams.get('mobile');

    const data = trackOrderSchema.parse({ orderId, mobile });

    const order = await Order.findOne({
      orderId: data.orderId,
      mobile: data.mobile,
    }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
