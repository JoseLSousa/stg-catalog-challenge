'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { CartItem } from '@/lib/types'
import { Toast } from '@/components/Toast'
import { createClient } from '@/lib/supabase/client'

interface OrderInfo {
    customer: {
        name: string
        email: string
        phone: string
        address: string
    }
    items: CartItem[]
}

interface UserData {
    id: string;
    email: string;
    name: string;
    phone: string;
}

export default function PaymentPage() {
    const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null)
    const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    // Form state
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [expiryDate, setExpiryDate] = useState('')
    const [cvv, setCvv] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('credit_card')

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                setUserData({
                    id: user.id || '',
                    email: user.email || '',
                    name: user.user_metadata.username || 'Usuário',
                    phone: user.user_metadata.phoneNumber || ''
                })
            }

            const stored = localStorage.getItem('orderInfo')
            if (stored) {
                setOrderInfo(JSON.parse(stored))
            }

            setLoading(false)
        }

        fetchUserData()
    }, [])

    if (!orderInfo) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-lg">Pedido não encontrado.</p>
                </main>
            </>
        )
    }

    const total = orderInfo.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    const validatePaymentForm = () => {
        if (paymentMethod === 'credit_card') {
            if (!cardNumber || !cardName || !expiryDate || !cvv) {
                setToast({ type: 'error', message: 'Preencha todos os dados do cartão' })
                return false
            }

            if (cardNumber.replace(/\s/g, '').length !== 16) {
                setToast({ type: 'error', message: 'Número do cartão inválido' })
                return false
            }

            if (cvv.length < 3) {
                setToast({ type: 'error', message: 'CVV inválido' })
                return false
            }
        }

        return true
    }

    const handleConfirm = async () => {
        if (!validatePaymentForm()) return

        try {
            // Use user data from authentication instead of form data
            const customer = userData ? {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: orderInfo?.customer?.address || ''
            } : orderInfo?.customer

            const paymentData = {
                method: paymentMethod,
                cardLast4: cardNumber.slice(-4)
            }

            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer,
                    items: orderInfo?.items,
                    payment: paymentData
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Erro ao processar o pedido')
            }

            const result = await response.json()
            console.log('Order created:', result)

            // Success flow
            setToast({ type: 'success', message: 'Pagamento processado com sucesso!' })
            localStorage.removeItem('orderInfo')
            localStorage.removeItem('cart')

            // Format WhatsApp message in requested format
            const customerName = userData?.name || customer.name
            const customerEmail = userData?.email || customer.email

            // Build products list
            const productsList = orderInfo.items.map(item =>
                `•⁠  ⁠${item.product.name} - Qtd: ${item.quantity} - R$ ${(item.product.price * item.quantity).toFixed(2)}`
            ).join('\n')

            const whatsAppMessage = `NOVO PEDIDO - STG CATALOG
Cliente: ${customerName}
Email: ${customerEmail}
PRODUTOS:
${productsList}
TOTAL: R$ ${total.toFixed(2)}`

            // Open WhatsApp with formatted message
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsAppMessage)}`
            setTimeout(() => window.open(whatsappUrl, '_blank'), 2000)

        } catch (error: unknown) {
            let message = 'Ocorreu um erro ao processar seu pedido';
            if (error instanceof Error) message = error.message;
            setToast({ type: 'error', message })
            console.error('Order error:', error)
        }
    }

    if (loading) {
        return (
            <>
                <Header />
                <main className="min-h-screen flex items-center justify-center">
                    <p className="text-lg">Carregando...</p>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            <main className="container mx-auto py-12 px-4">
                <h2 className="text-2xl font-bold mb-6">Pagamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded shadow space-y-4">
                        <h3 className="text-xl font-semibold mb-4">Dados do Pagamento</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full border rounded-xl px-3 py-2"
                                >
                                    <option value="credit_card">Cartão de Crédito</option>
                                    <option value="pix">PIX</option>
                                </select>
                            </div>

                            {paymentMethod === 'credit_card' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value.replace(/[^\d\s]/g, ''))}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="w-full border rounded-xl px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                                        <input
                                            type="text"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            className="w-full border rounded-xl px-3 py-2"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                                            <input
                                                type="text"
                                                value={expiryDate}
                                                onChange={(e) => setExpiryDate(e.target.value)}
                                                placeholder="MM/AA"
                                                maxLength={5}
                                                className="w-full border rounded-xl px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                            <input
                                                type="text"
                                                value={cvv}
                                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                                maxLength={4}
                                                className="w-full border rounded-xl px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {paymentMethod === 'pix' && (
                                <div className="text-center py-4">
                                    <p className="mb-2">Chave PIX:</p>
                                    <p className="font-mono bg-gray-100 p-2 rounded">comercial@stg.com.br</p>
                                    <p className="mt-4 text-sm text-gray-600">Após confirmação, enviaremos o comprovante pelo WhatsApp</p>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                className="mt-4 w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
                            >
                                {paymentMethod === 'credit_card' ? 'Confirmar Pagamento' : 'Gerar Código PIX'}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded shadow space-y-4">
                        <h3 className="font-semibold text-xl mb-4">Resumo do Pedido</h3>

                        <div className="mb-4 pb-4 border-b">
                            <h4 className="font-medium text-gray-700 mb-2">Cliente</h4>
                            <p className="text-sm">{userData?.name || orderInfo?.customer?.name}</p>
                            <p className="text-sm">{userData?.email || orderInfo?.customer?.email}</p>
                            <p className="text-sm">{userData?.phone || orderInfo?.customer?.phone}</p>
                            <p className="text-sm">{orderInfo?.customer?.address}</p>
                        </div>

                        <div>
                            <h4 className="font-medium text-gray-700 mb-2">Itens</h4>
                            <ul className="space-y-2">
                                {orderInfo?.items.map(item => (
                                    <li key={item.product.id} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.product.name}</span>
                                        <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-between font-bold mt-4 pt-4 border-t">
                            <span>Total:</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
