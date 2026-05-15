import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductView from '@/components/product/ProductView';

type Props = {
  params: { vendorSlug: string; slug: string };
};

// Simulated fetch function for server components
async function getProduct(vendorSlug: string, slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${vendorSlug}/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.vendorSlug, params.slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | MarketHub`,
    description: product.description?.substring(0, 160) || 'Buy this amazing product on MarketHub.',
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.vendorSlug, params.slug);

  if (!product) {
    // For demo purposes, if API fails, we provide a placeholder
    const placeholderProduct = {
      id: 'demo-1',
      name: 'Premium Handcrafted Accessory',
      price: 129.99,
      description: 'A masterpiece of design and functionality, this handcrafted accessory is made from the finest materials to ensure durability and style.',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
      vendorName: 'Artisan Collective',
      vendorId: 'vendor-1',
    };
    
    return (
      <div className="min-h-screen bg-background">
        <ProductView product={placeholderProduct} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductView product={product} />
    </div>
  );
}
