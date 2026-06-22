'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Input';
import { Download } from 'lucide-react';

interface Inquiry {
  _id: string;
  customerName: string;
  mobile: string;
  whatsapp?: string;
  city: string;
  state: string;
  businessType: string;
  message?: string;
  products: { brandName: string }[];
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');

  const fetchInquiries = () => {
    const params = filter ? `?status=${filter}` : '';
    fetch(`/api/inquiries${params}`)
      .then((r) => r.json())
      .then((d) => setInquiries(Array.isArray(d) ? d : []));
  };

  useEffect(() => { fetchInquiries(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminNotes: notes }),
    });
    toast.success('Updated');
    setSelected(null);
    fetchInquiries();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-navy">Inquiries</h1>
        <div className="flex gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-auto">
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Closed">Closed</option>
          </select>
          <a href="/api/inquiries/export">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" />Export CSV</Button>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Products</th>
              <th className="p-3 text-left">Business</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id} className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => { setSelected(inq); setNotes(inq.adminNotes || ''); }}>
                <td className="p-3">{new Date(inq.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{inq.customerName}</td>
                <td className="p-3">{inq.mobile}</td>
                <td className="p-3">{inq.city}</td>
                <td className="p-3">{inq.products.map((p) => p.brandName).join(', ') || '-'}</td>
                <td className="p-3">{inq.businessType}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    inq.status === 'New' ? 'bg-red-100 text-red-700' :
                    inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>{inq.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Inquiry Details" size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Name:</strong> {selected.customerName}</p>
              <p><strong>Mobile:</strong> {selected.mobile}</p>
              <p><strong>WhatsApp:</strong> {selected.whatsapp || '-'}</p>
              <p><strong>City:</strong> {selected.city}, {selected.state}</p>
              <p><strong>Business:</strong> {selected.businessType}</p>
              <p><strong>Products:</strong> {selected.products.map((p) => p.brandName).join(', ') || '-'}</p>
            </div>
            {selected.message && <p className="text-sm"><strong>Message:</strong> {selected.message}</p>}

            <Textarea label="Admin Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <div className="flex gap-2">
              {['New', 'Contacted', 'Closed'].map((s) => (
                <Button key={s} size="sm" variant={selected.status === s ? 'primary' : 'outline'}
                  onClick={() => updateStatus(selected._id, s)}>{s}</Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
