import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/translate';

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    if (target !== 'gu' && target !== 'hi') {
      return NextResponse.json({ error: 'Target must be gu or hi' }, { status: 400 });
    }

    const translated = await translateText(text, target);
    return NextResponse.json({ translated });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
