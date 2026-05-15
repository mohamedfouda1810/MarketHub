import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop',
      links: [
        { name: 'All Stores', href: '/stores' },
        { name: 'Categories', href: '/categories' },
        { name: 'Special Offers', href: '/offers' },
        { name: 'New Arrivals', href: '/new' },
      ],
    },
    {
      title: 'Sell',
      links: [
        { name: 'Become a Vendor', href: '/register/vendor' },
        { name: 'Vendor Dashboard', href: '/vendor/dashboard' },
        { name: 'Vendor Guidelines', href: '/vendor-guidelines' },
        { name: 'Fees & Pricing', href: '/fees' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Track Order', href: '/track-order' },
        { name: 'Returns & Refunds', href: '/returns' },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t pt-24 pb-12">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
                M
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                Market<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm">
              The world&apos;s leading multi-vendor marketplace for unique and independent products. 
              Connecting passionate sellers with conscious buyers globally.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all active:scale-95"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h4 className="font-bold text-foreground mb-6">{section.title}</h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact/Newsletter Column */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h4 className="font-bold text-foreground">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Subscribe to get notified about new stores and special offers.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="h-12 w-full rounded-xl bg-muted border-none px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              />
              <button className="h-12 w-full bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/10">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground font-medium">
            &copy; {currentYear} MarketHub Inc. Crafted with ❤️ for independent sellers.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}