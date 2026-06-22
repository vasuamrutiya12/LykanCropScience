'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [password, setPassword] = useState({ current: '', newPass: '' });
  const [dealers, setDealers] = useState('');
  const bannerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings?admin=true')
      .then((r) => r.json())
      .then((d) => {
        setSettings(d);
        setDealers((d.verifiedDealerMobiles || []).join(', '));
      });
  }, []);

  const updateField = (section: string, field: string, value: string) => {
    setSettings((s) => ({
      ...s,
      [section]: { ...(s[section] as Record<string, string> || {}), [field]: value },
    }));
  };

  const handleSave = async () => {
    const payload = {
      ...settings,
      verifiedDealerMobiles: dealers.split(',').map((d) => d.trim()).filter(Boolean),
    };
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) toast.success('Settings saved');
    else toast.error('Failed to save');
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: reader.result, folder: 'lykan/banners' }),
      });
      const data = await res.json();
      if (data.url) {
        updateField('banner', 'bannerUrl', data.url);
        setSettings((s) => ({ ...s, bannerUrl: data.url }));
        toast.success('Banner uploaded');
      }
    };
    reader.readAsDataURL(file);
  };

  const company = (settings.company || {}) as Record<string, string>;
  const smtp = (settings.smtp || {}) as Record<string, string>;
  const razorpay = (settings.razorpay || {}) as Record<string, string>;
  const bank = (settings.bankDetails || {}) as Record<string, string>;
  const bannerUrl = settings.bannerUrl as string | undefined;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-heading font-bold text-navy mb-6">Settings</h1>

      <div className="space-y-8">
        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Company Info</h2>
          <Input label="Name" value={company.name || ''} onChange={(e) => updateField('company', 'name', e.target.value)} />
          <Input label="Phone" value={company.phone || ''} onChange={(e) => updateField('company', 'phone', e.target.value)} />
          <Input label="Email" value={company.email || ''} onChange={(e) => updateField('company', 'email', e.target.value)} />
          <Textarea label="Address" value={company.address || ''} onChange={(e) => updateField('company', 'address', e.target.value)} />
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Homepage Banner</h2>
          {bannerUrl && (
            <div className="relative h-32 rounded overflow-hidden">
              <Image src={bannerUrl} alt="Banner" fill className="object-cover" />
            </div>
          )}
          <Button size="sm" onClick={() => bannerRef.current?.click()}>Upload Banner</Button>
          <input ref={bannerRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Email (SMTP)</h2>
          <Input label="Host" value={smtp.host || ''} onChange={(e) => updateField('smtp', 'host', e.target.value)} />
          <Input label="User" value={smtp.user || ''} onChange={(e) => updateField('smtp', 'user', e.target.value)} />
          <Input label="Password" type="password" value={smtp.pass || ''} onChange={(e) => updateField('smtp', 'pass', e.target.value)} />
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Razorpay</h2>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={razorpay.mode === 'live'}
              onChange={(e) => updateField('razorpay', 'mode', e.target.checked ? 'live' : 'test')} />
            Live Mode
          </label>
          <Input label="Test Key ID" value={razorpay.testKeyId || ''} onChange={(e) => updateField('razorpay', 'testKeyId', e.target.value)} />
          <Input label="Test Key Secret" type="password" value={razorpay.testKeySecret || ''} onChange={(e) => updateField('razorpay', 'testKeySecret', e.target.value)} />
          <Input label="Live Key ID" value={razorpay.liveKeyId || ''} onChange={(e) => updateField('razorpay', 'liveKeyId', e.target.value)} />
          <Input label="Live Key Secret" type="password" value={razorpay.liveKeySecret || ''} onChange={(e) => updateField('razorpay', 'liveKeySecret', e.target.value)} />
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Bank Details</h2>
          <Input label="Account Name" value={bank.accountName || ''} onChange={(e) => updateField('bankDetails', 'accountName', e.target.value)} />
          <Input label="Account Number" value={bank.accountNumber || ''} onChange={(e) => updateField('bankDetails', 'accountNumber', e.target.value)} />
          <Input label="IFSC" value={bank.ifsc || ''} onChange={(e) => updateField('bankDetails', 'ifsc', e.target.value)} />
          <Input label="Bank Name" value={bank.bankName || ''} onChange={(e) => updateField('bankDetails', 'bankName', e.target.value)} />
        </section>

        <section className="bg-white rounded-lg border p-6 space-y-4">
          <h2 className="font-heading font-bold">Verified Dealers (Pay on Delivery)</h2>
          <Input label="Mobile Numbers (comma separated)" value={dealers} onChange={(e) => setDealers(e.target.value)} />
        </section>

        <Button onClick={handleSave} className="w-full">Save All Settings</Button>
      </div>
    </div>
  );
}
