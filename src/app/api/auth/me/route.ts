import { NextResponse } from 'next/server';
import { getAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookies();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(auth);
}
