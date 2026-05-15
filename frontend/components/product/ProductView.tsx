'use client';

import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/store/cartSlice';
import toast from 'react-hot-toast';

interface ProductViewProps {
  product: any;
}

export default function ProductView({ product }: ProductViewProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.imageUrl || '/placeholder.png',
      vendorId: product.vendorId
    }));
    toast.success('Added to cart!');
  };

  return (
    <div className="container px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-muted shadow-premium group">
            <Image
              src={product.imageUrl || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <button className="absolute top-6 right-6 p-3 rounded-2xl glass hover:bg-white hover:text-destructive transition-all">
              <Heart className="h-6 w-6" />
            </button>
          </div>
        </motion.div>

        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
              <span className="bg-primary/10 px-3 py-1 rounded-full">{product.vendorName}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center bg-yellow-400/10 text-yellow-700 px-3 py-1 rounded-xl">
                <Star className="h-4 w-4 fill-yellow-400 mr-1" />
                <span className="font-bold">4.8</span>
              </div>
              <span className="text-muted-foreground font-medium text-sm">124 verified reviews</span>
            </div>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl font-black text-foreground">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-xl text-muted-foreground line-through opacity-50">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-10">
              {product.description || "Experience unparalleled quality and style with this premium product, handpicked for our exclusive collection."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className="flex-1 h-16 btn-gradient rounded-2xl flex items-center justify-center gap-3 font-black text-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              Add to Cart
            </button>
            <button className="h-16 px-8 bg-muted rounded-2xl font-bold hover:bg-muted/80 transition-all">
              Buy Now
            </button>
          </div>

          {/* Value Propositions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t">
            {[
              { icon: ShieldCheck, text: 'Secure Payment' },
              { icon: Truck, text: 'Fast Shipping' },
              { icon: RotateCcw, text: '30-Day Returns' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-bold">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
