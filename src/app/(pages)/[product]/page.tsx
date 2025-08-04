import Image from 'next/image';
import type { Product } from '../../lib/types';
import { createClient } from "@/utils/supabase/server";

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product: slug } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  const product = data as Product;

  if (error || !data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Produto não encontrado</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem principal */}
        <div>
          <Image
            src={product.images[0] || '/banner.jpg'}
            alt={product.name}
            width={600}
            height={400}
            className="object-cover w-full h-[400px] rounded-2xl shadow-lg"
          />
          {/* Miniaturas */}
          <div className="mt-4 flex space-x-2 overflow-x-auto">
            {product.images.map((img: string, idx: number) => (
              <Image
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                width={100}
                height={100}
                className="object-cover w-24 h-24 rounded-lg cursor-pointer border border-gray-200"
              />
            ))}
          </div>
        </div>
        {/* Detalhes */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <span className="text-2xl font-semibold text-blue-700 mb-4">R$ {product.price.toFixed(2)}</span>
          <p className="text-gray-700 mb-6">{product.description}</p>
          <button className="w-full md:w-auto bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-3 px-6 rounded-xl hover:from-green-600 hover:to-blue-600 transition-colors">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </main>
  );
}