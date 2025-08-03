export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compare_price?: number;
  sku?: string;
  stock_quantity: number;
  category_id?: string;
  category?: Category;
  image_url: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  customer_email?: string;
  customer_name?: string;
  customer_phone?: string;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    complement?: string;
  };
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}