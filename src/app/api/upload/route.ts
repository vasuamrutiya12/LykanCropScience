import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const { file, folder } = await req.json();

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const { url, publicId } = await uploadImage(file, folder || 'lykan/products');
    return NextResponse.json({ url, publicId });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
