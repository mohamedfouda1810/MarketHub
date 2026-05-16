'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import { Star, ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import { useAddItemMutation } from '@/lib/api/cartApi';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addItem, { isLoading: isAdding }] = useAddItemMutation();
  // ✅ FIX: extract .imageUrl string from the ProductImage object
  const primaryImage = product.images?.[0]?.imageUrl || 'https://via.placeholder.com/400';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addItem({
        productId: product.id,
        quantity: 1,
        product: { name: product.name, price: product.price, images: product.images },
      }).unwrap();
      toast.success(`${product.name} added!`);
    } catch {
      toast.error('Could not add to cart.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -12 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-squircle-md border bg-card text-card-foreground shadow-soft overflow-hidden flex flex-col hover:shadow-premium transition-all duration-700"
    >
      {/* Wishlist Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-5 right-5 z-20 p-3 rounded-squircle-sm glass opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-rose-500 text-muted-foreground shadow-xl"
      >
        <Heart className="h-5 w-5" />
      </motion.button>

      <Link 
        href={`/products/${product.vendorSlug || product.vendorId}/${product.slug}`} 
        className="relative aspect-[4/5] overflow-hidden bg-muted m-3 rounded-squircle-sm"
      >
        <Image 
          src={primaryImage} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Badges */}
        <div className="absolute bottom-5 left-5 flex flex-col gap-2">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-rose-500 text-white text-[9px] font-black px-4 py-1.5 rounded-squircle-sm shadow-rose-glow uppercase tracking-widest"
            >
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </motion.div>
          )}
          {product.stockQuantity === 0 && (
            <div className="bg-muted-foreground/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-1.5 rounded-squircle-sm uppercase tracking-widest">
              Sold Out
            </div>
          )}
        </div>
      </Link>

      <div className="p-8 pt-2 flex-1 flex flex-col">
        <div className="mb-4">
          <Link 
            href={`/stores/${product.vendorSlug}`} 
            className="text-[9px] uppercase tracking-[0.3em] font-black text-primary/60 hover:text-primary transition-colors mb-3 block"
          >
            {product.vendorName}
          </Link>
          <Link 
            href={`/products/${product.vendorSlug || product.vendorId}/${product.slug}`} 
            className="font-black text-2xl hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tighter"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {/* ✅ Changed to amber (rating) — more semantically appropriate than green */}
          <div className="flex items-center bg-amber-500/10 px-3 py-1.5 rounded-2xl gap-1.5">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-black text-amber-700">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-60">({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-6 pt-6 border-t border-muted/20">
          <div className="flex flex-col">
            <span className="font-black text-3xl text-foreground tracking-tighter">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-40 font-black tracking-tight">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          <motion.button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0 || isAdding}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-glow hover:shadow-glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
});

export default ProductCard;