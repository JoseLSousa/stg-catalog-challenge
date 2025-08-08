import { createClient } from "@/lib/supabase/server"
import Header from "@/components/Header"
import Image from "next/image"
import Link from "next/link"

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category_id: string;
}

export default async function CategoryPage({ params }: { params: { catalog: string } }) {
    const categoryId = params.catalog;
    const supabase = await createClient();
    
    // Fetch category details
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
    
    // Fetch products in this category
    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId);
    
    return (
        <>
            <Header />
            <main className="bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Category Header */}
                    <div className="mb-10">
                        <Link 
                            href="/catalog" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Voltar para todas categorias
                        </Link>
                        
                        <div className="text-center max-w-4xl mx-auto">
                            {category?.image_url && (
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl flex items-center justify-center mb-4 shadow-md">
                                    <Image
                                        src={category.image_url}
                                        alt={category.name || "Categoria"}
                                        className="w-12 h-12 object-contain"
                                        width={48}
                                        height={48}
                                    />
                                </div>
                            )}
                            <h1 className="text-5xl font-bold text-blue-900 mb-2">{category?.name || "Categoria"}</h1>
                            <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                            
                            {category?.description && (
                                <p className="text-lg text-blue-700 mt-6">{category.description}</p>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex flex-wrap gap-6">
                        {products?.map((product) => (
                            <Link 
                                href={`/product/${product.id}`} 
                                key={product.id} 
                                className="group block bg-white rounded-2xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0 w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] h-[320px]"
                            >
                                {/* Product Image */}
                                <div className="relative w-full h-40 bg-gray-100">
                                    {product.images && product.images.length > 0 ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col h-[180px]">
                                    <h3 className="text-xl font-medium text-gray-900 mb-2 truncate whitespace-nowrap" title={product.name}>
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 flex-grow mb-4 line-clamp-3">{product.description}</p>
                                    <div className="mt-auto">
                                        <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    
                    {/* Empty state */}
                    {(!products || products.length === 0) && (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
                            <div className="bg-gradient-to-br from-blue-50 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-blue-900 mb-3">Nenhum produto encontrado</h3>
                            <p className="text-blue-700 text-lg max-w-md mx-auto">Não há produtos disponíveis nesta categoria no momento.</p>
                            
                            <Link 
                                href="/catalog" 
                                className="mt-8 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors"
                            >
                                Ver todas as categorias
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}