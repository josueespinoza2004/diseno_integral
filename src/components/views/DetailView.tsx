'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PackageCheck,
  Share2,
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function DetailView() {
  const { selectedProduct, setCurrentView, addToCart, cart, products } = useStore();

  // Selected product might have had its stock or price updated dynamically
  const product = products.find((p) => p.id === selectedProduct?.id) || selectedProduct;

  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'warranty' | 'reviews'>('specs');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-800">No se ha seleccionado ningún producto</h3>
        <Button onClick={() => setCurrentView('catalog')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Catálogo
        </Button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const cartItem = cart.find((i) => i.product.id === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const maxCanAdd = Math.max(0, product.stock - inCartQty);

  const handleIncrement = () => {
    if (quantity < maxCanAdd) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleManualQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > maxCanAdd) {
      setQuantity(maxCanAdd);
    } else {
      setQuantity(val);
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0 || isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setQuantity(1);
    }
  };

  const handleBuyNow = () => {
    if (quantity <= 0 || isOutOfStock) return;
    const res = addToCart(product, quantity);
    if (res.success) {
      setCurrentView('checkout');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb & Navigation Back */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('catalog')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <nav className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentView('catalog')}>Inicio</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="hover:text-slate-800 cursor-pointer" onClick={() => setCurrentView('catalog')}>Catálogo</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-medium">{product.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-indigo-600 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10">
        {/* Left Column: Image & Media */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Stock Overlay Tag */}
            <div className="absolute top-4 left-4 z-10">
              {isOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-lg">
                  <XCircle className="w-4 h-4" />
                  PRODUCTO AGOTADO
                </span>
              ) : isLowStock ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                  ¡ÚLTIMAS {product.stock} PIEZAS!
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  {product.stock} UNIDADES DISPONIBLES
                </span>
              )}
            </div>
          </div>

          {/* Value props badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-slate-900">Envío Rápido</span>
                <span>Nacional express</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-slate-900">Garantía</span>
                <span>12 meses oficial</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <div className="text-[11px] leading-tight">
                <span className="font-bold block text-slate-900">Devolución</span>
                <span>30 días gratis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Meta Category & SKU */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 font-semibold uppercase tracking-wider text-[11px]">
                {product.category}
              </span>
              <span className="font-mono text-slate-500">SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h2>

            {/* Reviews & Ratings */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-slate-800">{product.rating} de 5</span>
              <span className="text-slate-400 text-xs">|</span>
              <span className="text-xs text-slate-500">({product.reviewsCount} opiniones verificadas)</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Precio de Venta:</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-slate-500">IVA incluido (16%)</span>
              </div>
            </div>

            {/* Strict Inventory Status Box */}
            <div
              className={`p-4 rounded-2xl border flex items-start gap-3 ${
                isOutOfStock
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : isLowStock
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              {isOutOfStock ? (
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              ) : isLowStock ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-0.5">
                <span className="font-bold block text-sm">
                  {isOutOfStock
                    ? 'Existencias Agotadas'
                    : isLowStock
                    ? `¡Atención! Pocas unidades en inventario (${product.stock} restantes)`
                    : `Disponibilidad Inmediata (${product.stock} piezas en almacén)`}
                </span>
                <p className="leading-relaxed opacity-90">
                  {isOutOfStock
                    ? 'Por política del sistema no es posible realizar ventas de productos sin inventario suficiente. Por favor contacta al administrador o revisa más tarde.'
                    : `Control de inventario activo: El pedido no podrá exceder el número de existencias físicas disponibles.`}
                </p>
                {inCartQty > 0 && !isOutOfStock && (
                  <p className="font-semibold text-indigo-700 pt-1">
                    Nota: Ya tienes {inCartQty} {inCartQty === 1 ? 'unidad' : 'unidades'} de este producto agregadas en tu carrito.
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Interactive Controls & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            {/* Quantity Selector with Validation */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-semibold text-slate-700">Cantidad:</span>
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={handleDecrement}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxCanAdd}
                  disabled={isOutOfStock || maxCanAdd <= 0}
                  value={isOutOfStock ? 0 : quantity}
                  onChange={handleManualQuantityChange}
                  className="w-14 h-10 text-center font-bold text-sm text-slate-900 border-x border-slate-300 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={quantity >= maxCanAdd || isOutOfStock}
                  onClick={handleIncrement}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {!isOutOfStock && (
                <span className="text-xs text-slate-500">
                  {maxCanAdd > 0
                    ? `(Máximo para agregar: ${maxCanAdd})`
                    : '(Ya tienes el stock máximo en tu carrito)'}
                </span>
              )}
            </div>

            {/* Purchase Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                disabled={isOutOfStock || maxCanAdd <= 0}
                onClick={handleAddToCart}
                className={`w-full ${
                  isOutOfStock || maxCanAdd <= 0
                    ? 'border-slate-200 text-slate-400 bg-slate-100 cursor-not-allowed'
                    : 'border-indigo-600 text-indigo-700 hover:bg-indigo-50'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Agotado en Almacén' : maxCanAdd <= 0 ? 'Sin Cupo Disponible' : 'Agregar al Carrito'}
              </Button>

              <Button
                variant="accent"
                size="lg"
                disabled={isOutOfStock || maxCanAdd <= 0}
                onClick={handleBuyNow}
                className={`w-full ${
                  isOutOfStock || maxCanAdd <= 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : ''
                }`}
              >
                <Zap className="w-5 h-5 mr-2" />
                Comprar Ahora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Specifications, Warranty, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 gap-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Especificaciones Técnicas
          </button>
          <button
            onClick={() => setActiveTab('warranty')}
            className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'warranty'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Políticas de Envío y Devolución
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reseñas de Clientes ({product.reviewsCount})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Características Destacadas del Producto
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-800"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-w-3xl">
              <h4 className="text-sm font-bold text-slate-900">
                Garantía y Despacho Logístico
              </h4>
              <p>
                Todos los productos adquiridos en NovaStore cuentan con garantía directa de fábrica por 12 meses frente a cualquier defecto de manufactura.
              </p>
              <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900">
                <span className="font-bold block mb-1">Rastreo con 5 Estados de Seguimiento:</span>
                Al confirmar tu compra, el pedido avanza automáticamente por la secuencia auditada:
                <strong> Pendiente → Confirmado → Preparando → Enviado → Entregado</strong>.
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">
                  Opiniones de Compradores Verificados
                </h4>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-bold text-slate-800">{product.rating}</span>
                  <span className="text-xs text-slate-400">Promedio general</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Mariana Treviño</span>
                    <span className="text-[11px] text-slate-400">Hace 3 días</span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Excelente calidad, llegó exactamente en el estado estimado. El empaque venía sellado y con todos los accesorios completos. Totalmente recomendado.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
