'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#000000', '#333333', '#666666', '#999999', '#CCCCCC'];

export const EarningsChart = () => {
  const [range, setRange] = useState('30d');
  
  // Dummy data simulating the API response
  const earningsData = Array.from({ length: 30 }).map((_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: Math.floor(Math.random() * 500) + 100
  }));

  const productData = [
    { name: 'Laptop Pro', sales: 400 },
    { name: 'Wireless Mouse', sales: 300 },
    { name: 'Keyboard', sales: 300 },
    { name: 'Monitor', sales: 200 },
    { name: 'USB-C Hub', sales: 100 },
  ];

  const statusData = [
    { name: 'Delivered', value: 400 },
    { name: 'Processing', value: 300 },
    { name: 'Shipped', value: 300 },
    { name: 'Cancelled', value: 100 },
  ];

  const formatCurrency = (value: number) => `$${value}`;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dashboard</h2>
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
          <h3 className="font-semibold mb-6">Top Products</h3>
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
          <h3 className="font-semibold mb-6">Order Status</h3>
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
