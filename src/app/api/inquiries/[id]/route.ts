import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Inquiry from '@/models/Inquiry';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();
    await connectDB();
    const inquiry = await Inquiry.findById(params.id).lean();
    if (!inquiry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(inquiry);
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
    const { status, adminNotes } = await req.json();

    const inquiry = await Inquiry.findByIdAndUpdate(
      params.id,
      { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );

    if (!inquiry) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
