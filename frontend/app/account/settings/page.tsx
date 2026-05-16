'use client';

import { motion } from 'framer-motion';
import { User, MapPin, Package, Bell, Shield, CreditCard, Save, Camera, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const tabs = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'Order History', icon: Package },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-2 text-foreground">Account <span className="text-primary italic">Settings.</span></h1>
            <p className="text-muted-foreground font-medium text-lg">Manage your personal information, addresses, and preferences.</p>
          </div>
          <button className="btn-gradient h-14 px-8 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl shadow-primary/20">
            <Save className="h-5 w-5" /> Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Tabs Sidebar */}
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-[1.5rem] font-black text-sm transition-all",
                  activeTab === tab.id 
                    ? "bg-primary text-white shadow-glow" 
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[3rem] border border-muted-foreground/10 p-8 md:p-16 shadow-soft"
            >
              {activeTab === 'profile' && (
                <div className="space-y-12">
                  <div>
                    <h3 className="text-3xl font-black mb-10 flex items-center gap-3">
                      <User className="h-8 w-8 text-primary" /> Personal Information
                    </h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
                      <div className="relative group">
                        <div className="w-40 h-40 rounded-[3rem] bg-muted overflow-hidden border-4 border-white shadow-premium">
                          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop" alt="User Avatar" />
                        </div>
                        <button className="absolute bottom-2 right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg transform translate-x-2 translate-y-2 hover:scale-110 transition-all border-4 border-white">
                          <Camera className="h-6 w-6" />
                        </button>
                      </div>
                      <div className="text-center md:text-left">
                        <h4 className="text-2xl font-black mb-1">Alex Johnson</h4>
                        <p className="text-muted-foreground font-medium mb-6">alex.johnson@example.com</p>
                        <div className="flex gap-3 justify-center md:justify-start">
                          <button className="px-6 py-2.5 rounded-xl bg-muted text-xs font-black uppercase tracking-widest hover:bg-muted/80 transition-all">Upload New</button>
                          <button className="px-6 py-2.5 rounded-xl text-destructive text-xs font-black uppercase tracking-widest hover:bg-destructive/5 transition-all">Remove</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-sm font-black ml-1 uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <input className="input-premium w-full h-14 px-8 outline-none" defaultValue="Alex Johnson" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black ml-1 uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <input className="input-premium w-full h-14 px-8 outline-none" defaultValue="alex.johnson@example.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black ml-1 uppercase tracking-widest text-muted-foreground">Phone Number</label>
                        <input className="input-premium w-full h-14 px-8 outline-none" defaultValue="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-black ml-1 uppercase tracking-widest text-muted-foreground">Birthday</label>
                        <input type="date" className="input-premium w-full h-14 px-8 outline-none" defaultValue="1995-06-15" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-3xl font-black flex items-center gap-3">
                      <MapPin className="h-8 w-8 text-primary" /> My Addresses
                    </h3>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary/5 text-primary font-black text-sm hover:bg-primary/10 transition-all">
                      <Plus className="h-4 w-4" /> Add New
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-8 rounded-[2.5rem] border-2 border-primary bg-primary/5 relative">
                      <span className="absolute top-6 right-8 text-[10px] font-black uppercase tracking-widest text-primary bg-white px-3 py-1 rounded-full shadow-sm">Default</span>
                      <h4 className="font-black text-xl mb-4">Home</h4>
                      <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                        123 Market Street, Apt 4B<br />
                        New York, NY 10001<br />
                        United States
                      </p>
                      <div className="flex gap-4 pt-4 border-t border-primary/10">
                        <button className="text-sm font-black text-primary hover:underline">Edit</button>
                        <button className="text-sm font-black text-muted-foreground hover:text-destructive transition-colors">Delete</button>
                      </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] border border-muted-foreground/10 hover:border-primary/30 transition-all group">
                      <h4 className="font-black text-xl mb-4 group-hover:text-primary transition-colors">Work</h4>
                      <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                        500 Tech Plaza, Suite 1200<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                      <div className="flex gap-4 pt-4 border-t border-muted">
                        <button className="text-sm font-black text-primary hover:underline">Edit</button>
                        <button className="text-sm font-black text-muted-foreground hover:text-destructive transition-colors">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== 'profile' && activeTab !== 'addresses' && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-24 h-24 bg-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary mb-8">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)?.icon || User;
                      return <Icon className="h-12 w-12" />;
                    })()}
                  </div>
                  <h3 className="text-3xl font-black mb-4">{tabs.find(t => t.id === activeTab)?.label}</h3>
                  <p className="text-xl text-muted-foreground font-medium max-w-md">This section is currently under development. Check back soon for more powerful tools!</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}