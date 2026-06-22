import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB();
    const product = await Product.findOne({ slug: params.slug, isActive: true }).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const related = await Product.find({
      category: product.category,
      isActive: true,
      _id: { $ne: product._id },
    })
      .limit(4)
      .lean();

    return NextResponse.json({ product, related });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
