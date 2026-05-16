'use client';

import Image from 'next/image';
import Link from 'next/link'; // ✅ FIX: was missing — caused build crash
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw, Minus, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAddItemMutation } from '@/lib/api/cartApi'; // ✅ FIX: use real API instead of local Redux only
import toast from 'react-hot-toast';

interface ProductViewProps {
  product: any;
}

export default function ProductView({ product }: ProductViewProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addItem, { isLoading: isAdding }] = useAddItemMutation();

  const images = product.images ?? [];
  const displayImage = images[selectedImageIndex]?.imageUrl || '/placeholder.png';

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        quantity,
        product: {
          name: product.name,
          price: product.price,
          images: images,
        },
      }).unwrap();
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted shadow-premium group border-8 border-white"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={displayImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>
            <button className="absolute top-8 right-8 p-4 rounded-2xl bg-white/80 backdrop-blur-md hover:bg-white hover:text-rose-500 transition-all shadow-xl">
              <Heart className="h-7 w-7" />
            </button>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="absolute top-8 left-8 bg-rose-500 text-white text-[10px] font-black px-3 py-1.5 rounded-xl shadow-lg uppercase tracking-widest">
                Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
              </div>
            )}
          </motion.div>

          {/* Clickable image thumbnails — fixed: clicking changes main image */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative aspect-square rounded-2xl overflow-hidden bg-muted border-4 transition-all duration-200 ${
                    i === selectedImageIndex
                      ? 'border-primary shadow-glow-primary scale-105'
                      : 'border-white hover:border-primary/50 shadow-soft'
                  }`}
                >
                  <Image src={img.imageUrl} alt={`${product.name} view ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <Link
              href={`/stores/${product.vendorSlug}`}
              className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[0.3em] mb-6 hover:text-primary/80 transition-colors"
            >
              <span className="bg-primary/10 px-4 py-1.5 rounded-full">{product.vendorName}</span>
            </Link>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">{product.name}</h1>

            <div className="flex items-center gap-6 mb-8">
              <div className="flex items-center bg-amber-500/10 text-amber-700 px-4 py-2 rounded-2xl">
                <Star className="h-5 w-5 fill-amber-500 mr-2" />
                <span className="font-black text-lg">{product.rating?.toFixed(1) || '0.0'}</span>
              </div>
              <span className="text-muted-foreground font-bold text-sm">
                ({product.reviewCount || 0} verified reviews)
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-xl uppercase tracking-widest ${
                product.stockQuantity > 0
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-rose-500/10 text-rose-500'
              }`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
              </span>
            </div>

            <div className="flex items-baseline gap-6 mb-8">
              <span className="text-5xl font-black text-foreground tracking-tighter">{formatPrice(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-2xl text-muted-foreground line-through opacity-40 font-bold">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10 font-medium">
              {product.description || 'Experience unparalleled quality and style with this premium product, handpicked for our exclusive collection.'}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-6 mb-8">
            <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">Qty:</span>
            <div className="flex items-center bg-muted/50 rounded-2xl p-1.5 border border-muted-foreground/10 w-fit">
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-soft transition-all disabled:opacity-30"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-base font-black w-14 text-center">{quantity}</span>
              <button
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-soft transition-all disabled:opacity-30"
                onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                disabled={quantity >= product.stockQuantity}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0 || isAdding}
              className="flex-1 h-16 rounded-2xl bg-primary text-white flex items-center justify-center gap-3 font-black text-lg shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isAdding ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Adding...</>
              ) : (
                <><ShoppingCart className="h-6 w-6" />{product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}</>
              )}
            </button>
            <button className="h-16 px-10 bg-foreground text-background rounded-2xl font-black text-lg hover:bg-foreground/80 transition-all active:scale-95">
              Buy Now
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-muted/30">
            {[
              { icon: ShieldCheck, text: 'Secure Payment', color: 'text-primary bg-primary/10' },
              { icon: Truck, text: 'Fast Shipping', color: 'text-emerald-600 bg-emerald-500/10' },
              { icon: RotateCcw, text: '30-Day Returns', color: 'text-amber-600 bg-amber-500/10' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
