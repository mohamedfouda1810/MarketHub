'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store';
import { clearCart } from '@/lib/store/cartSlice';
import { formatPrice } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, Truck, User, MapPin, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const steps = ['Details', 'Shipping', 'Payment'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items } = useSelector((state: RootState) => state.cart);
  const router = useRouter();
  const dispatch = useDispatch();

  const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = 9.99;
  const grandTotal = cartTotal + shippingFee;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      // Mock order creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      router.push('/checkout/success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isProcessing) {
    return (
      <div className="container px-4 py-24 text-center">
        <h1 className="text-3xl font-black mb-6">No items to checkout</h1>
        <Link href="/" className="btn-gradient px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Go back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <h1 className="text-5xl font-black tracking-tight">Check<span className="text-primary">out</span></h1>
          
          {/* Stepper */}
          <div className="flex items-center gap-4">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-black transition-all duration-300",
                    idx < currentStep ? "bg-green-500 text-white" : idx === currentStep ? "bg-primary text-white shadow-glow scale-110" : "bg-muted text-muted-foreground"
                  )}>
                    {idx < currentStep ? <CheckCircle2 className="h-6 w-6" /> : idx + 1}
                  </div>
                  <span className={cn("text-xs font-black uppercase tracking-widest", idx === currentStep ? "text-primary" : "text-muted-foreground")}>{step}</span>
                </div>
                {idx < steps.length - 1 && <div className="w-12 h-1 bg-muted rounded-full" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Checkout Flow */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 border border-muted-foreground/10 shadow-soft">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                        <User className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black">Personal Information</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">First Name</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Last Name</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="Doe" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold ml-1">Email Address</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="john@example.com" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 border border-muted-foreground/10 shadow-soft">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black">Shipping Address</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-bold ml-1">Street Address</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="123 Market St" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">City</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold ml-1">Zip Code</label>
                        <input className="input-premium w-full h-14 px-6 outline-none" placeholder="10001" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 border border-muted-foreground/10 shadow-soft">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <h2 className="text-2xl font-black">Payment Method</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="p-6 rounded-3xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-8 w-8 text-primary" />
                          <div>
                            <p className="font-black">Credit / Debit Card</p>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Pay securely with Stripe</p>
                          </div>
                        </div>
                        <div className="w-6 h-6 rounded-full border-4 border-primary bg-white" />
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold ml-1">Card Number</label>
                          <input className="input-premium w-full h-14 px-6 outline-none" placeholder="**** **** **** ****" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">Expiry Date</label>
                            <input className="input-premium w-full h-14 px-6 outline-none" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">CVC</label>
                            <input className="input-premium w-full h-14 px-6 outline-none" placeholder="***" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0 || isProcessing}
                className={cn(
                  "px-8 py-4 rounded-2xl font-black flex items-center gap-2 transition-all",
                  currentStep === 0 ? "opacity-0 invisible" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <ArrowLeft className="h-5 w-5" /> Back
              </button>
              
              <button
                onClick={handleNext}
                disabled={isProcessing}
                className="btn-gradient px-12 py-4 rounded-2xl font-black text-lg min-w-[200px] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {currentStep === steps.length - 1 ? 'Place Order' : 'Continue'}
                    <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-muted-foreground/10 shadow-soft sticky top-32">
              <h2 className="text-2xl font-black mb-8">In Your <span className="text-primary">Cart</span></h2>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 pb-8 border-b border-muted">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.productName} width={64} height={64} className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm line-clamp-1">{item.productName}</p>
                      <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity}</p>
                      <p className="text-sm font-black text-primary">{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-bold">Subtotal</span>
                  <span className="font-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-bold">Shipping Fee</span>
                  <span className="font-black">{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="font-black text-lg">Total</span>
                  <span className="font-black text-2xl text-primary">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Checkout
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Lock className="h-4 w-4 text-primary" /> SSL Encryption
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}