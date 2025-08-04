import Image from 'next/image';
import { createClient } from '../../utils/supabase/server';
import { Product } from '../../lib/types';

export default async function Catalog() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*');
  const products = (data ?? []) as Product[];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Catálogo de Produtos</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products?.map(product => (
            <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={product.images && product.images.length > 0 ? product.images[0] : '/banner.jpg'}
                alt={product.name}
                width={400}
                height={250}
                className="object-cover w-full h-48"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h2>
                {product.description && (
                  <p className="mt-2 text-sm text-gray-600 truncate">{product.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
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