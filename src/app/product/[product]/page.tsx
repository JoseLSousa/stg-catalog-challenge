import Header from '@/components/Header'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import AddToCartButton from '@/components/AddToCartButton'
import { ProductGallery } from '@/components/ProductGallery'

export default async function ProductDetails({ params }: { params: Promise<{ product: string }> }) {
    const productId = await params
    const supabase = await createClient()
    // get product details
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', `${productId.product}`)
        .single()


    if (error || !data) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600">Produto não encontrado</h2>
                    </div>
                </main>
            </>
        )
    }

    const product = data as Product
    return (
        <div>
            <Header />
            <main className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ProductGallery images={product.images} />
                    <div className="flex flex-col">
                        <h1 className="text-3xl font-bold text-blue-900 mb-4">{product.name}</h1>
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        <span className="text-2xl font-bold text-green-600 mb-6">R$ {product.price.toFixed(2)}</span>
                        <AddToCartButton product={product} />
                    </div>
                </div>
            </main>
        </div>
    )
}