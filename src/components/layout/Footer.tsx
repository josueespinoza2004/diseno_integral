'use client';

import React from 'react';
import { Package, ShieldCheck, Heart, Sparkles, FileText, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export function Footer() {
  const { setCurrentView, setSpecDrawerOpen, userRole } = useStore();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Branding & Project Meta */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-base font-extrabold tracking-tight">
                Nova<span className="text-indigo-400">Store</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plataforma integral de comercio electrónico diseñada para la gestión controlada de pedidos e inventario.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Control estricto de existencias
              </span>
            </div>
          </div>

          {/* Col 2: Vistas del Cliente */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Vistas del Cliente
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => setCurrentView('login')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  1. Inicio de sesión
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  2. Catálogo de productos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('product-detail')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  3. Detalle del producto
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('cart')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  4. Carrito de compras
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('checkout')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  5. Confirmación del pedido
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('order-tracking')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  6. Consulta del estado del pedido
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Vistas del Administrador */}
          <div className="space-y-2.5">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Vistas del Administrador
            </h4>
            {userRole === 'admin' ? (
              <ul className="space-y-1.5">
                <li>
                  <button
                    onClick={() => setCurrentView('admin-products')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    7. Administración de productos (Alta, precios, stock)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView('admin-orders')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    8. Administración de pedidos y reportes
                  </button>
                </li>
              </ul>
            ) : (
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
                <span className="text-amber-400 font-semibold block mb-0.5">🔒 Acceso Restringido</span>
                <span>Las pantallas 7 y 8 requieren iniciar sesión con cuenta de Administrador.</span>
              </div>
            )}

            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block">Flujo de Estados Auditado:</span>
              <p className="text-[11px] text-indigo-300 font-mono mt-0.5">
                Pendiente → Confirmado → Preparando → Enviado → Entregado
              </p>
            </div>
          </div>

          {/* Col 4: Ficha Técnica & Academic Specification */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Documentación del Caso
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Consulta las especificaciones de cada pantalla con su objetivo, entradas, información mostrada, acciones y validaciones.
            </p>
            <button
              onClick={() => setSpecDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-md shadow-indigo-950"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Ver Ficha Técnica Completa</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 NovaStore E-Commerce • Caso de Estudio: Diseño integral de software e interfaces
          </div>
          <div className="flex items-center gap-2">
            <span>Desarrollado con Next.js, TypeScript y Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
