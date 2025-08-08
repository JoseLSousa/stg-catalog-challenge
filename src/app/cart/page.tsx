'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Image from 'next/image'
import Link from 'next/link'
import { CartItem } from '@/lib/types'
import { Toast } from '@/components/Toast'
import { Button } from '@headlessui/react'

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [toast, setToast] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    const items = stored ? JSON.parse(stored) as CartItem[] : []
    setCart(items)
  }, [])

  const updateCart = (items: CartItem[]) => {
    setCart(items)
    localStorage.setItem('cart', JSON.stringify(items))
  }

  const handleQty = (id: string, delta: number) => {
    const updated = cart
      .map(item => item.product.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    updateCart(updated)
    setToast({ type: 'info', message: 'Carrinho atualizado' })
  }

  const handleRemove = (id: string) => {
    const updated = cart.filter(item => item.product.id !== id)
    updateCart(updated)
    setToast({ type: 'info', message: 'Item removido' })
  }

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <>
      <Header />
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Seu Carrinho</h2>
        {cart.length === 0 ? (
          <div className="text-center space-y-4">
            <p>Seu carrinho está vazio.</p>
            <Link href="/catalog" className="text-blue-600 hover:underline">Voltar ao catálogo</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow">
                <div className="w-24 h-24 relative">
                  {item.product.images[0] && (
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover rounded" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-gray-600">R$ {item.product.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => handleQty(item.product.id, -1)} className="px-2 bg-gray-200 rounded">-</Button>
                  <span>{item.quantity}</span>
                  <Button onClick={() => handleQty(item.product.id, 1)} className="px-2 bg-gray-200 rounded">+</Button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                  <Button onClick={() => handleRemove(item.product.id)} className="text-red-600 hover:underline">Remover</Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-6">
              <span className="text-xl font-bold">Total: R$ {total.toFixed(2)}</span>
              <Link href='/cart/checkout' className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">
                Finalizar Compra
              </Link>
            </div>
          </div>
        )}
      </main>
    </>
  )
}