'use client';

import { motion } from 'framer-motion';
import { User, Store, Bell, Shield, CreditCard, Save, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const tabs = [
  { id: 'profile', label: 'Store Profile', icon: Store },
  { id: 'account', label: 'Account Settings', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payouts', label: 'Payouts', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function VendorSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Store <span className="text-primary">Settings</span></h1>
          <p className="text-muted-foreground font-medium">Configure your shop and account preferences.</p>
        </div>
        <button className="btn-gradient h-14 px-8 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl shadow-primary/20">
          <Save className="h-5 w-5" /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs Sidebar */}
        <div className="flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl font-bold transition-all",
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
            className="bg-white rounded-[2.5rem] border border-muted-foreground/10 p-8 md:p-12 shadow-soft"
          >
            {activeTab === 'profile' && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-2xl font-black mb-8">Store <span className="text-primary">Profile</span></h3>
                  
                  {/* Store Logo/Banner */}
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[2.5rem] bg-muted overflow-hidden border-4 border-white shadow-soft">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop" alt="Store Avatar" />
                      </div>
                      <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg transform translate-x-2 translate-y-2 hover:scale-110 transition-all">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">TechStore Global</h4>
                      <p className="text-muted-foreground font-medium mb-4 text-sm">Update your shop logo and presence.</p>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-muted text-xs font-black uppercase tracking-widest hover:bg-muted/80 transition-all">Upload New</button>
                        <button className="px-4 py-2 rounded-lg text-destructive text-xs font-black uppercase tracking-widest hover:bg-destructive/5 transition-all">Remove</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Shop Name</label>
                      <input className="input-premium w-full h-14 px-6 outline-none" defaultValue="TechStore Global" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Store URL</label>
                      <div className="relative">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">markethub.com/</span>
                        <input className="input-premium w-full h-14 pl-32 pr-6 outline-none" defaultValue="techstore-global" />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold ml-1">Store Description</label>
                      <textarea 
                        className="input-premium w-full min-h-[150px] p-6 outline-none resize-none" 
                        defaultValue="We provide the best tech gadgets and electronics from top brands around the world. Trusted by over 10k customers."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black mb-8">Business <span className="text-primary">Details</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Support Email</label>
                      <input className="input-premium w-full h-14 px-6 outline-none" defaultValue="support@techstore.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold ml-1">Phone Number</label>
                      <input className="input-premium w-full h-14 px-6 outline-none" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== 'profile' && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary mb-6">
                  <activeTab.icon className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                <p className="text-muted-foreground font-medium max-w-xs">This section is currently under development. Check back soon for more options!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
