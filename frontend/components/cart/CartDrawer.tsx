'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { toggleCart, removeFromCart, updateQuantity, clearCart } from '@/lib/store/cartSlice';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state: RootState) => state.cart);

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={() => dispatch(toggleCart())}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full md:w-[450px] bg-background border-l shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black text-xl tracking-tight">Your Cart</h2>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
                </div>
              </div>
              <button 
                onClick={() => dispatch(toggleCart())}
                className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-muted-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-8 max-w-[200px]">Looks like you haven&apos;t added anything to your cart yet.</p>
                  <button 
                    onClick={() => dispatch(toggleCart())}
                    className="btn-gradient px-8 py-3 rounded-xl font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div 
                      layout
                      key={item.id} 
                      className="group flex gap-5 border border-muted/50 rounded-[1.5rem] p-4 bg-card hover:border-primary/20 transition-all hover:shadow-soft"
                    >
                      <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="flex flex-col flex-1 justify-center">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors">{item.productName}</h4>
                          <button 
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-sm font-black text-foreground mb-4">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center bg-muted/50 rounded-xl p-1 border">
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background transition-colors disabled:opacity-30"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(1, item.quantity - 1) }))}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background transition-colors"
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 bg-muted/20 border-t space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground font-medium">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold uppercase text-[10px]">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-black text-lg">Total</span>
                    <span className="font-black text-2xl text-primary">{formatPrice(cartTotal)}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Link 
                    href="/checkout"
                    onClick={() => dispatch(toggleCart())}
                    className="w-full h-14 btn-gradient rounded-2xl flex items-center justify-center font-black text-lg gap-2"
                  >
                    Proceed to Checkout <ArrowRight className="h-5 w-5" />
                  </Link>
                  <button 
                    onClick={() => dispatch(clearCart())}
                    className="text-xs font-bold text-muted-foreground hover:text-destructive transition-colors uppercase tracking-widest"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}