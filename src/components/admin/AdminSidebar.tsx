'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  ShoppingBag,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';

const NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/inquiries', icon: MessageSquare, label: 'Inquiries' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 bg-navy text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <Leaf className="w-6 h-6 text-accent" />
        <span className="font-heading font-bold">Admin Panel</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active ? 'bg-primary text-white' : 'hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-7 py-4 text-red-400 hover:text-red-300 border-t border-white/10"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
}
