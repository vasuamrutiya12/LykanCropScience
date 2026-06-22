import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { contactSchema } from '@/lib/validators';
import { sendEmail } from '@/lib/email';
import { getSettings } from '@/models/Settings';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    await connectDB();
    const settings = await getSettings();

    await sendEmail({
      to: settings.company.email,
      subject: `Contact Form: ${data.name}`,
      html: `
        <h2>Contact Form Message</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Mobile:</strong> ${data.mobile}</p>
        ${data.email ? `<p><strong>Email:</strong> ${data.email}</p>` : ''}
        <p><strong>Message:</strong> ${data.message}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
  }
}
