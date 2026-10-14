export type OrderStatus = 'Pendiente' | 'Confirmado' | 'Preparando' | 'Enviado' | 'Entregado';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  sku: string;
  image: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  inStock: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  date: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string; // e.g., PED-2026-8941
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  paymentMethod: 'Tarjeta de Crédito / Débito' | 'Transferencia Bancaria (SPEI)' | 'Pago Contra Entrega';
  items: OrderItem[];
  subtotal: number;
  tax: number; // 16% IVA
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  estimatedDelivery: string;
  timeline: OrderTimelineEvent[];
}

export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type ViewType = 
  | 'login'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-tracking'
  | 'admin-products'
  | 'admin-orders';

export interface ScreenSpecification {
  id: ViewType;
  title: string;
  roleRequired: string;
  goal: string; // Objetivo
  inputs: string[]; // Elementos de entrada
  infoDisplayed: string[]; // Información mostrada
  availableActions: string[]; // Acciones disponibles
  validaciones: string[]; // Validaciones necesarias
}
