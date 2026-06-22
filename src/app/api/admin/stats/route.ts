import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Product from '@/models/Product';
import Inquiry from '@/models/Inquiry';
import Order from '@/models/Order';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      totalProducts,
      totalInquiries,
      todayInquiries,
      totalOrders,
      todayOrders,
      pendingOrders,
      revenueOrders,
    ] = await Promise.all([
      Product.countDocuments(),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ deliveryStatus: { $nin: ['Delivered'] } }),
      Order.find({
        paymentStatus: 'paid',
        createdAt: { $gte: monthStart },
      }).select('total'),
    ]);

    const monthlyRevenue = revenueOrders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      totalProducts,
      totalInquiries,
      todayInquiries,
      totalOrders,
      todayOrders,
      pendingOrders,
      monthlyRevenue,
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
