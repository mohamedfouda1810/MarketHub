'use client';

import { motion } from 'framer-motion';
import { Package, Search, Plus, MoreVertical, Edit, Trash2, ExternalLink, Filter } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const products = [
  { id: '1', name: 'Premium Wireless Headphones', price: 199.99, stock: 45, status: 'Active', category: 'Electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
  { id: '2', name: 'Minimalist Leather Wallet', price: 49.99, stock: 120, status: 'Active', category: 'Fashion', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&h=200&fit=crop' },
  { id: '3', name: 'Smart Fitness Tracker', price: 89.50, stock: 12, status: 'Low Stock', category: 'Electronics', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=200&h=200&fit=crop' },
  { id: '4', name: 'Organic Cotton T-Shirt', price: 29.00, stock: 0, status: 'Out of Stock', category: 'Fashion', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop' },
];

export default function VendorProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">My <span className="text-primary">Products</span></h1>
          <p className="text-muted-foreground font-medium">Manage your inventory and product listings.</p>
        </div>
        <button className="btn-gradient h-14 px-8 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl shadow-primary/20">
          <Plus className="h-5 w-5" /> Add New Product
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input 
            className="input-premium w-full h-14 pl-12 pr-4 outline-none"
            placeholder="Search products by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="h-14 px-6 rounded-2xl bg-white border border-muted-foreground/10 flex items-center gap-2 font-bold text-muted-foreground hover:text-primary hover:border-primary/20 transition-all shadow-soft">
          <Filter className="h-5 w-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted bg-muted/20">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Product</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Category</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Price</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Stock</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product.id} 
                  className="group hover:bg-primary/[0.02] transition-colors border-b border-muted last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden relative flex-shrink-0 border border-muted">
                        <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                      </div>
                      <span className="font-black text-base group-hover:text-primary transition-colors">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-bold text-muted-foreground">{product.category}</td>
                  <td className="px-8 py-6 font-black">{formatPrice(product.price)}</td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "font-bold",
                      product.stock === 0 ? "text-destructive" : product.stock < 20 ? "text-amber-500" : "text-muted-foreground"
                    )}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                      product.status === 'Active' ? "bg-emerald-50 text-emerald-600" : 
                      product.status === 'Low Stock' ? "bg-amber-50 text-amber-600" : "bg-destructive/5 text-destructive"
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all">
                        <Trash2 className="h-5 w-5" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all">
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
