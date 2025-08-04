import Image from 'next/image';
import { createClient } from '../../../utils/supabase/server';
import { Product } from '../../../lib/types';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('products_with_category')
    .select('*')
    .eq('category_name', category);
  const products = (data ?? []) as (Product & { category_name: string })[];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-4 lg:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 capitalize">Categoria: {category}</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <Image
                src={product.images[0] || '/banner.jpg'}
                alt={product.name}
                width={320}
                height={180}
                className="object-cover w-full h-36"
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h2>
                {product.description && (
                  <p className="mt-1 text-sm text-gray-600 truncate">{product.description}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                  <a
                    href={`/product/${product.slug}`}
                    className="text-sm font-medium text-blue-500 hover:underline"
                  >
                    Ver mais
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}