'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const supabase = createClient();
        
        // Search for products that match the query in name or description
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setResults(data || []);
      } catch (err) {
        console.error('Error searching products:', err);
        setError('Não foi possível carregar os resultados da busca.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
      <Header />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          {query ? `Resultados para "${query}"` : 'Busca'}
        </h1>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <p>Carregando resultados...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            <p>{error}</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <Link 
                href={`/product/${product.id}`}
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow duration-300"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover object-center"
                      width={300}
                      height={300}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <p className="text-gray-400">Sem imagem</p>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-blue-600 font-bold mt-2">R$ {product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum resultado encontrado para &quot;{query}&quot;</p>
            <p className="mt-2 text-gray-400">Tente buscar por outro termo.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Digite um termo de busca acima para encontrar produtos.</p>
          </div>
        )}
      </main>
    </>
  );
}
