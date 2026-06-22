'use client';

import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
