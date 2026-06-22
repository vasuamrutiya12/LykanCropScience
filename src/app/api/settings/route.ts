import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import Settings from '@/models/Settings';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const isAdmin = req.nextUrl.searchParams.get('admin') === 'true';

    if (isAdmin) {
      await requireAuth(req);
      const settings = await Settings.findOne().lean();
      return NextResponse.json(settings);
    }

    const settings = await Settings.findOne().lean();
    const publicSettings = {
      company: settings?.company,
      bannerUrl: settings?.bannerUrl,
      logoUrl: settings?.logoUrl,
      bankDetails: settings?.bankDetails,
      razorpayKeyId: settings?.razorpay?.mode === 'live'
        ? settings?.razorpay?.liveKeyId
        : settings?.razorpay?.testKeyId,
      verifiedDealerMobiles: settings?.verifiedDealerMobiles,
    };
    return NextResponse.json(publicSettings);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error';
    return NextResponse.json({ error: msg }, { status: msg === 'Unauthorized' ? 401 : 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(req);
    await connectDB();
    const body = await req.json();

    const settings = await Settings.findOneAndUpdate(
      {},
      { $set: body },
      { new: true, upsert: true }
    );
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
