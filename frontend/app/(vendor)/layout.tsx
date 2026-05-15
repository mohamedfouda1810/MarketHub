import VendorSidebar from '@/components/layout/VendorSidebar';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <aside className="hidden md:block">
        <VendorSidebar />
      </aside>
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile menu toggle would go here */}
            <span className="font-bold text-lg text-primary">Vendor Panel</span>
          </div>
          <div className="hidden md:flex items-center w-full max-w-sm relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-background px-9 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button className="p-2 rounded-md hover:bg-accent relative">
              <Bell className="h-5 w-5" />
            </button>
            <Link href="/" className="text-sm font-medium hover:underline mr-4">
              View Storefront
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}