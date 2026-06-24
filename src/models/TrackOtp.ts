import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITrackOtp extends Document {
  mobile: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
  createdAt: Date;
}

const TrackOtpSchema = new Schema<ITrackOtp>({
  mobile: { type: String, required: true, unique: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TrackOtp: Model<ITrackOtp> =
  mongoose.models.TrackOtp || mongoose.model<ITrackOtp>('TrackOtp', TrackOtpSchema);

export default TrackOtp;
