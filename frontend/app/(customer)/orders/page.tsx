'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, ChevronRight, Search, Filter, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

const orders = [
  {
    id: 'MH-7721',
    date: 'May 16, 2026',
    status: 'Delivered',
    total: 124.98,
    items: [
      { name: 'Premium Wireless Headphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
      { name: 'Leather Minimalist Wallet', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' }
    ]
  },
  {
    id: 'MH-7689',
    date: 'May 12, 2026',
    status: 'In Transit',
    total: 89.50,
    items: [
      { name: 'Smart Fitness Tracker', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop' }
    ]
  }
];

export default function OrdersPage() {
  return (
    <div className="container px-4 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm mb-4">
              <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Link>
            <h1 className="text-5xl font-black tracking-tight">Your <span className="text-primary">Orders</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                className="bg-white border border-muted-foreground/10 h-12 pl-10 pr-4 rounded-xl text-sm font-medium outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                placeholder="Search orders..."
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center bg-white border border-muted-foreground/10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={order.id}
              className="group bg-white rounded-[2.5rem] border border-muted-foreground/10 overflow-hidden hover:border-primary/20 transition-all hover:shadow-premium"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-muted">
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                    order.status === 'Delivered' ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                  )}>
                    {order.status === 'Delivered' ? <CheckCircle2 className="h-7 w-7" /> : <Truck className="h-7 w-7" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Order ID</p>
                    <p className="text-lg font-black">{order.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Date Placed</p>
                    <p className="font-bold">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="font-black text-primary">{formatPrice(order.total)}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider",
                      order.status === 'Delivered' ? "bg-green-500/10 text-green-600" : "bg-blue-500/10 text-blue-600"
                    )}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/orders/${order.id}`}
                  className="w-full md:w-auto h-12 px-6 rounded-xl bg-muted/50 hover:bg-primary hover:text-white flex items-center justify-center font-bold text-sm transition-all gap-2 group-hover:bg-primary group-hover:text-white"
                >
                  View Details <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="p-6 md:p-8 bg-muted/5 flex items-center gap-4 overflow-x-auto">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex-shrink-0 flex items-center gap-4 bg-white p-3 rounded-2xl border border-muted shadow-soft">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    </div>
                    <p className="text-sm font-bold pr-2">{item.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function locally since we are in a new file
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
