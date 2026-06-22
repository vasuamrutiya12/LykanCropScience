import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { inquirySchema } from '@/lib/validators';
import { sendEmail, inquiryEmailHtml } from '@/lib/email';
import { buildInquiryWhatsAppMessage } from '@/lib/whatsapp';
import Inquiry from '@/models/Inquiry';
import { getSettings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const data = inquirySchema.parse(body);

    const whatsapp = data.sameAsMobile ? data.mobile : data.whatsapp;

    const inquiry = await Inquiry.create({
      customerName: data.customerName,
      mobile: data.mobile,
      whatsapp,
      city: data.city,
      state: data.state,
      businessType: data.businessType,
      message: data.message,
      products: data.products,
      status: 'New',
    });

    const settings = await getSettings();
    const adminEmail = settings.company.email;

    await sendEmail({
      to: adminEmail,
      subject: `New Inquiry from ${data.customerName}`,
      html: inquiryEmailHtml({ ...data, whatsapp }),
    });

    const whatsappUrl = buildInquiryWhatsAppMessage({ ...data, whatsapp });

    return NextResponse.json({
      success: true,
      inquiry,
      whatsappUrl: `https://wa.me/${settings.company.whatsapp}?text=${encodeURIComponent(whatsappUrl)}`,
    });
  } catch (error) {
    console.error('Inquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { requireAuth } = await import('@/lib/auth');
    await requireAuth(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (from || to) {
      filter.createdAt = {};
      if (from) (filter.createdAt as Record<string, Date>).$gte = new Date(from);
      if (to) (filter.createdAt as Record<string, Date>).$lte = new Date(to);
    }

    const inquiries = await Inquiry.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(inquiries);
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
