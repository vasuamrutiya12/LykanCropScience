'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { DELIVERY_STATUSES } from '@/lib/constants';

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  mobile: string;
  items: { brandName: string; quantity: number; packingSize: string; price: number }[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  deliveryStatus: string;
  trackingNumber?: string;
  courierName?: string;
  address: { street: string; city: string; district: string; state: string; pin: string };
  adminNotes?: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selected, setSelected] = useState<Order | null>(null);
  const [tracking, setTracking] = useState('');
  const [courier, setCourier] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryFilter, setDeliveryFilter] = useState('');

  const fetchOrders = () => {
    const params = deliveryFilter ? `?deliveryStatus=${deliveryFilter}` : '';
    fetch(`/api/orders${params}`)
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []));
  };

  useEffect(() => { fetchOrders(); }, [deliveryFilter]);

  const updateOrder = async (updates: Record<string, unknown>) => {
    if (!selected) return;
    await fetch(`/api/orders/${selected._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    toast.success('Order updated');
    setSelected(null);
    fetchOrders();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-navy">Orders</h1>
        <select value={deliveryFilter} onChange={(e) => setDeliveryFilter(e.target.value)} className="input-field w-auto">
          <option value="">All Status</option>
          {DELIVERY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Payment</th>
              <th className="p-3 text-left">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr key={ord._id} className="border-t cursor-pointer hover:bg-gray-50"
                onClick={() => {
                  setSelected(ord);
                  setTracking(ord.trackingNumber || '');
                  setCourier(ord.courierName || '');
                  setNotes(ord.adminNotes || '');
                }}>
                <td className="p-3 font-medium">{ord.orderId}</td>
                <td className="p-3">{new Date(ord.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{ord.customerName}</td>
                <td className="p-3">₹{ord.total}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    ord.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>{ord.paymentStatus}</span>
                </td>
                <td className="p-3">{ord.deliveryStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.orderId}`} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="text-sm space-y-1">
              <p><strong>Customer:</strong> {selected.customerName} ({selected.mobile})</p>
              <p><strong>Address:</strong> {selected.address.street}, {selected.address.city}, {selected.address.state} - {selected.address.pin}</p>
            </div>

            <div className="border rounded p-3 text-sm">
              {selected.items.map((item, i) => (
                <p key={i}>{item.brandName} ({item.packingSize}) x{item.quantity} - ₹{item.price}</p>
              ))}
              <p className="font-bold mt-2">Total: ₹{selected.total}</p>
            </div>

            <Select label="Delivery Status" value={selected.deliveryStatus}
              onChange={(e) => setSelected({ ...selected, deliveryStatus: e.target.value })}
              options={DELIVERY_STATUSES.map((s) => ({ value: s, label: s }))} />

            <Input label="Tracking Number" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <Input label="Courier Name" value={courier} onChange={(e) => setCourier(e.target.value)} />
            <Textarea label="Admin Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={() => updateOrder({
                deliveryStatus: selected.deliveryStatus,
                trackingNumber: tracking,
                courierName: courier,
                adminNotes: notes,
              })}>Save Changes</Button>
              {selected.paymentStatus !== 'paid' && (
                <Button size="sm" variant="accent" onClick={() => updateOrder({ paymentStatus: 'paid' })}>
                  Mark Payment Received
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
