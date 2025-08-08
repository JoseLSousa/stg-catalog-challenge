'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import Header from '@/components/Header'
import { CartItem } from '@/lib/types'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    const items = stored ? JSON.parse(stored) as CartItem[] : []
    setCart(items)
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone || !address) {
      setError('Por favor, preencha todos os campos')
      return
    }
    if (cart.length === 0) {
      setError('Carrinho vazio')
      return
    }
    const orderInfo = { customer: { name, email, phone, address }, items: cart }
    localStorage.setItem('orderInfo', JSON.stringify(orderInfo))
    router.push('/cart/checkout/payment')
  }

  const total = cart.reduce((sum, i) => sum + i.quantity * i.product.price, 0)

  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Endereço de Entrega</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)} className="mt-1 w-full border rounded-xl px-3 py-2" rows={3} />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">Continuar para Pagamento</button>
          </form>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">Resumo do Pedido</h3>
            <ul className="space-y-2">
              {cart.map(item => (
                <li key={item.product.id} className="flex justify-between">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}