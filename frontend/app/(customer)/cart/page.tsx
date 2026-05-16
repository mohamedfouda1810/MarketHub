'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { removeFromCart, updateQuantity, clearCart } from '@/lib/store/cartSlice';
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="container px-4 py-24 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-32 h-32 bg-primary/5 rounded-[2.5rem] flex items-center justify-center mb-8"
        >
          <ShoppingBag className="h-16 w-16 text-primary/20" />
        </motion.div>
        <h1 className="text-4xl font-black mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-12 max-w-md font-medium">
          It looks like you haven&apos;t added any products to your cart yet. Explore our latest collections and find something you love.
        </p>
        <Link href="/" className="btn-gradient px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-2">
          Start Shopping <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm mb-4">
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>
            <h1 className="text-5xl font-black tracking-tight">Shopping <span className="text-primary">Cart</span></h1>
          </div>
          <div className="bg-primary/5 px-6 py-3 rounded-2xl border border-primary/10">
            <span className="text-sm font-bold text-primary uppercase tracking-widest">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={item.id}
                className="group relative flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-3xl border border-muted-foreground/10 hover:border-primary/20 transition-all hover:shadow-premium"
              >
                <div className="relative h-40 w-40 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                </div>

                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-black group-hover:text-primary transition-colors">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground font-medium">Ships in 1-2 business days</p>
                    </div>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center bg-muted/50 rounded-2xl p-1.5 border w-fit">
                      <button 
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-soft transition-all disabled:opacity-30"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="text-base font-black w-12 text-center">{item.quantity}</span>
                      <button 
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-soft transition-all"
                        onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground font-bold mb-1 uppercase tracking-wider">Price</p>
                      <p className="text-2xl font-black text-foreground">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <button 
              onClick={() => dispatch(clearCart())}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all font-bold text-sm"
            >
              <Trash2 className="h-4 w-4" /> Clear Shopping Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-muted-foreground/10 shadow-soft sticky top-32">
              <h2 className="text-2xl font-black mb-8">Order <span className="text-primary">Summary</span></h2>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-muted">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">Subtotal</span>
                  <span className="font-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">Estimated Shipping</span>
                  <span className="text-green-600 font-bold uppercase text-[10px] bg-green-50 px-2 py-1 rounded-lg">Calculated at Checkout</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-bold">Tax</span>
                  <span className="font-black">{formatPrice(0)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-xl">Order Total</span>
                <span className="font-black text-3xl text-primary">{formatPrice(cartTotal)}</span>
              </div>

              <Link 
                href="/checkout"
                className="w-full h-16 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg gap-2 mb-4"
              >
                Checkout Now <ArrowRight className="h-5 w-5" />
              </Link>
              
              <p className="text-center text-xs text-muted-foreground font-bold uppercase tracking-widest">
                Secure SSL Encryption
              </p>

              <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t">
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <span>100% Secure Checkout</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span>Fast & Reliable Delivery</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                  <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <span>Easy 30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}