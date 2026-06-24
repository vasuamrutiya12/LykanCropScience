import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Product from '@/models/Product';
import { normalizePackingSizes } from '@/lib/product-types';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    await requireAuth();
    await connectDB();
    const products = await Product.find().sort({ brandName: 1 }).lean();

    const data = products.map((p) => {
      const packing = normalizePackingSizes(p.packingSizes, p.pricePerPacking);
      return {
        'Brand Name': p.brandName,
        'Technical Name': p.technicalName,
        Category: p.category,
        Dose: p.dose,
        'Packing Sizes': packing.map((s) => `${s.size} (₹${s.price}/${s.mrp})`).join('; '),
        'Details (EN)': p.details?.en || '',
        Featured: p.isFeatured ? 'Yes' : 'No',
        Active: p.isActive ? 'Yes' : 'No',
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=lykan-products.xlsx',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
