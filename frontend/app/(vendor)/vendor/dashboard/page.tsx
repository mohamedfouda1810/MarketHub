'use client';

import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Star, TrendingUp, ArrowUpRight, ChevronRight, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import EarningsChart from '@/components/dashboard/EarningsChart';

export default function VendorDashboard() {
  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Orders', value: '2,350', change: '+15.2%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Active Products', value: '124', change: '+3', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Avg. Rating', value: '4.8', change: '+0.2', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Vendor <span className="text-primary">Dashboard</span></h1>
          <p className="text-muted-foreground font-medium text-lg">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="h-12 w-12 rounded-xl bg-white border border-muted-foreground/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/20 transition-all shadow-soft">
            <Bell className="h-5 w-5" />
          </button>
          <button className="btn-gradient h-12 px-6 rounded-xl font-bold flex items-center gap-2">
            <Package className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={stat.name} 
            className="card-premium p-6"
          >
            <div className="flex flex-row items-center justify-between pb-4">
              <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3" /> {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.name}</p>
              <div className="text-3xl font-black tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card-premium p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Revenue <span className="text-primary">Trends</span></h3>
            <select className="bg-muted/50 border-none rounded-xl px-4 py-2 text-sm font-bold outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <EarningsChart />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="card-premium p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black">Recent <span className="text-primary">Orders</span></h3>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-xs">
                    #{1024 + i}
                  </div>
                  <div>
                    <p className="text-sm font-black group-hover:text-primary transition-colors">Order #ORD-{1000 + i}</p>
                    <p className="text-xs text-muted-foreground font-medium">2 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black">$129.00</p>
                  <p className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">Paid</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-muted/50 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
            See Performance Report <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}