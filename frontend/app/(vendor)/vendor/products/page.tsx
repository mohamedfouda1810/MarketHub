'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Search, Plus, Edit, Trash2, ExternalLink, Filter,
  Loader2, CheckCircle, Archive, BarChart3, X, Upload, AlertTriangle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { useGetProductsQuery, useDeleteProductMutation, usePublishProductMutation, useArchiveProductMutation } from '@/lib/api/productApi';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  Active:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Draft:     'bg-amber-50   text-amber-700   border border-amber-200',
  Archived:  'bg-muted      text-muted-foreground border border-muted-foreground/20',
};

const STOCK_COLOR = (qty: number) =>
  qty === 0 ? 'text-rose-500' : qty < 10 ? 'text-amber-600' : 'text-muted-foreground';

export default function VendorProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const { data: result, isLoading, isFetching } = useGetProductsQuery({
    pageNumber: page,
    pageSize: 15,
    vendorOnly: true,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [publishProduct] = usePublishProductMutation();
  const [archiveProduct] = useArchiveProductMutation();

  const products = result?.data?.items ?? [];
  const totalPages = result?.data?.totalPages ?? 1;

  // Client-side search filter (search against already-fetched page)
  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.vendorName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully.');
      setConfirmDelete(null);
    } catch {
      toast.error('Failed to delete product.');
    }
  }, [deleteProduct]);

  const handlePublish = useCallback(async (id: string) => {
    try {
      await publishProduct(id).unwrap();
      toast.success('Product published!');
    } catch {
      toast.error('Failed to publish product.');
    }
  }, [publishProduct]);

  const handleArchive = useCallback(async (id: string) => {
    try {
      await archiveProduct(id).unwrap();
      toast.success('Product archived.');
    } catch {
      toast.error('Failed to archive product.');
    }
  }, [archiveProduct]);

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">
            My <span className="text-gradient">Products</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            {result?.data?.totalCount ?? 0} products in your store
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="btn-primary h-12 px-6 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20 w-fit"
        >
          <Plus className="h-4 w-4" /> Add New Product
        </Link>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-3 p-3 bg-white rounded-[2rem] border border-muted-foreground/10 shadow-soft">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            className="input-premium w-full h-12 pl-11 pr-4"
            placeholder="Search products by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="h-12 px-5 rounded-2xl bg-muted/50 flex items-center gap-2 font-bold text-sm text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
          <Filter className="h-4 w-4" /> Filter
        </button>
        {isFetching && <Loader2 className="h-4 w-4 text-primary animate-spin flex-shrink-0" />}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] border border-muted-foreground/10 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted bg-muted/20">
                {['Product', 'Status', 'Price', 'Stock', 'Actions'].map(col => (
                  <th key={col} className={cn(
                    "px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground",
                    col === 'Actions' && 'text-right'
                  )}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-muted last:border-0">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-muted animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 bg-muted rounded-full animate-pulse w-48" />
                          <div className="h-2 bg-muted rounded-full animate-pulse w-24" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <Package className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="font-black text-muted-foreground">
                      {search ? `No products matching "${search}"` : 'No products yet. Add your first one!'}
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((product: any, idx: number) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group hover:bg-primary/[0.02] transition-colors border-b border-muted/50 last:border-0"
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0 border border-muted shadow-sm">
                            {product.images?.[0]?.imageUrl ? (
                              <Image
                                src={product.images[0].imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                <Package className="h-5 w-5 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-black text-sm group-hover:text-primary transition-colors line-clamp-1">
                              {product.name}
                            </span>
                            <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                              {product.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={cn(
                          'px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider',
                          STATUS_STYLES[product.status] ?? STATUS_STYLES.Draft
                        )}>
                          {product.status}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4">
                        <div>
                          <span className="font-black text-sm">{formatPrice(product.price)}</span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="block text-[10px] text-muted-foreground line-through font-medium">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="px-6 py-4">
                        <span className={cn('font-bold text-sm', STOCK_COLOR(product.stockQuantity))}>
                          {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} units`}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Publish / Archive toggle */}
                          {product.status === 'Draft' || product.status === 'Archived' ? (
                            <button
                              onClick={() => handlePublish(product.id)}
                              title="Publish"
                              className="p-2 rounded-xl hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 transition-all"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleArchive(product.id)}
                              title="Archive"
                              className="p-2 rounded-xl hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-all"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}

                          <Link
                            href={`/vendor/products/${product.id}/edit`}
                            className="p-2 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/products/${product.vendorSlug}/${product.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                            title="View live"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => setConfirmDelete(product.id)}
                            title="Delete"
                            className="p-2 rounded-xl hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-muted bg-muted/20">
            <span className="text-sm text-muted-foreground font-bold">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-9 px-4 rounded-xl border border-muted font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-40"
              >
                Prev
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-9 px-4 rounded-xl border border-muted font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-premium"
            >
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-7 w-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-center mb-2">Delete Product?</h3>
              <p className="text-muted-foreground text-center font-medium mb-8 text-sm">
                This action is permanent and cannot be undone. All associated data will be removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="flex-1 h-12 rounded-2xl border border-muted font-bold text-sm hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={isDeleting}
                  className="flex-1 h-12 rounded-2xl bg-rose-500 text-white font-bold text-sm hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
