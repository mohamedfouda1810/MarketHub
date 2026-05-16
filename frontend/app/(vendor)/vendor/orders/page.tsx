'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Search, Eye, CheckCircle2, Truck, XCircle, Filter, Download } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const orders = [
  { id: 'ORD-1001', customer: 'John Doe', date: 'May 16, 2026', total: 199.99, status: 'Processing', items: 1 },
  { id: 'ORD-1002', customer: 'Jane Smith', date: 'May 15, 2026', total: 49.99, status: 'Shipped', items: 2 },
  { id: 'ORD-1003', customer: 'Robert Johnson', date: 'May 15, 2026', total: 124.50, status: 'Delivered', items: 3 },
  { id: 'ORD-1004', customer: 'Michael Brown', date: 'May 14, 2026', total: 89.00, status: 'Cancelled', items: 1 },
];

export default function VendorOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Order <span className="text-primary">Management</span></h1>
          <p className="text-muted-foreground font-medium">Track and fulfill your customer orders.</p>
        </div>
        <button className="h-14 px-8 rounded-2xl bg-white border border-muted-foreground/10 flex items-center gap-2 font-bold text-muted-foreground hover:text-primary hover:border-primary/20 transition-all shadow-soft">
          <Download className="h-5 w-5" /> Export Orders
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'All Orders', count: 156, color: 'bg-primary/5 text-primary' },
          { label: 'Pending', count: 12, color: 'bg-amber-50 text-amber-600' },
          { label: 'Shipped', count: 24, color: 'bg-blue-50 text-blue-600' },
          { label: 'Completed', count: 120, color: 'bg-emerald-50 text-emerald-600' },
        ].map((stat, i) => (
          <div key={i} className="card-premium p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-black">{stat.count}</p>
            </div>
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center font-black", stat.color)}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            className="input-premium w-full h-14 pl-12 pr-4 outline-none"
            placeholder="Search by order ID, customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="h-14 px-6 rounded-2xl bg-white border border-muted-foreground/10 flex items-center gap-2 font-bold text-muted-foreground hover:text-primary hover:border-primary/20 transition-all shadow-soft">
          <Filter className="h-5 w-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted bg-muted/20">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Date</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Items</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Total</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={order.id} 
                  className="group hover:bg-primary/[0.02] transition-colors border-b border-muted last:border-0"
                >
                  <td className="px-8 py-6 font-black text-primary">{order.id}</td>
                  <td className="px-8 py-6 font-bold">{order.customer}</td>
                  <td className="px-8 py-6 text-muted-foreground font-medium">{order.date}</td>
                  <td className="px-8 py-6 font-bold">{order.items} items</td>
                  <td className="px-8 py-6 font-black">{formatPrice(order.total)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit",
                      order.status === 'Processing' ? "bg-amber-50 text-amber-600" : 
                      order.status === 'Shipped' ? "bg-blue-50 text-blue-600" : 
                      order.status === 'Delivered' ? "bg-emerald-50 text-emerald-600" : "bg-destructive/5 text-destructive"
                    )}>
                      {order.status === 'Processing' && <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-10 px-4 rounded-xl bg-muted/50 hover:bg-primary hover:text-white transition-all font-bold text-xs flex items-center gap-2">
                        <Eye className="h-4 w-4" /> Details
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
