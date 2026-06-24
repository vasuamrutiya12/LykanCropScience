type TargetLang = 'gu' | 'hi';

const LANG_PAIR: Record<TargetLang, string> = {
  gu: 'en|gu',
  hi: 'en|hi',
};

async function translateChunk(text: string, target: TargetLang): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${LANG_PAIR[target]}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) throw new Error('Translation request failed');
  const data = await res.json();
  const translated = data?.responseData?.translatedText as string | undefined;
  if (!translated) throw new Error('No translation returned');
  return translated;
}

/** Translate English text to Gujarati or Hindi (MyMemory free API) */
export async function translateText(text: string, target: TargetLang): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return '';

  // MyMemory free tier works best under ~450 chars per request
  const maxChunk = 400;
  if (trimmed.length <= maxChunk) {
    try {
      return await translateChunk(trimmed, target);
    } catch {
      return trimmed;
    }
  }

  const paragraphs = trimmed.split(/\n+/);
  const translatedParts: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      translatedParts.push('');
      continue;
    }
    if (para.length <= maxChunk) {
      try {
        translatedParts.push(await translateChunk(para, target));
      } catch {
        translatedParts.push(para);
      }
      continue;
    }
    // Split long paragraphs by sentences
    const sentences = para.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [para];
    let chunk = '';
    for (const sentence of sentences) {
      if ((chunk + sentence).length > maxChunk && chunk) {
        try {
          translatedParts.push(await translateChunk(chunk.trim(), target));
        } catch {
          translatedParts.push(chunk.trim());
        }
        chunk = sentence;
      } else {
        chunk += sentence;
      }
    }
    if (chunk.trim()) {
      try {
        translatedParts.push(await translateChunk(chunk.trim(), target));
      } catch {
        translatedParts.push(chunk.trim());
      }
    }
  }

  return translatedParts.join('\n');
}

export async function buildDetailsFromEnglish(en: string): Promise<{ en: string; gu: string; hi: string }> {
  const english = en.trim();
  if (!english) {
    return { en: '', gu: '', hi: '' };
  }

  const [gu, hi] = await Promise.all([
    translateText(english, 'gu'),
    translateText(english, 'hi'),
  ]);

  return { en: english, gu, hi };
}
