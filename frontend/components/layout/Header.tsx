'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Search, User as UserIcon, Bell, Menu, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleCart } from '@/lib/store/cartSlice';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export default function Header() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { setTheme, theme } = useTheme();
  const pathname = usePathname();

  const navLinks = [
    { name: 'Stores', href: '/stores' },
    { name: 'Products', href: '/products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b shadow-sm transition-all duration-300">
      <div className="container flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-2xl group-hover:rotate-6 transition-transform">
              M
            </div>
            <span className="inline-block font-extrabold text-2xl tracking-tight text-foreground">
              Market<span className="text-primary">Hub</span>
            </span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "text-sm font-semibold transition-all hover:text-primary relative py-1",
                  pathname === link.href ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 md:flex-none flex items-center justify-end gap-3 md:gap-6">
          <div className="hidden md:flex items-center relative w-full max-w-[280px] xl:max-w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search unique products..."
              className="flex h-11 w-full rounded-2xl border border-muted-foreground/20 bg-muted/30 px-10 py-2 text-sm transition-all focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/40 outline-none"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-1">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 border-l pl-4 md:pl-6">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className="p-2.5 rounded-xl hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
            >
               <span className="sr-only">Toggle theme</span>
               {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link href="/account/notifications" className="p-2.5 rounded-xl hover:bg-accent/50 transition-colors relative group">
                  <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                  <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                </Link>
                <Link 
                  href={user?.role === 'Vendor' ? '/vendor/dashboard' : '/account/settings'} 
                  className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center hover:ring-2 hover:ring-primary/20 transition-all overflow-hidden"
                >
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </Link>
              </>
            ) : (
              <Link 
                href="/login" 
                className="hidden sm:inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}

            <button 
              onClick={() => dispatch(toggleCart())} 
              className="p-2.5 rounded-xl hover:bg-accent/50 transition-colors relative group ml-1"
            >
              <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold border-2 border-background shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
            
            <button className="p-2.5 lg:hidden rounded-xl hover:bg-accent/50 transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}