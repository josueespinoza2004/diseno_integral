'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  User,
  UserRole,
  ViewType,
  OrderStatus,
  OrderTimelineEvent
} from '@/types';
import { initialProducts, initialOrders, initialUsers, mockCredentials, MockCredential } from '@/lib/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

interface StoreContextType {
  // Navigation & View
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  specDrawerOpen: boolean;
  setSpecDrawerOpen: (open: boolean) => void;

  // Authentication
  currentUser: User | null;
  isAuthenticated: boolean;
  userRole: UserRole;
  loginWithCredentials: (email: string, password: string) => { success: boolean; message: string };
  registerUser: (data: { name: string; email: string; phone: string; password: string }) => { success: boolean; message: string };
  loginAs: (role: UserRole) => void;
  logout: () => void;

  // Products
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  viewProductDetail: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  deleteProduct: (productId: string) => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartTax: number;
  cartShipping: number;
  cartDiscount: number;
  cartTotal: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  addToCart: (product: Product, quantity?: number) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  createOrder: (orderInfo: {
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
  }) => { success: boolean; orderId?: string; message: string };
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Navigation State - starts on login
  const [currentView, setCurrentViewState] = useState<ViewType>('login');
  const [specDrawerOpen, setSpecDrawerOpen] = useState<boolean>(false);

  // Auth State - starts unauthenticated
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('cliente');
  const [userCredentials, setUserCredentials] = useState<MockCredential[]>(mockCredentials);

  const isAuthenticated = currentUser !== null;

  // Protected View Navigation with Role-Based Access Control
  const setCurrentView = (view: ViewType) => {
    if (!currentUser && view !== 'login') {
      showToast(
        'warning',
        'Acceso Restringido',
        'Debes iniciar sesión con tus credenciales para acceder a las pantallas del sistema.'
      );
      setCurrentViewState('login');
      return;
    }

    if (userRole !== 'admin' && (view === 'admin-products' || view === 'admin-orders')) {
      showToast(
        'error',
        'Acceso Denegado',
        'Esta sección requiere privilegios de Administrador. Tu sesión actual es de Cliente.'
      );
      setCurrentViewState('catalog');
      return;
    }

    setCurrentViewState(view);
  };

  // Products State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialProducts[0]);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialOrders[0]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([
    { product: initialProducts[0], quantity: 1 },
    { product: initialProducts[1], quantity: 1 },
  ]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Toasts State
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth Handlers with Burned Credentials Validation
  const loginWithCredentials = (email: string, password: string): { success: boolean; message: string } => {
    const found = userCredentials.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
    );

    if (!found) {
      const msg = 'Credenciales no válidas. Comprueba el correo y la contraseña ingresada.';
      showToast('error', 'Error de Acceso', msg);
      return { success: false, message: msg };
    }

    setCurrentUser(found.user);
    setUserRole(found.role);
    showToast(
      'success',
      '¡Sesión Iniciada!',
      `Has ingresado como ${found.user.name} (${found.role === 'admin' ? 'Administrador' : 'Cliente'}).`
    );

    if (found.role === 'admin') {
      setCurrentViewState('admin-products');
    } else {
      setCurrentViewState('catalog');
    }
    return { success: true, message: 'Acceso exitoso' };
  };

  const registerUser = (data: { name: string; email: string; phone: string; password: string }): { success: boolean; message: string } => {
    const exists = userCredentials.some((c) => c.email.toLowerCase() === data.email.trim().toLowerCase());
    if (exists) {
      const msg = 'Este correo electrónico ya está registrado. Por favor inicia sesión.';
      showToast('error', 'Cuenta Existente', msg);
      return { success: false, message: msg };
    }

    const newUser: User = {
      id: `user-client-${Date.now().toString().slice(-4)}`,
      name: data.name,
      email: data.email.trim(),
      role: 'cliente',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };

    const newCred: MockCredential = {
      email: data.email.trim(),
      password: data.password,
      role: 'cliente',
      user: newUser,
    };

    setUserCredentials((prev) => [...prev, newCred]);
    setCurrentUser(newUser);
    setUserRole('cliente');
    setCurrentViewState('catalog');
    showToast('success', 'Registro Exitoso', `¡Bienvenido(a) ${newUser.name}! Tu cuenta ha sido activada.`);
    return { success: true, message: 'Usuario registrado correctamente' };
  };

  const loginAs = (role: UserRole) => {
    const cred = userCredentials.find((c) => c.role === role) || userCredentials[0];
    setCurrentUser(cred.user);
    setUserRole(role);
    showToast(
      'success',
      'Sesión Iniciada (Demo)',
      `Has ingresado con éxito como ${cred.user.name} (${role === 'admin' ? 'Administrador' : 'Cliente'})`
    );
    if (role === 'admin') {
      setCurrentViewState('admin-products');
    } else {
      setCurrentViewState('catalog');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentViewState('login');
    showToast('info', 'Sesión Finalizada', 'Has cerrado sesión. Para ver el sistema debes volver a autenticarte.');
  };

  // Product Navigation
  const viewProductDetail = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (prod) {
      setSelectedProduct(prod);
      setCurrentView('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Admin Product Actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewsCount: 1,
      inStock: newProdData.stock > 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast('success', 'Producto Registrado', `"${newProduct.name}" se agregó exitosamente al inventario.`);
  };

  const updateProductPrice = (productId: string, newPrice: number) => {
    if (newPrice <= 0) {
      showToast('error', 'Precio Inválido', 'El precio debe ser mayor a $0.00 MXN.');
      return;
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    // Also update price in current cart if present
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, product: { ...item.product, price: newPrice } }
          : item
      )
    );
    showToast('success', 'Precio Actualizado', 'El nuevo precio se ha aplicado al catálogo.');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    if (newStock < 0) {
      showToast('error', 'Existencia Inválida', 'La existencia no puede ser un número negativo.');
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: newStock,
              inStock: newStock > 0,
            }
          : p
      )
    );

    // If new stock is less than current cart quantity, adjust cart
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const adjustedQty = Math.min(item.quantity, newStock);
            return {
              ...item,
              product: { ...item.product, stock: newStock, inStock: newStock > 0 },
              quantity: adjustedQty,
            };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );

    showToast('info', 'Control de Existencias', `Inventario actualizado a ${newStock} unidades.`);
  };

  const deleteProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('warning', 'Producto Eliminado', `"${prod?.name || 'Producto'}" ha sido retirado del sistema.`);
  };

  // Cart Handlers with Strict Stock Validations
  const addToCart = (product: Product, quantity = 1): { success: boolean; message: string } => {
    // Current stock validation
    const currentProdInStore = products.find((p) => p.id === product.id) || product;

    if (currentProdInStore.stock <= 0) {
      const msg = `Lo sentimos, "${product.name}" está agotado y no tiene existencias disponibles.`;
      showToast('error', 'Existencias Insuficientes', msg);
      return { success: false, message: msg };
    }

    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    const existingQuantity = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    const requestedTotal = existingQuantity + quantity;

    if (requestedTotal > currentProdInStore.stock) {
      const msg = `No es posible agregar ${quantity} unidad(es). Solo quedan ${currentProdInStore.stock} disponibles en bodega (ya tienes ${existingQuantity} en tu carrito).`;
      showToast('warning', 'Límite de Existencias Superado', msg);
      return { success: false, message: msg };
    }

    setCart((prev) => {
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: requestedTotal,
        };
        return nextCart;
      } else {
        return [...prev, { product: currentProdInStore, quantity }];
      }
    });

    showToast('success', 'Agregado al Carrito', `Se agregó "${product.name}" (${quantity} pza.) a tu compra.`);
    return { success: true, message: 'Producto agregado exitosamente' };
  };

  const updateCartQuantity = (productId: string, quantity: number): { success: boolean; message: string } => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true, message: 'Producto eliminado del carrito' };
    }

    const currentProd = products.find((p) => p.id === productId);
    if (!currentProd) {
      return { success: false, message: 'Producto no encontrado' };
    }

    if (quantity > currentProd.stock) {
      const msg = `No se pueden solicitar ${quantity} piezas. Solo existen ${currentProd.stock} unidades en almacén.`;
      showToast('warning', 'Stock Insuficiente', msg);
      return { success: false, message: msg };
    }

    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    return { success: true, message: 'Cantidad actualizada' };
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast('info', 'Artículo Removido', `Se quitó "${item.product.name}" del carrito.`);
    }
  };

  const clearCart = () => {
    setCart([]);
    showToast('info', 'Carrito Vaciado', 'Se han removido todos los artículos de la canasta.');
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === 'DESCUENTO10' || trimmed === 'PROMO10') {
      setCouponCode(trimmed);
      setDiscountPercent(0.10); // 10% OFF
      showToast('success', 'Cupón Aplicado', '¡Cupón de 10% de descuento aplicado a tu pedido!');
      return true;
    } else if (trimmed === 'NOVA20') {
      setCouponCode(trimmed);
      setDiscountPercent(0.20); // 20% OFF
      showToast('success', 'Cupón Especial', '¡Descuento promocional de 20% aplicado!');
      return true;
    } else {
      showToast('error', 'Cupón No Válido', 'El código de cupón ingresado no existe o ha expirado.');
      return false;
    }
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartDiscount = cartSubtotal * discountPercent;
  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = taxableAmount * 0.16; // 16% IVA
  const cartShipping = cartSubtotal > 3000 || cartSubtotal === 0 ? 0 : 250.00; // Free shipping over $3000 MXN
  const cartTotal = taxableAmount + cartTax + cartShipping;

  // Order Creation with Inventory Deduction & Order Status Creation
  const createOrder = (orderInfo: {
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
  }): { success: boolean; orderId?: string; message: string } => {
    if (cart.length === 0) {
      return { success: false, message: 'El carrito está vacío.' };
    }

    // Final Atomic Inventory Verification before committing
    for (const item of cart) {
      const prodInDb = products.find((p) => p.id === item.product.id);
      if (!prodInDb || prodInDb.stock < item.quantity) {
        const errorMsg = `No se puede completar el pedido: la existencia de "${item.product.name}" es insuficiente (${prodInDb ? prodInDb.stock : 0} disponibles, solicitaste ${item.quantity}).`;
        showToast('error', 'Error de Existencias', errorMsg);
        return { success: false, message: errorMsg };
      }
    }

    // Deduct stock from inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((i) => i.product.id === prod.id);
        if (itemInCart) {
          const newStock = Math.max(0, prod.stock - itemInCart.quantity);
          return {
            ...prod,
            stock: newStock,
            inStock: newStock > 0,
          };
        }
        return prod;
      })
    );

    const newOrderId = `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const formattedNow = new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const initialTimeline: OrderTimelineEvent[] = [
      {
        status: 'Pendiente',
        date: formattedNow,
        title: 'Pedido Registrado en Sistema',
        description: 'La orden ha sido creada exitosamente y se encuentra en estado inicial Pendiente.',
        completed: false,
        current: true,
      },
      {
        status: 'Confirmado',
        date: 'En espera',
        title: 'Validación de Pago',
        description: 'Verificación bancaria o validación administrativa del pedido.',
        completed: false,
        current: false,
      },
      {
        status: 'Preparando',
        date: 'En espera',
        title: 'Surtido de Almacén',
        description: 'Selección de artículos y embalaje seguro.',
        completed: false,
        current: false,
      },
      {
        status: 'Enviado',
        date: 'En espera',
        title: 'En Ruta de Reparto',
        description: 'Asignación de guía y traslado logístico.',
        completed: false,
        current: false,
      },
      {
        status: 'Entregado',
        date: 'En espera',
        title: 'Entregado a Destinatario',
        description: 'Recepción formal por parte del cliente.',
        completed: false,
        current: false,
      },
    ];

    const newOrder: Order = {
      id: newOrderId,
      createdAt: nowIso,
      customerName: orderInfo.customerName,
      customerEmail: orderInfo.customerEmail,
      customerPhone: orderInfo.customerPhone,
      shippingAddress: orderInfo.shippingAddress,
      paymentMethod: orderInfo.paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
      subtotal: cartSubtotal,
      tax: cartTax,
      shippingCost: cartShipping,
      discount: cartDiscount,
      total: cartTotal,
      status: 'Pendiente', // Starts in required 'Pendiente'
      estimatedDelivery: '4 a 5 días hábiles',
      timeline: initialTimeline,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrder(newOrder);
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);

    showToast('success', '¡Pedido Confirmado!', `Se generó la orden ${newOrderId} en estado "Pendiente".`);
    setCurrentView('order-tracking');
    return { success: true, orderId: newOrderId, message: 'Pedido creado exitosamente' };
  };

  // Admin Order Status Update (Pendiente -> Confirmado -> Preparando -> Enviado -> Entregado)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Entregado'];
    const targetIndex = statusOrder.indexOf(newStatus);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline: OrderTimelineEvent[] = order.timeline.map((step) => {
          const stepIndex = statusOrder.indexOf(step.status);
          const isCompleted = stepIndex < targetIndex;
          const isCurrent = stepIndex === targetIndex;
          const formattedNow = new Intl.DateTimeFormat('es-MX', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date());

          return {
            ...step,
            completed: isCompleted,
            current: isCurrent,
            date: isCompleted || isCurrent ? (step.date === 'En espera' || step.date === 'Pendiente' ? formattedNow : step.date) : 'Pendiente',
          };
        });

        const updatedOrder: Order = {
          ...order,
          status: newStatus,
          timeline: updatedTimeline,
        };

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(updatedOrder);
        }

        return updatedOrder;
      })
    );

    showToast(
      'info',
      'Estado de Pedido Actualizado',
      `El pedido ${orderId} ahora se encuentra en estado: "${newStatus}".`
    );
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        specDrawerOpen,
        setSpecDrawerOpen,
        currentUser,
        isAuthenticated,
        userRole,
        loginWithCredentials,
        registerUser,
        loginAs,
        logout,
        products,
        selectedProduct,
        setSelectedProduct,
        viewProductDetail,
        addProduct,
        updateProductPrice,
        updateProductStock,
        deleteProduct,
        cart,
        cartCount,
        cartSubtotal,
        cartTax,
        cartShipping,
        cartDiscount,
        cartTotal,
        couponCode,
        applyCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        orders,
        selectedOrder,
        setSelectedOrder,
        createOrder,
        updateOrderStatus,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore debe ser utilizado dentro de un StoreProvider');
  }
  return context;
}
