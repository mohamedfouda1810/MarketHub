'use client';

import { useGetOrderDetailQuery } from '@/lib/api/orderApi';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, CheckCircle2, Clock, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data: result, isLoading, error } = useGetOrderDetailQuery(id as string);
  const order = result?.data;

  if (isLoading) {
    return (
      <div className="container px-4 py-24 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container px-4 py-24 text-center">
        <h2 className="text-2xl font-black mb-4">Order Not Found</h2>
        <Link href="/orders" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Placed', status: 'Pending', icon: Clock, color: 'text-amber-500' },
    { label: 'Confirmed', status: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'Shipped', status: 'Shipped', icon: Truck, color: 'text-purple-500' },
    { label: 'Delivered', status: 'Delivered', icon: Package, color: 'text-emerald-500' },
  ];

  const currentStepIdx = steps.findIndex(s => s.status === order.status);

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/orders" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm mb-4">
              <ArrowLeft className="h-4 w-4" /> My Orders
            </Link>
            <h1 className="text-5xl font-black tracking-tight mb-2">Order <span className="text-primary italic">#{order.orderNumber}</span></h1>
            <p className="text-muted-foreground font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-3">
            <button className="h-12 px-6 rounded-xl bg-white border border-muted-foreground/10 font-bold text-sm hover:bg-primary hover:text-white transition-all shadow-soft">Download Invoice</button>
            <button className="btn-gradient h-12 px-6 rounded-xl font-bold text-sm">Track Package</button>
          </div>
        </div>

        {/* Order Status Stepper */}
        <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 md:p-12 shadow-soft">
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 hidden md:block -z-10" />
            
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const Icon = step.icon;
              
              return (
                <div key={step.label} className="flex flex-col items-center text-center gap-4 relative z-10">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                    isCompleted ? "bg-primary text-white scale-110 shadow-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-black uppercase tracking-widest", isCompleted ? "text-primary" : "text-muted-foreground")}>{step.label}</p>
                    {isCurrent && <p className="text-[10px] font-bold text-muted-foreground mt-1">Current Status</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-black mb-8">Order <span className="text-primary italic">Items</span></h2>
            {order.items.map((item: any, idx: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item.productId}
                className="group flex gap-6 p-6 bg-white rounded-3xl border border-muted-foreground/10 hover:border-primary/20 transition-all hover:shadow-premium"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-muted relative flex-shrink-0">
                  <Image src={item.productImage || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'} alt={item.productName} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className="font-black text-xl group-hover:text-primary transition-colors">{item.productName}</h3>
                  <p className="text-muted-foreground font-bold text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="flex flex-col justify-center text-right">
                  <p className="text-lg font-black text-primary">{formatPrice(item.totalPrice)}</p>
                  <p className="text-xs text-muted-foreground font-medium">{formatPrice(item.unitPrice)} each</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar: Details */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 shadow-soft">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" /> Delivery Address
              </h3>
              <div className="text-muted-foreground font-medium space-y-1">
                <p className="text-foreground font-black">{order.shippingAddressSnapshot.fullName}</p>
                <p>{order.shippingAddressSnapshot.street}</p>
                {order.shippingAddressSnapshot.street2 && <p>{order.shippingAddressSnapshot.street2}</p>}
                <p>{order.shippingAddressSnapshot.city}, {order.shippingAddressSnapshot.state} {order.shippingAddressSnapshot.zipCode}</p>
                <p>{order.shippingAddressSnapshot.country}</p>
                <p className="pt-2">{order.shippingAddressSnapshot.phoneNumber}</p>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 shadow-soft">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-black text-sm">{order.paymentMethod}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transaction Secure</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 shadow-soft">
              <h3 className="text-xl font-black mb-6">Total <span className="text-primary italic">Summary</span></h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-bold">{formatPrice(order.totalAmount - 9.99)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground font-bold">{formatPrice(9.99)}</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-end">
                  <span className="font-black text-lg">Order Total</span>
                  <span className="font-black text-3xl text-primary">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
