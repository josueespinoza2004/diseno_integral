'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, formatDate } from '@/lib/utils';
import {
  Truck,
  CheckCircle2,
  Clock,
  PackageCheck,
  Send,
  Home,
  Search,
  FileText,
  Printer,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Building2,
  Banknote,
  MapPin,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';

export function OrderTrackingView() {
  const { orders, selectedOrder, setSelectedOrder, setCurrentView, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');

  const activeOrder = selectedOrder || orders[0];

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = orders.find(
      (o) => o.id.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (found) {
      setSelectedOrder(found);
      showToast('success', 'Pedido Localizado', `Se encontró la orden ${found.id}`);
    } else {
      showToast('error', 'Pedido no encontrado', `No se localizó ninguna orden con el folio "${searchQuery}".`);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // The 5 official required statuses in order
  const orderStages: { status: OrderStatus; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      status: 'Pendiente',
      label: 'Pendiente',
      icon: <Clock className="w-5 h-5" />,
      desc: 'Pedido registrado en sistema, en validación administrativa.',
    },
    {
      status: 'Confirmado',
      label: 'Confirmado',
      icon: <CheckCircle2 className="w-5 h-5" />,
      desc: 'Pago acreditado y orden aprobada para surtido.',
    },
    {
      status: 'Preparando',
      label: 'Preparando',
      icon: <PackageCheck className="w-5 h-5" />,
      desc: 'Mercancía en embalaje y control de calidad en bodega.',
    },
    {
      status: 'Enviado',
      label: 'Enviado',
      icon: <Send className="w-5 h-5" />,
      desc: 'En tránsito con paquetería express hacia tu domicilio.',
    },
    {
      status: 'Entregado',
      label: 'Entregado',
      icon: <Home className="w-5 h-5" />,
      desc: 'Paquete recibido satisfactoriamente por el cliente.',
    },
  ];

  const getStageIndex = (status: OrderStatus) => {
    const list: OrderStatus[] = ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Entregado'];
    return list.indexOf(status);
  };

  const currentStageIndex = activeOrder ? getStageIndex(activeOrder.status) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Order Lookup */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consulta del Estado del Pedido
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Seguimiento en vivo del ciclo de compra: Pendiente → Confirmado → Preparando → Enviado → Entregado.
          </p>
        </div>

        {/* Search Order by ID */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar folio (ej. PED-2026-1001)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-300 text-xs font-mono uppercase focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <Button type="submit" size="md" variant="secondary" className="text-xs">
            Buscar
          </Button>
        </form>
      </div>

      {/* Main Grid: Orders Drawer / List (Left) vs Detailed Tracking Board (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Orders List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Historial de Compras ({orders.length})</span>
              <span className="text-xs text-slate-400 font-normal">Toca para inspeccionar</span>
            </h3>

            <div className="space-y-2.5 max-h-[550px] overflow-y-auto pr-1">
              {orders.map((order) => {
                const isSelected = activeOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {order.id}
                      </span>
                      <Badge status={order.status} />
                    </div>

                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span>{order.customerName}</span>
                        <span className="font-bold text-slate-800">{formatPrice(order.total)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>{order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}</span>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tracking Visual Board for Active Order */}
        {activeOrder ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Top Card: Order Details Header */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                      {activeOrder.id}
                    </h3>
                    <Badge status={activeOrder.status} className="text-xs px-3 py-1" />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Registrado el {formatDate(activeOrder.createdAt)} • Entrega estimada: <strong>{activeOrder.estimatedDelivery}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrintReceipt}
                    className="text-xs gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir Comprobante</span>
                  </Button>
                </div>
              </div>

              {/* 5-Stage Interactive Progress Bar */}
              <div className="py-4">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-4">
                  Línea de Vida Oficial del Pedido (5 Estados)
                </span>

                <div className="grid grid-cols-5 gap-2 sm:gap-4 relative">
                  {/* Connecting Line */}
                  <div className="absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0 hidden sm:block">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-700"
                      style={{
                        width: `${(currentStageIndex / (orderStages.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {orderStages.map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isPending = idx > currentStageIndex;

                    return (
                      <div key={stage.status} className="flex flex-col items-center text-center relative z-10">
                        {/* Circle Icon Indicator */}
                        <div
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-bold text-xs transition-all shadow-sm ${
                            isCompleted
                              ? 'bg-indigo-600 text-white shadow-indigo-200'
                              : isCurrent
                              ? 'bg-amber-500 text-white ring-4 ring-amber-100 scale-110 shadow-amber-200 animate-pulse'
                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stage.icon}
                        </div>

                        {/* Label */}
                        <span
                          className={`text-xs font-bold mt-2.5 ${
                            isCurrent
                              ? 'text-amber-600'
                              : isCompleted
                              ? 'text-indigo-950'
                              : 'text-slate-400'
                          }`}
                        >
                          {stage.label}
                        </span>

                        <span className="text-[10px] text-slate-400 hidden md:block max-w-[100px] mt-0.5 leading-tight">
                          {isCompleted ? 'Completado' : isCurrent ? 'En curso' : 'Por iniciar'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Milestone Timeline Details */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 space-y-3">
                <span className="text-xs font-bold text-slate-800 block">
                  Bitácora de Acontecimientos:
                </span>
                <div className="space-y-3">
                  {activeOrder.timeline.map((event, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div
                        className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                          event.completed
                            ? 'bg-emerald-500'
                            : event.current
                            ? 'bg-amber-500 animate-ping'
                            : 'bg-slate-300'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{event.title}</span>
                          <span className="text-[11px] font-mono text-slate-400">{event.date}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-0.5">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery and Customer Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Shipping info */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                    <span>Domicilio de Entrega</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800">{activeOrder.customerName}</p>
                    <p>{activeOrder.shippingAddress.street}</p>
                    <p>{activeOrder.shippingAddress.city}, C.P. {activeOrder.shippingAddress.postalCode}</p>
                    <p className="text-slate-500 mt-1">Tel: {activeOrder.customerPhone}</p>
                    {activeOrder.shippingAddress.notes && (
                      <p className="text-[11px] text-amber-700 bg-amber-50 p-1.5 rounded-lg mt-1 border border-amber-200/50">
                        Nota: {activeOrder.shippingAddress.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Payment info */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Forma de Pago</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <p className="font-semibold text-slate-800">{activeOrder.paymentMethod}</p>
                    <p className="text-[11px] text-slate-500">Transacción registrada en el sistema</p>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                      <span>Monto Total Pagado:</span>
                      <span className="text-indigo-600 font-extrabold">{formatPrice(activeOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Purchased in this order */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-900 block">
                  Artículos en este Envío ({activeOrder.items.length})
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-4 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div>
                          <h6 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h6>
                          <span className="text-[11px] text-slate-500">
                            {item.quantity} {item.quantity === 1 ? 'unidad' : 'unidades'} × {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm">Selecciona una orden de la lista para ver su seguimiento.</p>
          </div>
        )}
      </div>
    </div>
  );
}
