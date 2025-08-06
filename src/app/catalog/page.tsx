import Header from "@/components/Header"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"

// Define type for grouped products
interface GroupedCategory {
    category_id: string;
    category_name: string;
    products: {
        id: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        images: string[];
    }[];
}

export default async function Page() {
    const { data, error } = await fetchData()

    async function fetchData(): Promise<{ data: GroupedCategory[] | null, error: any }> {
        try {
            const supabase = await createClient()
            const { data, error } = await supabase
            .from('products_grouped_by_category')
            .select('*')
            if (error) {
            throw error
            }
            return { data, error: null }
        } catch (error) {
            console.error(error)
            return { data: null, error }
        }
    }
    // Cast data to typed array
    const categories = data as GroupedCategory[]
    if (error) {
        return (
            <div>
                <Header />
                <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao carregar os dados</h2>
                        <p className="text-gray-700">{error.message || "Tente novamente mais tarde."}</p>
                    </div>
                </main>
            </div>
        )
    }
    return (
        <div>
            <Header />

            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">

                {/* Hero Section */}
                <section className="text-center px-4 mb-12">
                    <h1 className="text-5xl font-bold text-blue-900 mb-2">Nosso Catálogo</h1>
                    <p className="text-lg text-blue-700">Explore nossas categorias e descubra produtos incríveis!</p>
                    <div className="w-32 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                </section>
                <section className="container mx-auto px-4 space-y-12">
                    {categories.map((c) => (
                        <div key={c.category_id}>
                            <h2 className="text-3xl font-semibold text-blue-900 mb-6">{c.category_name}</h2>
                            <div className="flex overflow-x-auto space-x-4 pb-4 sm:overflow-visible sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:space-x-0 sm:pb-0">
                                {c.products.map((product: GroupedCategory['products'][0]) => (
                                    <Link
                                        href={`/product/${product.id}`}
                                        key={product.id}
                                        className="group block bg-white rounded-2xl shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0 w-[200px] sm:w-auto h-[320px]"
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
                                        <div className="p-6 flex flex-col">
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
                        </div>
                    ))}
                </section>
            </main>
        </div>
    )
}