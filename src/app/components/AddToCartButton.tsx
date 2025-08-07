'use client'

import { Toast } from './Toast'
import { Product } from '@/lib/types'
import { Button } from '@headlessui/react'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { redirect } from 'next/navigation'

interface AddToCartButtonProps {
    product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const [toast, setToast] = useState(false)



    async function handleAddToCart() {
        await isUserLoggedIn()
        // Retrieve existing cart from localStorage
        const cartStr = localStorage.getItem('cart')
        const cart = cartStr ? JSON.parse(cartStr) as { product: Product; quantity: number }[] : []

        // Check if product already in cart
        const existingItem = cart.find(item => item.product.id === product.id)
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            cart.push({ product, quantity: 1 })
        }

        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(cart))

        // Show success toast
        setToast(true)
    }

    const handleCloseToast = () => {
        setToast(false)
    }


    async function isUserLoggedIn() {
        const supabase =  await createClient()
        const { data, error } = await supabase.auth.getClaims()
        if (error || !data?.claims) {
            redirect("/auth/login");
        }
    }


    return (
        <>
            {toast && (
                <Toast
                    type="success"
                    message="Produto adicionado ao carrinho"
                    duration={3000}
                    onClose={handleCloseToast}
                />
            )}
            <Button
                onClick={handleAddToCart}
                className="mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl py-2 hover:from-green-600 hover:to-blue-600 cursor-pointer"
            >
                Adicionar ao Carrinho
            </Button>
        </>
    )
}
