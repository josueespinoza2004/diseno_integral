'use client';

import React from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SpecDrawer } from '@/components/layout/SpecDrawer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { LoginView } from '@/components/views/LoginView';
import { CatalogView } from '@/components/views/CatalogView';
import { DetailView } from '@/components/views/DetailView';
import { CartView } from '@/components/views/CartView';
import { CheckoutView } from '@/components/views/CheckoutView';
import { OrderTrackingView } from '@/components/views/OrderTrackingView';
import { AdminProductsView } from '@/components/views/AdminProductsView';
import { AdminOrdersView } from '@/components/views/AdminOrdersView';
import { ViewType } from '@/types';
import { Sparkles, FileText, Package, Lock, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AppContent() {
  const { currentView, setCurrentView, setSpecDrawerOpen, currentUser, userRole } = useStore();

  const renderActiveView = () => {
    switch (currentView) {
      case 'login':
        return <LoginView />;
      case 'catalog':
        return <CatalogView />;
      case 'product-detail':
        return <DetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-tracking':
        return <OrderTrackingView />;
      case 'admin-products':
        return userRole === 'admin' ? <AdminProductsView /> : <CatalogView />;
      case 'admin-orders':
        return userRole === 'admin' ? <AdminOrdersView /> : <CatalogView />;
      default:
        return <CatalogView />;
    }
  };

  const quickScreens: { id: ViewType; label: string; num: string }[] = [
    { id: 'catalog', num: '2', label: 'Catálogo' },
    { id: 'product-detail', num: '3', label: 'Detalle' },
    { id: 'cart', num: '4', label: 'Carrito' },
    { id: 'checkout', num: '5', label: 'Confirmación' },
    { id: 'order-tracking', num: '6', label: 'Estado de Pedido' },
    ...(userRole === 'admin'
      ? [
          { id: 'admin-products' as ViewType, num: '7', label: 'Admin Productos' },
          { id: 'admin-orders' as ViewType, num: '8', label: 'Admin Pedidos' },
        ]
      : []),
  ];

  // SCENARIO 1: Unauthenticated User (Standalone Login Screen)
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100/90 text-slate-900 selection:bg-indigo-500 selection:text-white">
        {/* Minimal Auth Header */}
        <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Nova<span className="text-indigo-400">Store</span>
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 border-l border-slate-700 pl-2">
                  Control Integral de Pedidos
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs border border-slate-700">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Protegido</span>
              </span>

              {/* Ficha Técnica button available even before logging in for review */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSpecDrawerOpen(true)}
                className="bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border-indigo-700/60 text-xs h-8 gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-300" />
                <span>Ficha Técnica</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Dedicated Login Main View */}
        <main className="flex-1 flex items-center justify-center py-8">
          <LoginView />
        </main>

        {/* Minimal Auth Footer */}
        <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 border-t border-slate-800 text-center">
          <p>
            © 2026 NovaStore • Inicia sesión con los <strong>usuarios quemados</strong> o regístrate para desbloquear la tienda y el panel de administración.
          </p>
        </footer>

        {/* Spec Drawer & Toasts */}
        <SpecDrawer />
        <ToastContainer />
      </div>
    );
  }

  // SCENARIO 2: Authenticated User (Full Store / Admin Dashboard)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header with Role & Profile */}
      <Header />

      {/* Screen Quick Breadcrumb Navigator for Authenticated User */}
      <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-medium">
            <span className="hidden sm:inline">Navegación Rápida:</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {quickScreens.map((s) => {
              const isActive = currentView === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentView(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setSpecDrawerOpen(true)}
            className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 font-semibold px-2 py-1 rounded-lg hover:bg-indigo-50 shrink-0 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ficha de esta pantalla</span>
          </button>
        </div>
      </div>

      {/* Main Active Screen */}
      <main className="flex-1 w-full animate-in fade-in duration-200">
        {renderActiveView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Technical Sheet Drawer */}
      <SpecDrawer />

      {/* Floating Toast Feedback Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function Page() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
