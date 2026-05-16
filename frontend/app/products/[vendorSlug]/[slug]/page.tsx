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
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <ProductView product={product} />
    </div>
  );
}
