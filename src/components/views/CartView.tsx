'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Package,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CartView() {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartTax,
    cartShipping,
    cartTotal,
    couponCode,
    applyCoupon,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setCurrentView,
    viewProductDetail,
    products,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    applyCoupon(inputCoupon);
  };

  // Check if any item in cart exceeds current warehouse stock
  const hasInventoryIssues = cart.some((item) => {
    const prodInStore = products.find((p) => p.id === item.product.id);
    return !prodInStore || item.quantity > prodInStore.stock;
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-6">
        <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-500 mx-auto flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Tu carrito de compras está vacío</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Aún no has agregado ningún artículo a tu canasta. Explora el catálogo con control de inventario en tiempo real.
          </p>
        </div>
        <div>
          <Button size="lg" onClick={() => setCurrentView('catalog')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Explorar Catálogo de Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Carrito de Compras
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Revisa tus artículos seleccionados antes de proceder a la confirmación del pedido.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView('catalog')}
            className="text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            Seguir Comprando
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Vaciar Carrito
          </Button>
        </div>
      </div>

      {/* Inventory Warning Alert if any item has issue */}
      {hasInventoryIssues && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-sm">Conflicto de Existencias Detectado</span>
            <p>
              Uno o más artículos en tu carrito superan las existencias físicas disponibles en bodega. Por favor ajusta las cantidades para poder continuar al pago.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Cart Items (Left) vs Financial Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {cart.map((item) => {
              const liveProduct = products.find((p) => p.id === item.product.id) || item.product;
              const isOverStock = item.quantity > liveProduct.stock;
              const isZeroStock = liveProduct.stock === 0;

              return (
                <div key={item.product.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Item Image & Meta */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onClick={() => viewProductDetail(item.product.id)}
                      className="w-20 h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                    />

                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {item.product.sku}
                      </span>
                      <h4
                        onClick={() => viewProductDetail(item.product.id)}
                        className="font-bold text-slate-900 text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors"
                      >
                        {item.product.name}
                      </h4>
                      <div className="text-xs font-semibold text-slate-700">
                        {formatPrice(item.product.price)} c/u
                      </div>

                      {/* Stock availability indicator */}
                      <div className="pt-0.5">
                        {isZeroStock ? (
                          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Agotado en almacén
                          </span>
                        ) : isOverStock ? (
                          <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Excede existencias (Máx. {liveProduct.stock} disp.)
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-600 font-medium">
                            ✓ {liveProduct.stock} disponibles en bodega
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                    {/* Quantity Selector with Validation */}
                    <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={liveProduct.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            updateCartQuantity(item.product.id, val);
                          }
                        }}
                        className="w-12 h-8 text-center font-bold text-xs text-slate-900 border-x border-slate-300 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={item.quantity >= liveProduct.stock}
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Partida Total */}
                    <div className="text-right min-w-[90px]">
                      <span className="text-[10px] text-slate-400 block">Subtotal:</span>
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Eliminar artículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coupon Code Input */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <form onSubmit={handleApplyCoupon} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="¿Tienes un cupón? Ej: DESCUENTO10 o NOVA20"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs uppercase font-medium focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <Button type="submit" variant="secondary" size="md" className="w-full sm:w-auto text-xs">
                Aplicar Cupón
              </Button>
            </form>
            {couponCode && (
              <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Cupón activo: {couponCode} ({cartDiscount > 0 && formatPrice(cartDiscount)} descontado)
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Checkout Action */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Resumen de la Orden
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} artículos):</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartSubtotal)}</span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Descuento Promocional:</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>IVA Trasladado (16%):</span>
                <span className="font-semibold text-slate-900">{formatPrice(cartTax)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Costo de Envío:</span>
                <span className="font-semibold text-slate-900">
                  {cartShipping === 0 ? (
                    <span className="text-emerald-600 font-bold">¡Gratis!</span>
                  ) : (
                    formatPrice(cartShipping)
                  )}
                </span>
              </div>

              {cartShipping > 0 && (
                <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-[11px] text-indigo-800">
                  💡 Agrega más de <strong>$3,000 MXN</strong> para obtener envío gratis a todo el país.
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900 text-base">Total a Pagar:</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-indigo-600">
                    {formatPrice(cartTotal)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Moneda Nacional MXN</span>
                </div>
              </div>
            </div>

            {/* Checkout Action Button */}
            <Button
              variant="accent"
              size="lg"
              disabled={hasInventoryIssues || cart.length === 0}
              onClick={() => setCurrentView('checkout')}
              className="w-full text-sm font-bold shadow-lg shadow-indigo-200"
            >
              <span>Continuar a Confirmación</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Compra 100% segura con cifrado SSL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
