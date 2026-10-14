'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { screenSpecifications } from '@/lib/mockData';
import {
  FileText,
  X,
  Target,
  LogIn,
  Eye,
  CheckCircle,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ViewType } from '@/types';

export function SpecDrawer() {
  const { specDrawerOpen, setSpecDrawerOpen, currentView, setCurrentView } = useStore();
  const [selectedSpecKey, setSelectedSpecKey] = useState<string>(currentView);

  // Sync with current view when drawer opens
  React.useEffect(() => {
    if (specDrawerOpen) {
      setSelectedSpecKey(currentView);
    }
  }, [specDrawerOpen, currentView]);

  if (!specDrawerOpen) return null;

  const currentSpec = screenSpecifications[selectedSpecKey] || screenSpecifications[currentView] || screenSpecifications.login;

  const screenKeys: { id: ViewType; num: string; label: string }[] = [
    { id: 'login', num: '1', label: 'Inicio de sesión' },
    { id: 'catalog', num: '2', label: 'Catálogo de productos' },
    { id: 'product-detail', num: '3', label: 'Detalle del producto' },
    { id: 'cart', num: '4', label: 'Carrito de compras' },
    { id: 'checkout', num: '5', label: 'Confirmación del pedido' },
    { id: 'order-tracking', num: '6', label: 'Estado del pedido' },
    { id: 'admin-products', num: '7', label: 'Admin productos' },
    { id: 'admin-orders', num: '8', label: 'Admin pedidos y reportes' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => setSpecDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl z-10 flex flex-col h-full border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/40">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Ficha Técnica de Pantalla
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Actividad A
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Diseño de interfaz de usuario con especificaciones completas
              </p>
            </div>
          </div>
          <button
            onClick={() => setSpecDrawerOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Screen Picker Tabs */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {screenKeys.map((item) => {
            const isSelected = selectedSpecKey === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedSpecKey(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'}`}>
                  {item.num}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Spec Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Header of Screen Spec */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                Especificación de Pantalla
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {currentSpec.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Rol: {currentSpec.roleRequired}
              </Badge>
              <button
                onClick={() => {
                  setCurrentView(currentSpec.id);
                  setSpecDrawerOpen(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-100 transition-colors"
              >
                <span>Ir a esta pantalla</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. Objetivo */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-700">
                <Target className="w-4 h-4" />
              </div>
              <h4>1. Objetivo</h4>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 text-sm text-slate-700 leading-relaxed">
              {currentSpec.goal}
            </div>
          </div>

          {/* 2. Elementos de entrada */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="p-1.5 rounded-md bg-purple-100 text-purple-700">
                <LogIn className="w-4 h-4" />
              </div>
              <h4>2. Elementos de entrada</h4>
            </div>
            <ul className="space-y-2">
              {currentSpec.inputs.map((inp, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{inp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Información mostrada */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700">
                <Eye className="w-4 h-4" />
              </div>
              <h4>3. Información mostrada</h4>
            </div>
            <ul className="space-y-2">
              {currentSpec.infoDisplayed.map((info, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ✓
                  </span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Acciones disponibles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="p-1.5 rounded-md bg-amber-100 text-amber-700">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h4>4. Acciones disponibles</h4>
            </div>
            <ul className="space-y-2">
              {currentSpec.availableActions.map((act, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    ➔
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 5. Validaciones necesarias */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="p-1.5 rounded-md bg-rose-100 text-rose-700">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4>5. Validaciones necesarias</h4>
            </div>
            <ul className="space-y-2">
              {currentSpec.validaciones.map((val, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs text-rose-900"
                >
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    !
                  </span>
                  <span>{val}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Puedes consultar esta ficha en cualquier momento desde la barra superior.
          </p>
          <button
            onClick={() => setSpecDrawerOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
