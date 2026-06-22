import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { productSchema } from '@/lib/validators';
import { deleteImage } from '@/lib/cloudinary';
import Product from '@/models/Product';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const product = await Product.findById(params.id).lean();
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();
    const body = await req.json();
    const data = productSchema.partial().parse(body);

    const product = await Product.findByIdAndUpdate(params.id, data, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth(req);
    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Clean up all Cloudinary images
    const deletePromises: Promise<void>[] = [];
    if (product.cloudinaryId) {
      deletePromises.push(deleteImage(product.cloudinaryId));
    }
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.cloudinaryId) {
          deletePromises.push(deleteImage(img.cloudinaryId));
        }
      }
    }
    await Promise.allSettled(deletePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
