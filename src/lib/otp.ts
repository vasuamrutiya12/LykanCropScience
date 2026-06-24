import bcrypt from 'bcryptjs';

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
export const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
export const MAX_OTP_ATTEMPTS = 5;

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

export function getResendCooldownRemaining(lastSentAt: Date): number {
  const elapsed = Date.now() - new Date(lastSentAt).getTime();
  return Math.max(0, RESEND_COOLDOWN_MS - elapsed);
}
