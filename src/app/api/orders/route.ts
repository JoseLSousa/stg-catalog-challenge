import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    const { customer, items, payment } = body
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request data. Customer and items are required.' },
        { status: 400 }
      )
    }
    
    const supabase = await createClient()
    
    // Get user session
    const { data: sessionData } = await supabase.auth.getSession()
    const userId = sessionData.session?.user.id || null

    // Calculate total
    const total = items.reduce((sum: number, item: any) => sum + item.quantity * item.product.price, 0)

    // Insert order
    const orderData = {
      user_id: userId,
      total,
      status: 'pending',
      customer_email: customer.email,
      customer_name: customer.name,
      customer_phone: customer.phone,
      shipping_address: JSON.stringify({ address: customer.address }),
      payment_method: body.payment?.method || 'credit_card',
      payment_status: 'paid'
    }
    
    console.log('Creating order with data:', orderData)
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select('id')
      .single()
    if (orderError || !order) {
      throw orderError || new Error('Failed to create order')
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
      product_name: item.product.name,
      product_image: item.product.images[0] || null
    }))
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
    if (itemsError) {
      throw itemsError
    }

    return NextResponse.json({ orderId: order.id })
  } catch (err: any) {
    console.error('Error creating order:', err)
    return NextResponse.json({ 
      error: err.message || 'An error occurred while processing your order',
      details: err.details || err.toString() 
    }, { status: 500 })
  }
}
