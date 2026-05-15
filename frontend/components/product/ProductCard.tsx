import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import { Star, ShoppingCart, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400';

  return (
    <div className="group relative rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-destructive text-muted-foreground">
        <Heart className="h-4 w-4" />
      </button>

      <Link 
        href={`/products/${product.vendor?.storeSlug || product.vendorId}/${product.slug}`} 
        className="relative aspect-[4/5] overflow-hidden bg-muted"
      >
        <Image 
          src={imageUrl} 
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute bottom-3 left-3 flex flex-col gap-2">
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <div className="bg-destructive text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
              {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
            </div>
          )}
          {product.stock === 0 && (
            <div className="bg-muted-foreground/80 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg">
              OUT OF STOCK
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          {product.vendor && (
            <Link 
              href={`/stores/${product.vendor.storeSlug}`} 
              className="text-[10px] uppercase tracking-widest font-bold text-primary/70 hover:text-primary transition-colors mb-1 block"
            >
              {product.vendor.storeName}
            </Link>
          )}
          <Link 
            href={`/products/${product.vendor?.storeSlug || product.vendorId}/${product.slug}`} 
            className="font-bold text-lg hover:text-primary transition-colors line-clamp-1 leading-tight"
          >
            {product.name}
          </Link>
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center bg-primary/5 px-1.5 py-0.5 rounded-md">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-bold text-primary ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-medium">({product.reviewCount} reviews)</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-extrabold text-xl text-foreground tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through opacity-60">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          
          <button className="h-10 w-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}