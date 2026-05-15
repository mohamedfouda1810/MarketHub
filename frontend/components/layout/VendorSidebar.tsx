'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Star, 
  Tag, 
  BarChart3, 
  Settings,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', href: '/vendor/dashboard', icon: LayoutDashboard },
  { name: 'Products', href: '/vendor/products', icon: Package },
  { name: 'Categories', href: '/vendor/categories', icon: Store },
  { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
  { name: 'Reviews', href: '/vendor/reviews', icon: Star },
  { name: 'Coupons', href: '/vendor/coupons', icon: Tag },
  { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/vendor/settings', icon: Settings },
];

export default function VendorSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <Link href="/" className="font-bold text-xl tracking-tight text-primary">
          MarketHub <span className="text-muted-foreground font-normal text-sm ml-1">Vendor</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            V
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Vendor Store</p>
            <p className="text-xs text-muted-foreground mt-1">vendor@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}