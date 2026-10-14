'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  PackageCheck,
  Send,
  Home,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Calendar,
  Layers,
  ArrowUpDown,
  Download,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export function AdminOrdersView() {
  const { orders, updateOrderStatus, showToast } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'reports'>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('month');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Analytics Metrics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const averageTicket = useMemo(() => {
    return orders.length > 0 ? totalRevenue / orders.length : 0;
  }, [orders, totalRevenue]);

  const ordersByStatus = useMemo(() => {
    const counts: Record<OrderStatus, number> = {
      Pendiente: 0,
      Confirmado: 0,
      Preparando: 0,
      Enviado: 0,
      Entregado: 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    return counts;
  }, [orders]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleExportReport = (type: 'pdf' | 'csv') => {
    showToast(
      'success',
      `Reporte Generado (${type.toUpperCase()})`,
      `El reporte de ventas de NovaStore con ${orders.length} pedidos ha sido exportado exitosamente.`
    );
  };

  const statusOptions: OrderStatus[] = ['Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Entregado'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2 border border-indigo-200">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Panel de Gestión y Analítica de Pedidos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administración de Pedidos y Reportes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Supervisa órdenes, actualiza el flujo de 5 estados y analiza el rendimiento comercial.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Gestión de Pedidos ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeTab === 'reports'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Reportes de Ventas</span>
          </button>
        </div>
      </div>

      {/* View 1: Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Quick Status Count Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statusOptions.map((st) => (
              <div
                key={st}
                onClick={() => setStatusFilter(statusFilter === st ? 'Todos' : st)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  statusFilter === st
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">{st}</span>
                  <Badge status={st} />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {ordersByStatus[st]} <span className="text-[11px] font-normal text-slate-400">órdenes</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative min-w-[260px] flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por ID de pedido, cliente o email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700"
              >
                <option value="Todos">Filtrar: Todos los estados</option>
                {statusOptions.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-500 font-medium">
              Mostrando <strong className="text-slate-900">{filteredOrders.length}</strong> pedidos
            </span>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-6">ID Pedido / Fecha</th>
                    <th className="py-3.5 px-4">Cliente / Contacto</th>
                    <th className="py-3.5 px-4">Artículos</th>
                    <th className="py-3.5 px-4">Total Pagado</th>
                    <th className="py-3.5 px-6">Estado Actual (Actualizable)</th>
                    <th className="py-3.5 px-6 text-right">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* ID & Date */}
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-indigo-700 block text-xs">
                          {order.id}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-900 block">{order.customerName}</span>
                        <span className="text-[11px] text-slate-500">{order.customerEmail}</span>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4">
                        <span className="font-semibold text-slate-700">
                          {order.items.reduce((a, b) => a + b.quantity, 0)} piezas
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                          {order.items.map((i) => i.name).join(', ')}
                        </span>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status Selector (ADMIN CAPABILITY: Cambiar el estado de los pedidos) */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="h-8 px-2.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer shadow-xs"
                          >
                            <option value="Pendiente">🟡 1. Pendiente</option>
                            <option value="Confirmado">🔵 2. Confirmado</option>
                            <option value="Preparando">🟠 3. Preparando</option>
                            <option value="Enviado">🟣 4. Enviado</option>
                            <option value="Entregado">🟢 5. Entregado</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderForModal(order)}
                          className="text-xs h-8 gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Sales Reports & Analytics Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Top Actions: Date Range & Export Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Periodo del Reporte</span>
                <span className="text-[11px] text-slate-500">Datos consolidados del ejercicio 2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="h-9 px-3 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-700"
              >
                <option value="today">Ventas de Hoy</option>
                <option value="week">Esta Semana</option>
                <option value="month">Mes en Curso (Octubre)</option>
                <option value="all">Histórico Completo</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportReport('csv')}
                className="text-xs gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Exportar CSV</span>
              </Button>

              <Button
                variant="default"
                size="sm"
                onClick={() => handleExportReport('pdf')}
                className="text-xs gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Generar Reporte PDF</span>
              </Button>
            </div>
          </div>

          {/* Revenue KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Facturación Bruta Total</span>
              <div className="text-3xl font-black text-indigo-600 mt-2">
                {formatPrice(totalRevenue)}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4% vs mes anterior
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Pedidos Totales Registrados</span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {orders.length}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                {ordersByStatus.Entregado} completados exitosamente
              </span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Ticket Promedio por Pedido</span>
              <div className="text-3xl font-black text-slate-900 mt-2">
                {formatPrice(averageTicket)}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Promedio de compra</span>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Tasa de Efectividad Logística</span>
              <div className="text-3xl font-black text-emerald-600 mt-2">
                {orders.length > 0
                  ? `${Math.round(((ordersByStatus.Entregado + ordersByStatus.Enviado) / orders.length) * 100)}%`
                  : '100%'}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Enviados y entregados</span>
            </div>
          </div>

          {/* Visual Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sales Pipeline by Status Breakdown */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Distribución del Flujo de 5 Estados</span>
                <span className="text-xs font-normal text-slate-400">Total: {orders.length} órdenes</span>
              </h4>

              <div className="space-y-4">
                {statusOptions.map((st) => {
                  const count = ordersByStatus[st];
                  const percentage = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;

                  return (
                    <div key={st} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <Badge status={st} className="scale-90" />
                          <span>{st}</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {count} pedidos ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            st === 'Pendiente'
                              ? 'bg-yellow-500'
                              : st === 'Confirmado'
                              ? 'bg-sky-500'
                              : st === 'Preparando'
                              ? 'bg-amber-500'
                              : st === 'Enviado'
                              ? 'bg-indigo-600'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales by Category & Top Performers */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                <span>Ventas Estimadas por Categoría</span>
                <span className="text-xs font-normal text-slate-400">Desglose de ingresos</span>
              </h4>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Computación y Laptops</span>
                      <span className="text-[10px] text-slate-400">Modelos Ultra ProBook & Monitores</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">$27,498.00 MXN</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">55% del total</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Audio & Dispositivos Bluetooth</span>
                      <span className="text-[10px] text-slate-400">Auriculares Noise-Cancel Max</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">$9,045.68 MXN</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">18% del total</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Hogar & Electrodomésticos</span>
                      <span className="text-[10px] text-slate-400">Cafetera Barista Espresso</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">$7,038.84 MXN</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">14% del total</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Inspection Modal */}
      <Dialog
        isOpen={!!selectedOrderForModal}
        onClose={() => setSelectedOrderForModal(null)}
        title={selectedOrderForModal ? `Inspección de Pedido: ${selectedOrderForModal.id}` : ''}
        description="Ficha completa de auditoría para el administrador."
        maxWidth="2xl"
      >
        {selectedOrderForModal && (
          <div className="space-y-5 text-xs">
            {/* Status & Change control inside modal */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Estado Actual del Pedido:</span>
                <Badge status={selectedOrderForModal.status} className="mt-1" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 text-xs">Cambiar Estado:</span>
                <select
                  value={selectedOrderForModal.status}
                  onChange={(e) => {
                    handleStatusChange(selectedOrderForModal.id, e.target.value as OrderStatus);
                    setSelectedOrderForModal({
                      ...selectedOrderForModal,
                      status: e.target.value as OrderStatus,
                    });
                  }}
                  className="h-9 px-3 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block">Cliente:</span>
                <span className="font-bold text-slate-900">{selectedOrderForModal.customerName}</span>
                <p className="text-slate-500">{selectedOrderForModal.customerEmail}</p>
                <p className="text-slate-500">Tel: {selectedOrderForModal.customerPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 block">Destino de Entrega:</span>
                <span className="font-semibold text-slate-800">
                  {selectedOrderForModal.shippingAddress.street}
                </span>
                <p className="text-slate-500">
                  {selectedOrderForModal.shippingAddress.city}, C.P. {selectedOrderForModal.shippingAddress.postalCode}
                </p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="font-bold text-slate-900 block">Artículos Solicitados:</span>
              <div className="space-y-2">
                {selectedOrderForModal.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-slate-800 block truncate max-w-xs">{item.name}</span>
                        <span className="text-[11px] text-slate-500">{item.quantity} pzas. × {formatPrice(item.price)}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex justify-between items-center text-sm font-bold">
              <span>Total Liquidado:</span>
              <span className="text-indigo-600 font-black text-base">{formatPrice(selectedOrderForModal.total)}</span>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setSelectedOrderForModal(null)}>Cerrar Ficha</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
