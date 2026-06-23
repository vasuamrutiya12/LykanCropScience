'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState, useRef } from 'react';

export function StatsBar() {
  const t = useTranslations('stats');
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '20+', label: t('experience'), icon: '📅' },
    { value: '120+', label: t('products'), icon: '🎯' },
    { value: '4', label: t('categories'), icon: '📦' },
    { value: 'Pan India', label: t('supply'), icon: '🚚' },
  ];

  return (
    <section className="bg-gradient-navy text-white py-12 md:py-16" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={stat.label} className="text-center group">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className={`text-3xl md:text-4xl font-heading font-bold text-accent-500 transition-all duration-1000 ${
                inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`} style={{ transitionDelay: `${idx * 100}ms` }}>
                {stat.value}
              </div>
              <div className="text-sm text-white/70 mt-3 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
