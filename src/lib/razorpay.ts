import Razorpay from 'razorpay';
import Settings from '@/models/Settings';
import { connectDB } from './db';

export async function getRazorpayInstance(): Promise<Razorpay> {
  await connectDB();
  const settings = await Settings.findOne();
  const isLive = settings?.razorpay?.mode === 'live';

  const keyId = isLive
    ? settings?.razorpay?.liveKeyId || process.env.RAZORPAY_KEY_ID
    : settings?.razorpay?.testKeyId || process.env.RAZORPAY_KEY_ID;

  const keySecret = isLive
    ? settings?.razorpay?.liveKeySecret || process.env.RAZORPAY_KEY_SECRET
    : settings?.razorpay?.testKeySecret || process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error('Razorpay keys not configured');
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function getRazorpayKeyId(): Promise<string> {
  await connectDB();
  const settings = await Settings.findOne();
  const isLive = settings?.razorpay?.mode === 'live';
  return isLive
    ? settings?.razorpay?.liveKeyId || process.env.RAZORPAY_KEY_ID || ''
    : settings?.razorpay?.testKeyId || process.env.RAZORPAY_KEY_ID || '';
}
