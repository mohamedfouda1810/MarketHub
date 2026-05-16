'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Send, ArrowRight, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const FOOTER_LINKS = [
  {
    title: 'Shop',
    links: [
      { name: 'All Products', href: '/products' },
      { name: 'Curated Stores', href: '/stores' },
      { name: 'Categories', href: '/categories' },
      { name: 'Flash Deals', href: '/offers' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { name: 'Become a Vendor', href: '/register' },
      { name: 'Seller Guidelines', href: '/vendor-guidelines' },
      { name: 'Fee Structure', href: '/fees' },
      { name: 'Market Insights', href: '/insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Track Order', href: '/track-order' },
      { name: 'Blog', href: '/blog' },
    ],
  },
];

const SOCIALS = [
  { Icon: Facebook,  href: '#', color: 'hover:bg-blue-600 hover:text-white',   label: 'Facebook' },
  { Icon: Twitter,   href: '#', color: 'hover:bg-sky-500 hover:text-white',    label: 'Twitter' },
  { Icon: Instagram, href: '#', color: 'hover:bg-rose-500 hover:text-white',   label: 'Instagram' },
  { Icon: Youtube,   href: '#', color: 'hover:bg-red-600  hover:text-white',   label: 'YouTube' },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Secure Payments',    sub: 'SSL encrypted',          color: 'text-primary   bg-primary/10'   },
  { icon: Truck,       label: 'Fast Delivery',      sub: 'Worldwide shipping',     color: 'text-emerald-600 bg-emerald-500/10' },
  { icon: RefreshCw,   label: '30-Day Returns',     sub: 'Hassle-free policy',     color: 'text-amber-600 bg-amber-500/10'  },
  { icon: CreditCard,  label: 'Buyer Protection',   sub: 'Money-back guarantee',   color: 'text-violet-600 bg-violet-500/10' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 800));
    toast.success('You\'re subscribed! 🎉');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="bg-white border-t border-muted/30 mt-24">

      {/* ── Trust Badges Row ───────────────────────────── */}
      <div className="border-b border-muted/20 bg-muted/20">
        <div className="container px-4 md:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {TRUST_BADGES.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground font-medium">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Footer ────────────────────────────────── */}
      <div className="container px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <div className="w-11 h-11 bg-gradient-to-br from-primary to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-glow group-hover:scale-105 transition-transform">
                M
              </div>
              <span className="font-black text-2xl tracking-tighter">
                Market<span className="text-gradient">Hub</span>
              </span>
            </Link>

            <p className="text-muted-foreground leading-relaxed font-medium text-sm max-w-xs">
              The world&apos;s most vibrant marketplace for unique goods. We connect visionary sellers with collectors of the extraordinary.
            </p>

            {/* Social links with brand colors */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, color, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${color}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Contact info */}
            <div className="flex flex-col gap-2">
              <a href="mailto:hello@markethub.com" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
                <Mail className="h-3.5 w-3.5" /> hello@markethub.com
              </a>
              <span className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <MapPin className="h-3.5 w-3.5" /> New York, NY 10001
              </span>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-3 gap-8">
            {FOOTER_LINKS.map((section) => (
              <div key={section.title}>
                <h4 className="font-black text-foreground uppercase tracking-widest text-[10px] mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium flex items-center gap-1.5 group/link"
                      >
                        <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all flex-shrink-0" />
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div>
              <h4 className="font-black text-foreground uppercase tracking-widest text-[10px] mb-3">Stay in the Loop</h4>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                Join 50k+ subscribers. Weekly curated picks & exclusive deals.
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="relative">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="h-12 w-full rounded-2xl bg-muted/50 border border-muted/50 px-5 pr-14 text-sm font-medium focus:border-primary/30 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1.5 top-1.5 h-9 w-9 bg-primary text-white rounded-xl flex items-center justify-center shadow-md hover:shadow-glow transition-all disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </motion.button>
            </form>

            {/* Color palette accent labels */}
            <div className="flex flex-wrap gap-2">
              {['New Arrivals', 'Trending', 'Flash Deals'].map((tag, i) => (
                <span key={tag} className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  i === 0 ? 'bg-primary/10 text-primary' :
                  i === 1 ? 'bg-amber-500/10 text-amber-700' :
                  'bg-rose-500/10 text-rose-600'
                }`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-muted/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-medium">
            &copy; {new Date().getFullYear()} MarketHub Inc. Built with ❤️ for creators everywhere.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map(page => (
              <Link
                key={page}
                href={`/${page.toLowerCase()}`}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-wider"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}