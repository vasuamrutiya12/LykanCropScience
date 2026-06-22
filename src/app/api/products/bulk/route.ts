import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Product from '@/models/Product';

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();
    const { ids, category, isFeatured, isActive } = await req.json();

    if (!ids?.length) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (category) update.category = category;
    if (typeof isFeatured === 'boolean') update.isFeatured = isFeatured;
    if (typeof isActive === 'boolean') update.isActive = isActive;

    await Product.updateMany({ _id: { $in: ids } }, update);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();
    const { ids } = await req.json();
    if (!ids?.length) {
      return NextResponse.json({ error: 'No products selected' }, { status: 400 });
    }
    await Product.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
