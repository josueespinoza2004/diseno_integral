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
import { Sparkles, FileText, ChevronRight, HelpCircle } from 'lucide-react';

function AppContent() {
  const { currentView, setCurrentView, setSpecDrawerOpen } = useStore();

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
        return <AdminProductsView />;
      case 'admin-orders':
        return <AdminOrdersView />;
      default:
        return <CatalogView />;
    }
  };

  const quickScreens: { id: ViewType; label: string; num: string }[] = [
    { id: 'login', num: '1', label: 'Inicio de Sesión' },
    { id: 'catalog', num: '2', label: 'Catálogo' },
    { id: 'product-detail', num: '3', label: 'Detalle' },
    { id: 'cart', num: '4', label: 'Carrito' },
    { id: 'checkout', num: '5', label: 'Confirmación' },
    { id: 'order-tracking', num: '6', label: 'Estado de Pedido' },
    { id: 'admin-products', num: '7', label: 'Admin Productos' },
    { id: 'admin-orders', num: '8', label: 'Admin Pedidos' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Global Navigation Header */}
      <Header />

      {/* Screen Quick Breadcrumb Navigator for Reviewing */}
      <div className="bg-slate-100/90 border-b border-slate-200/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs overflow-x-auto scrollbar-none gap-2">
          <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-medium">
            <span className="hidden sm:inline">Navegación Rápida de Pantallas:</span>
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

      {/* Main View Display */}
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
