'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useGetStoreEarningsQuery } from '@/lib/api/vendorApi';
import { Loader2 } from 'lucide-react';

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];

const EarningsChart = () => {
  const [range, setRange] = useState('30d');
  
  const getStartDate = () => {
    const now = new Date();
    if (range === '7d') now.setDate(now.getDate() - 7);
    else if (range === '30d') now.setDate(now.getDate() - 30);
    else if (range === '3m') now.setMonth(now.getMonth() - 3);
    return now.toISOString();
  };

  const { data: earningsResult, isLoading } = useGetStoreEarningsQuery({ 
    startDate: getStartDate(),
    endDate: new Date().toISOString()
  });

  const earnings = earningsResult?.data;

  // Transform data for charts
  const earningsData = earnings?.transactions?.length ? earnings.transactions : Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: 0
  }));

  const productData = [
    { name: 'Laptop Pro', sales: 0 },
    { name: 'Wireless Mouse', sales: 0 },
    { name: 'Keyboard', sales: 0 },
    { name: 'Monitor', sales: 0 },
    { name: 'USB-C Hub', sales: 0 },
  ];

  const statusData = [
    { name: 'Delivered', value: earnings?.totalEarnings || 0 },
    { name: 'Pending', value: earnings?.pendingClearance || 0 },
  ];

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Earnings Overview</h2>
        <select 
          className="border rounded px-3 py-1.5 text-sm"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="3m">Last 3 months</option>
        </select>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-semibold mb-6">Revenue Over Time</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={earningsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickMargin={10} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCurrency} tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-6">Store Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12}} width={100} />
                <Tooltip cursor={{fill: '#f5f5f5'}} />
                <Bar dataKey="sales" fill="#000" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-semibold mb-6">Earnings Breakdown</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsChart;
