import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';
import Admin from '@/models/Admin';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = await signToken({ adminId: admin._id.toString(), email: admin.email });
    await setAuthCookie(token);

    return NextResponse.json({ success: true, email: admin.email });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 400 });
  }
}
