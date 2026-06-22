import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Inquiry from '@/models/Inquiry';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();

    const headers = ['Date', 'Name', 'Mobile', 'City', 'State', 'Business', 'Products', 'Status', 'Message'];
    const rows = inquiries.map((i) => [
      new Date(i.createdAt).toISOString(),
      i.customerName,
      i.mobile,
      i.city,
      i.state,
      i.businessType,
      i.products.map((p) => p.brandName).join('; '),
      i.status,
      i.message || '',
    ]);

    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=lykan-inquiries.csv',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
