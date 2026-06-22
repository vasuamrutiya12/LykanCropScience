'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { Printer } from 'lucide-react';

export function PrintCatalogueButton() {
  const t = useTranslations('products');
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products?limit=200');
      const data = await res.json();
      const products = data.products || [];

      const grouped: Record<string, typeof products> = {};
      for (const p of products) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }

      const html = `
        <!DOCTYPE html>
        <html><head><title>LYKAN CROP SCIENCE - Product Catalogue</title>
        <style>
          @page { margin: 15mm; }
          @media print {
            html, body { margin: 0; padding: 0; }
            /* Hide browser default header/footer (URL, page title, date) */
            @page { margin-top: 10mm; margin-bottom: 10mm; }
          }
          body { font-family: Arial, sans-serif; padding: 20px; color: #1a1a1a; }
          h1 { color: #1a5c1a; text-align: center; }
          h2 { color: #0d1b2a; border-bottom: 2px solid #7bc61e; padding-bottom: 4px; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #d4e8c2; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #f8fdf4; color: #1a5c1a; }
          .footer { text-align: center; margin-top: 40px; font-size: 11px; color: #666; }
        </style></head><body>
        <h1>LYKAN CROP SCIENCE</h1>
        <p style="text-align:center;color:#666">First Choice For Smart Farmers | +91 90161 96874</p>
        ${Object.entries(grouped).map(([cat, items]) => `
          <h2>${cat} (${items.length})</h2>
          <table>
            <tr><th>#</th><th>Brand Name</th><th>Technical Name</th><th>Packing</th></tr>
            ${items.map((p: { brandName: string; technicalName?: string; packingSizes?: string[] }, i: number) => `
              <tr>
                <td>${i + 1}</td>
                <td><strong>${p.brandName}</strong></td>
                <td>${p.technicalName || '-'}</td>
                <td>${p.packingSizes?.join(', ') || 'Contact for details'}</td>
              </tr>
            `).join('')}
          </table>
        `).join('')}
        <div class="footer">© ${new Date().getFullYear()} LYKAN CROP SCIENCE. All rights reserved.</div>
        </body></html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
        // Wait for content to render before printing
        win.onload = () => {
          win.print();
          URL.revokeObjectURL(url);
        };
      } else {
        URL.revokeObjectURL(url);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handlePrint} disabled={loading}>
      <Printer className="w-4 h-4 mr-1" />
      {loading ? '...' : t('printCatalogue')}
    </Button>
  );
}
