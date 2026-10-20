'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import {
  ShoppingBag,
  ShoppingCart,
  User as UserIcon,
  ShieldCheck,
  Package,
  Layers,
  FileText,
  Truck,
  BarChart3,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ViewType } from '@/types';

export function Header() {
  const {
    currentView,
    setCurrentView,
    cartCount,
    currentUser,
    userRole,
    loginAs,
    logout,
    specDrawerOpen,
    setSpecDrawerOpen,
  } = useStore();

  const navItems: { id: ViewType; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'catalog', label: 'Catálogo', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'cart', label: 'Carrito', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'order-tracking', label: 'Estado de Pedido', icon: <Truck className="w-4 h-4" /> },
    ...(userRole === 'admin'
      ? [
          { id: 'admin-products' as ViewType, label: 'Admin Productos', icon: <Layers className="w-4 h-4" />, adminOnly: true },
          { id: 'admin-orders' as ViewType, label: 'Admin Pedidos', icon: <BarChart3 className="w-4 h-4" />, adminOnly: true },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner with Role Switcher & Technical Specification Button */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium text-[11px] border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Caso de Estudio: Sistema de Gestión de Pedidos
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              Control de inventario estricto & flujo de 5 estados
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Read-Only Role Indicator Badge (Role cannot be swapped without authenticating) */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs">
              {userRole === 'admin' ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Modo Administrador
                </span>
              ) : (
                <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  Modo Cliente
                </span>
              )}
            </div>

            {/* Spec Sheet Modal Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSpecDrawerOpen(true)}
              className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border-indigo-700/60 text-xs h-7 gap-1.5 shadow-none"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-300" />
              <span>Ficha Técnica de Pantalla</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('catalog')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Nova<span className="text-indigo-600">Store</span>
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Pro
              </span>
            </div>
            <p className="text-[11px] text-slate-500 -mt-0.5 hidden sm:block">
              Gestión Integral de E-Commerce
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.id === 'cart' && cartCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    {cartCount}
                  </span>
                )}
                {item.adminOnly && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-700 uppercase font-bold">
                    Admin
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick View Jumper Selector */}
          <div className="relative">
            <select
              value={currentView}
              onChange={(e) => setCurrentView(e.target.value as ViewType)}
              className="text-xs bg-slate-50 border border-slate-300 text-slate-700 rounded-lg px-2.5 py-1.5 font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              title="Cambiar de Pantalla del Caso"
            >
              <option value="catalog">2. Catálogo de productos</option>
              <option value="product-detail">3. Detalle del producto</option>
              <option value="cart">4. Carrito de compras</option>
              <option value="checkout">5. Confirmación del pedido</option>
              <option value="order-tracking">6. Consulta del estado del pedido</option>
              {userRole === 'admin' && (
                <>
                  <option value="admin-products">7. Administración de productos</option>
                  <option value="admin-orders">8. Administración de pedidos</option>
                </>
              )}
            </select>
          </div>

          {/* Cart Icon Button */}
          <Button
            variant={currentView === 'cart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentView('cart')}
            className="relative gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-xs">
                {cartCount}
              </span>
            )}
          </Button>

          {/* User profile dropdown / status */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-semibold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">
                  {currentUser.role === 'admin' ? '🛡️ Administrador' : '🛍️ Cliente'}
                </div>
              </div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setCurrentView('login')}>
              Acceder
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
