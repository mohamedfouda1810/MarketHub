import { DollarSign, ShoppingBag, Package, Star } from 'lucide-react';

export default function VendorDashboard() {
  const stats = [
    { name: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: DollarSign },
    { name: 'Orders', value: '+2,350', change: '+15.2%', icon: ShoppingBag },
    { name: 'Products Active', value: '124', change: '+3', icon: Package },
    { name: 'Average Rating', value: '4.8', change: '+0.2', icon: Star },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store&apos;s performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">{stat.name}</h3>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-emerald-500 font-medium">{stat.change}</span> from last month
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-4 p-6">
           <h3 className="font-semibold leading-none tracking-tight mb-4">Revenue Overview</h3>
           <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md border border-dashed">
             <span className="text-muted-foreground">Chart Placeholder (Recharts)</span>
           </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-3 p-6">
           <h3 className="font-semibold leading-none tracking-tight mb-4">Recent Orders</h3>
           <div className="space-y-4">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                 <div>
                   <p className="text-sm font-medium">Order #ORD-{1000+i}</p>
                   <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                 </div>
                 <div className="text-right">
                   <p className="text-sm font-bold">$129.00</p>
                   <p className="text-xs text-emerald-500 font-medium">Completed</p>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}