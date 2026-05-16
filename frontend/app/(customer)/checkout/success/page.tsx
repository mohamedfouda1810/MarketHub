'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CheckoutSuccessPage() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      color: ['#5c73ff', '#10b981', '#f59e0b', '#f43f5e'][Math.floor(Math.random() * 4)]
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="container px-4 py-24 flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 15, stiffness: 200 }}
        className="w-32 h-32 bg-green-500 rounded-[2.5rem] flex items-center justify-center mb-12 shadow-2xl shadow-green-500/20"
      >
        <CheckCircle2 className="h-16 w-16 text-white" />
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x: p.x * 4, y: p.y * 4, opacity: 0, scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute w-3 h-3 rounded-full"
            style={{ backgroundColor: p.color }}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl font-black tracking-tight mb-4">Order <span className="text-green-500">Confirmed!</span></h1>
        <p className="text-muted-foreground text-xl font-medium mb-12 max-w-md mx-auto">
          Thank you for your purchase. Your order #MH-7721 has been placed successfully and is being processed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-12">
          <div className="p-6 rounded-3xl border border-muted-foreground/10 bg-white shadow-soft">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Estimated Delivery</p>
            <p className="text-lg font-black">May 20 - May 22, 2026</p>
          </div>
          <div className="p-6 rounded-3xl border border-muted-foreground/10 bg-white shadow-soft">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Order Total</p>
            <p className="text-lg font-black text-primary">$124.98</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-gradient px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-2">
            Continue Shopping <ArrowRight className="h-5 w-5" />
          </Link>
          <button className="px-10 py-4 rounded-2xl font-black text-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all flex items-center gap-2">
            <Download className="h-5 w-5" /> Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}