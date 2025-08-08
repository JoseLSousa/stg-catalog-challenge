import { createClient } from '@/lib/supabase/server';
import Header from '@/components/Header';
import Link from 'next/link';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  total: number;
  status: string;
  payment_method: string;
  payment_status: string;
  items: OrderItem[];
}

// Tipo intermediário para o retorno do Supabase
interface OrderRaw extends Omit<Order, 'items'> {
  order_items: OrderItem[];
}

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-lg">Você precisa estar logado para ver seus pedidos.</p>
        </main>
      </>
    );
  }

  // Busca os pedidos do usuário
  const { data: ordersRaw } = await supabase
    .from('orders')
    .select('id, created_at, total, status, payment_method, payment_status, order_items(id, product_id, product_name, product_image, quantity, price)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const orders: Order[] = (ordersRaw as OrderRaw[] | null)?.map((order) => ({
    ...order,
    items: order.order_items,
  })) || [];

  return (
    <>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Meus Pedidos</h1>
        {(!orders || orders.length === 0) ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-3">Nenhum pedido encontrado</h3>
            <p className="text-blue-700 text-lg max-w-md mx-auto">Você ainda não realizou nenhum pedido.</p>
            <Link href="/catalog" className="mt-8 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors">Ver catálogo</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500">Pedido</span>
                    <span className="ml-2 font-semibold text-blue-900">#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 md:mt-0">
                    {new Date(order.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-blue-50 rounded-lg p-2 min-w-[180px]">
                      {item.product_image ? (
                        <Image src={item.product_image} alt={item.product_name} width={48} height={48} className="rounded-lg object-cover w-12 h-12" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">?</div>
                      )}
                      <div>
                        <div className="font-medium text-blue-900 text-sm line-clamp-1">{item.product_name}</div>
                        <div className="text-xs text-gray-600">Qtd: {item.quantity}</div>
                        <div className="text-xs text-green-700 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2 md:mb-0">
                    Status: <span className="font-semibold text-blue-700">{order.status}</span> | Pagamento: <span className="font-semibold text-green-700">{order.payment_status}</span>
                  </div>
                  <div className="text-lg font-bold text-green-700">Total: R$ {order.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
