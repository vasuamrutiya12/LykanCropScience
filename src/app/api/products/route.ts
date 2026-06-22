import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { productSchema } from '@/lib/validators';
import { slugify } from '@/lib/constants';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const admin = searchParams.get('admin');

    const filter: Record<string, unknown> = {};
    if (admin !== 'true') filter.isActive = true;
    if (category && category !== 'all') filter.category = category;
    if (featured === 'true') filter.isFeatured = true;
    if (q) {
      filter.$or = [
        { brandName: { $regex: q, $options: 'i' } },
        { technicalName: { $regex: q, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ brandName: 1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();
    const body = await req.json();
    const data = productSchema.parse(body);

    let slug = slugify(data.brandName);
    const existing = await Product.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await Product.create({ ...data, slug });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: msg },
      { status: msg === 'Unauthorized' ? 401 : 400 }
    );
  }
}
