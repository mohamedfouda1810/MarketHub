'use client';

import { motion } from 'framer-motion';
import { Users, ShieldCheck, ShoppingBag, DollarSign, AlertCircle, TrendingUp, ArrowUpRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetPlatformAnalyticsQuery, useGetAdminVendorsQuery } from '@/lib/api/adminApi';

export default function AdminDashboardPage() {
  const dateTo = new Date().toISOString();
  const dateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: analyticsResult, isLoading: isAnalyticsLoading } = useGetPlatformAnalyticsQuery({ dateFrom, dateTo });
  const { data: vendorsResult, isLoading: isVendorsLoading } = useGetAdminVendorsQuery({ pageNumber: 1, pageSize: 5 });

  const analytics = analyticsResult?.data;
  const recentVendors = vendorsResult?.data?.items || [];

  const stats = [
    { label: 'Total Users', value: analytics ? (analytics.newCustomers + 100).toString() : '...', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Vendors', value: analytics?.activeVendors.toString() || '...', change: '+5%', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Sales', value: analytics ? `$${analytics.totalRevenue.toLocaleString()}` : '...', change: '+18%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Orders', value: analytics?.totalOrders.toString() || '...', change: '+2', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isAnalyticsLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-8 py-12 flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Admin <span className="text-primary italic">Console.</span></h1>
          <p className="text-muted-foreground font-medium text-lg">System-wide overview and platform management.</p>
        </div>
        <div className="flex gap-3">
          <button className="h-12 px-6 rounded-xl bg-white border border-muted-foreground/10 font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-soft">System Logs</button>
          <button className="btn-gradient h-12 px-6 rounded-xl font-bold text-sm">Platform Settings</button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[2rem] p-8 border border-muted-foreground/10 shadow-soft hover:shadow-premium transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg", stat.bg, stat.color)}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 font-black text-xs bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3" /> {stat.change}
              </div>
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft overflow-hidden">
            <div className="p-8 border-b border-muted flex items-center justify-between">
              <h3 className="text-2xl font-black text-foreground">Recent <span className="text-primary italic">Vendors</span></h3>
              <button className="text-sm font-black text-primary hover:underline">View All Vendors</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/20">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Store Name</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {recentVendors.length > 0 ? (
                    recentVendors.map((vendor, i) => (
                      <tr key={vendor.id} className="hover:bg-primary/[0.02] transition-colors">
                        <td className="px-8 py-5 font-bold text-sm">{vendor.storeName}</td>
                        <td className="px-8 py-5 text-sm text-muted-foreground">{vendor.email}</td>
                        <td className="px-8 py-5 text-sm">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                            vendor.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>{vendor.status}</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"><CheckCircle className="h-4 w-4" /></button>
                            <button className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all"><XCircle className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-muted-foreground font-medium">No vendors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 shadow-soft p-8">
            <h3 className="text-2xl font-black mb-6">Platform <span className="text-primary italic">Health</span></h3>
            <div className="space-y-6">
              {[
                { label: 'API Server', status: 'Optimal', color: 'text-emerald-500' },
                { label: 'Database', status: 'Optimal', color: 'text-emerald-500' },
                { label: 'Search Engine', status: 'Optimal', color: 'text-emerald-500' },
                { label: 'Media Storage', status: 'Optimal', color: 'text-emerald-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="font-bold text-sm text-muted-foreground">{s.label}</span>
                  <span className={cn("font-black text-xs uppercase tracking-widest", s.color)}>{s.status}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 rounded-2xl bg-muted/50 font-black text-sm flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all">
              Run System Diagnostics <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}