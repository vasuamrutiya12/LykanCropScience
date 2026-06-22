import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Order from '@/models/Order';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    await connectDB();
    const order = await Order.findById(params.id).lean();
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();
    const body = await req.json();

    const order = await Order.findByIdAndUpdate(params.id, body, { new: true });
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
