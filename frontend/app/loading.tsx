'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-24 h-24 bg-primary/10 rounded-squircle-md border-4 border-primary flex items-center justify-center shadow-glow-primary"
        >
          <span className="text-primary font-black text-3xl">M</span>
        </motion.div>
        
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Synchronizing Hub...</p>
        </motion.div>
      </div>
    </div>
  );
}
