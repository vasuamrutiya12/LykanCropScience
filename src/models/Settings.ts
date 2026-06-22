import mongoose, { Schema, Document, Model } from 'mongoose';
import { COMPANY } from '@/lib/constants';

export interface ISettings extends Document {
  company: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
  };
  smtp: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  razorpay: {
    mode: 'test' | 'live';
    testKeyId: string;
    testKeySecret: string;
    liveKeyId: string;
    liveKeySecret: string;
  };
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
  };
  bannerUrl: string;
  logoUrl: string;
  verifiedDealerMobiles: string[];
}

const SettingsSchema = new Schema<ISettings>({
  company: {
    name: { type: String, default: COMPANY.name },
    tagline: { type: String, default: COMPANY.tagline },
    phone: { type: String, default: COMPANY.phone },
    email: { type: String, default: COMPANY.email },
    address: { type: String, default: COMPANY.address },
    whatsapp: { type: String, default: COMPANY.whatsapp },
  },
  smtp: {
    host: { type: String, default: 'smtp.gmail.com' },
    port: { type: Number, default: 587 },
    user: { type: String, default: '' },
    pass: { type: String, default: '' },
  },
  razorpay: {
    mode: { type: String, enum: ['test', 'live'], default: 'test' },
    testKeyId: { type: String, default: '' },
    testKeySecret: { type: String, default: '' },
    liveKeyId: { type: String, default: '' },
    liveKeySecret: { type: String, default: '' },
  },
  bankDetails: {
    accountName: { type: String, default: 'LYKAN CROP SCIENCE' },
    accountNumber: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    bankName: { type: String, default: '' },
  },
  bannerUrl: {
    type: String,
    default:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
  },
  logoUrl: { type: String, default: '' },
  verifiedDealerMobiles: [{ type: String }],
});

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;

export async function getSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}
