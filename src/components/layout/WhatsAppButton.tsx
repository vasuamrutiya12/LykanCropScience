'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/lib/constants';

export function WhatsAppButton() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Show on scroll up, hide on scroll down
      setVisible(currentScrollY <= lastScrollY || currentScrollY < 500);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed right-4 z-50 transition-all duration-300 ${
        visible ? 'bottom-6 md:bottom-6 opacity-100' : 'bottom-0 opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative group">
        <a
          href={`https://wa.me/${COMPANY.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1eac59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 animate-bounce"
          aria-label="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-navy-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Chat with us
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-navy-900" />
        </div>
      </div>
    </div>
  );
}
