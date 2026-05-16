'use client';

import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, Star, TrendingUp, ArrowUpRight, Bell, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import EarningsChart from '@/components/dashboard/EarningsChart';
import { useGetStoreDashboardQuery } from '@/lib/api/vendorApi';

export default function VendorDashboard() {
  const { data: dashboardResult, isLoading, error } = useGetStoreDashboardQuery();
  const dashboard = dashboardResult?.data;

  const stats = [
    { name: 'Total Revenue', value: dashboard ? `$${dashboard.totalRevenue.toLocaleString()}` : '$0', change: '+0%', icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Total Orders', value: dashboard ? dashboard.totalOrders.toString() : '0', change: '+0%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { name: 'Pending Orders', value: dashboard ? dashboard.pendingOrders.toString() : '0', change: 'New', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Total Sales', value: dashboard ? `$${dashboard.totalSales.toLocaleString()}` : '$0', change: '+0%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

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
            {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
              dashboard.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center font-bold text-xs">
                      #{order.orderNumber.slice(-4)}
                    </div>
                    <div>
                      <p className="text-sm font-black group-hover:text-primary transition-colors">Order {order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">${order.totalAmount}</p>
                    <p className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-md",
                      order.status === 'Paid' || order.status === 'Delivered' ? "text-emerald-500 bg-emerald-50" : "text-amber-500 bg-amber-50"
                    )}>{order.status}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-muted-foreground font-bold">No orders yet.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-muted/50 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
            See Performance Report <ArrowUpRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}