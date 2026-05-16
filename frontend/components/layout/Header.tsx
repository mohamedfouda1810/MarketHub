'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, Search, User as UserIcon, Bell, Menu, X, Store, Layers, Grid3x3, LayoutDashboard } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleCart } from '@/lib/store/cartSlice';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';

const NAV_LINKS = [
  { name: 'Stores',      href: '/stores',     icon: Store },
  { name: 'Products',    href: '/products',   icon: Layers },
  { name: 'Categories',  href: '/categories', icon: Grid3x3 },
];

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // ✅ FIX: Search now navigates to /products?search=<term> on Enter
  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      searchRef.current?.blur();
    }
  };

  return (
    <>
      <header className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled ? 'h-16 bg-white/90 backdrop-blur-xl shadow-soft border-b border-muted/30' : 'h-20 bg-white/70 backdrop-blur-md'
      )}>
        <div className="container h-full flex items-center justify-between px-4 md:px-8 gap-6">

          {/* ── Logo ─────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center text-white font-black text-lg shadow-glow"
            >
              M
            </motion.div>
            <span className="font-black text-2xl tracking-tighter text-foreground hidden sm:block">
              Market<span className="text-gradient">Hub</span>
            </span>
          </Link>

          {/* ── Nav Links (desktop) ───────────────────── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ name, href }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  )}
                >
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* ── Search Bar (desktop) ──────────────────── */}
          <div className="hidden lg:flex items-center relative group flex-1 max-w-sm xl:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
            <input
              ref={searchRef}
              type="search"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search products… (Enter)"
              className="h-11 w-full rounded-2xl border border-muted/40 bg-muted/40 pl-11 pr-4 text-sm font-medium focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
            />
          </div>

          {/* ── Right Actions ─────────────────────────── */}
          <div className="flex items-center gap-2">

            {isAuthenticated ? (
              <>
                {/* Notifications with pulse-dot animation */}
                <Link
                  href="/account/notifications"
                  className="relative p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  {/* Animated notification dot */}
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 border border-white animate-[pulse-dot_2s_ease-in-out_infinite]" />
                </Link>

                {/* Profile link */}
                <Link
                  href={user?.role === 'Vendor' ? '/vendor/dashboard' : user?.role === 'Admin' || user?.role === 'SuperAdmin' ? '/admin/dashboard' : '/account/profile'}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted/60 transition-colors group"
                  title="Account"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 border border-primary/20 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden xl:block text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors max-w-[80px] truncate">
                    {user?.fullName?.split(' ')[0] ?? 'Account'}
                  </span>
                </Link>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="h-9 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex items-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="h-9 px-4 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 hover:shadow-glow transition-all flex items-center"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(toggleCart())}
              className="relative p-2.5 rounded-xl hover:bg-muted/60 transition-colors group"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center font-black border border-white shadow-rose-glow"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="p-2.5 lg:hidden rounded-xl hover:bg-muted/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-premium z-50 lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between p-6 border-b border-muted/30">
                <span className="font-black text-xl tracking-tighter">
                  Market<span className="text-gradient">Hub</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted/60 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile search */}
              <div className="p-4 border-b border-muted/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search products…"
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/50 border-none text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        router.push(`/products?search=${encodeURIComponent(e.currentTarget.value.trim())}`);
                        setMobileOpen(false);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ name, href, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {name}
                    </Link>
                  );
                })}

                {isAuthenticated && (
                  <Link
                    href={user?.role === 'Vendor' ? '/vendor/dashboard' : '/account/profile'}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all mt-2 border-t border-muted/30 pt-4"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    {user?.role === 'Vendor' ? 'Vendor Dashboard' : 'My Account'}
                  </Link>
                )}
              </nav>

              {/* CTA footer */}
              {!isAuthenticated && (
                <div className="p-4 border-t border-muted/30 flex flex-col gap-3">
                  <Link href="/login" className="w-full h-12 rounded-2xl border-2 border-muted font-bold text-sm flex items-center justify-center hover:border-primary/30 hover:text-primary transition-all">
                    Sign In
                  </Link>
                  <Link href="/register" className="w-full h-12 rounded-2xl bg-primary text-white font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-all">
                    Create Account
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}