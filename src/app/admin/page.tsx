'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, MessageSquare, ShoppingBag, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Stats {
  totalProducts: number;
  totalInquiries: number;
  todayInquiries: number;
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  monthlyRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch('/api/inquiries').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([statsData, inqData, ordData]) => {
      setStats(statsData);
      setInquiries(Array.isArray(inqData) ? inqData.slice(0, 10) : []);
      setOrders(Array.isArray(ordData) ? ordData.slice(0, 10) : []);
    });
  }, []);

  const cards = stats
    ? [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-primary' },
        { label: 'Inquiries Today', value: stats.todayInquiries, icon: MessageSquare, color: 'text-blue-500' },
        { label: 'Orders Today', value: stats.todayOrders, icon: ShoppingBag, color: 'text-orange-500' },
        { label: 'Revenue (Month)', value: `₹${stats.monthlyRevenue}`, icon: DollarSign, color: 'text-accent' },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-navy mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg border p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${card.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 mb-8">
        <Link href="/admin/products"><Button size="sm">Add Product</Button></Link>
        <Link href="/admin/inquiries"><Button variant="outline" size="sm">View Inquiries</Button></Link>
        <Link href="/admin/orders"><Button variant="outline" size="sm">View Orders</Button></Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-heading font-bold mb-4">Recent Inquiries</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Mobile</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id as string} className="border-b">
                    <td className="py-2">{inq.customerName as string}</td>
                    <td>{inq.mobile as string}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        inq.status === 'New' ? 'bg-red-100 text-red-700' :
                        inq.status === 'Contacted' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inq.status as string}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <h2 className="font-heading font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id as string} className="border-b">
                    <td className="py-2">{ord.orderId as string}</td>
                    <td>{ord.customerName as string}</td>
                    <td>₹{ord.total as number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
