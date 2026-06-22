import Stripe from 'stripe';
import Settings from '@/models/Settings';
import { connectDB } from './db';

export async function getStripeSecretKey(): Promise<string> {
  await connectDB();
  const settings = await Settings.findOne();
  const isLive = settings?.stripe?.mode === 'live';

  const key = isLive
    ? settings?.stripe?.liveSecretKey || process.env.STRIPE_SECRET_KEY
    : settings?.stripe?.testSecretKey || process.env.STRIPE_SECRET_KEY;

  if (!key) {
    throw new Error('Stripe secret key not configured');
  }
  return key;
}

export async function getStripePublishableKey(): Promise<string> {
  await connectDB();
  const settings = await Settings.findOne();
  const isLive = settings?.stripe?.mode === 'live';

  return isLive
    ? settings?.stripe?.livePublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
    : settings?.stripe?.testPublishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
}

export async function getStripeInstance(): Promise<Stripe> {
  const secretKey = await getStripeSecretKey();
  return new Stripe(secretKey, { apiVersion: '2024-06-20' });
}

export function getWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET || '';
}
