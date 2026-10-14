'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';
import {
  Package,
  Plus,
  DollarSign,
  Boxes,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Search,
  Edit2,
  Trash2,
  TrendingUp,
  Layers,
  ArrowUpDown,
  Filter,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';

export function AdminProductsView() {
  const {
    products,
    addProduct,
    updateProductPrice,
    updateProductStock,
    deleteProduct,
    showToast,
  } = useStore();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [selectedProductForAction, setSelectedProductForAction] = useState<Product | null>(null);

  // New Product Form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Computación');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [addErrors, setAddErrors] = useState<{ [key: string]: string }>({});

  // Price adjustment state
  const [priceInput, setPriceInput] = useState('');
  const [priceError, setPriceError] = useState('');

  // Stock adjustment state
  const [stockInput, setStockInput] = useState('');
  const [stockError, setStockError] = useState('');

  // KPIs
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Filtered Products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'in-stock') matchesStock = product.stock > 0;
    else if (stockFilter === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 3;
    else if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle Add Product Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!newName.trim()) errs.name = 'El nombre del producto es obligatorio.';
    if (!newSku.trim()) errs.sku = 'El código SKU es obligatorio.';

    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'El precio debe ser un número mayor a 0.';
    }

    const stockNum = parseInt(newStock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'La existencia debe ser un número mayor o igual a 0.';
    }

    if (!newDescription.trim()) errs.description = 'La descripción es obligatoria.';

    setAddErrors(errs);
    if (Object.keys(errs).length > 0) return;

    addProduct({
      name: newName,
      category: newCategory,
      price: priceNum,
      stock: stockNum,
      sku: newSku.toUpperCase(),
      description: newDescription,
      image:
        newImage.trim() ||
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
      features: newFeatures
        ? newFeatures.split(',').map((f) => f.trim())
        : ['Garantía oficial', 'Alta durabilidad'],
      inStock: stockNum > 0,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewSku('');
    setNewDescription('');
    setNewImage('');
    setNewFeatures('');
  };

  // Open Price Edit Modal
  const openPriceModal = (prod: Product) => {
    setSelectedProductForAction(prod);
    setPriceInput(prod.price.toString());
    setPriceError('');
    setIsPriceModalOpen(true);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAction) return;

    const val = parseFloat(priceInput);
    if (isNaN(val) || val <= 0) {
      setPriceError('El precio debe ser estrictamente mayor a $0.00');
      return;
    }

    updateProductPrice(selectedProductForAction.id, val);
    setIsPriceModalOpen(false);
  };

  // Open Stock Control Modal
  const openStockModal = (prod: Product) => {
    setSelectedProductForAction(prod);
    setStockInput(prod.stock.toString());
    setStockError('');
    setIsStockModalOpen(true);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForAction) return;

    const val = parseInt(stockInput, 10);
    if (isNaN(val) || val < 0) {
      setStockError('Las existencias no pueden ser un valor negativo.');
      return;
    }

    updateProductStock(selectedProductForAction.id, val);
    setIsStockModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header & Main Admin Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-2 border border-amber-200">
            <Boxes className="w-3.5 h-3.5 text-amber-600" />
            <span>Módulo de Administración de Inventario</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Control de Catálogo y Existencias
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Registra nuevos productos, modifica precios y ajusta existencias para prevenir ventas sin stock.
          </p>
        </div>

        <Button
          variant="accent"
          size="md"
          onClick={() => {
            setAddErrors({});
            setIsAddModalOpen(true);
          }}
          className="shadow-md shadow-indigo-200"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Registrar Nuevo Producto</span>
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Productos Activos</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalProducts}</div>
            <span className="text-[11px] text-slate-400">Total en catálogo</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Inventory Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Valor del Inventario</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">
              {formatPrice(totalInventoryValue)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium">Existencias valuadas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Low Stock Warning */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Stock Crítico (≤ 3)</span>
            <div className="text-2xl font-black text-amber-600 mt-1">{lowStockCount}</div>
            <span className="text-[11px] text-amber-700 font-medium">Requiere reabastecimiento</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Out of stock */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Productos Agotados</span>
            <div className="text-2xl font-black text-rose-600 mt-1">{outOfStockCount}</div>
            <span className="text-[11px] text-rose-700 font-medium">Ventas bloqueadas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Filters Row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Stock Filter */}
          <div className="md:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700"
            >
              <option value="all">Filtro: Todos los niveles</option>
              <option value="in-stock">En Stock regular</option>
              <option value="low-stock">Stock Crítico (≤ 3)</option>
              <option value="out-of-stock">Agotados (0 unidades)</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700"
            >
              <option value="Todos">Categoría: Todas</option>
              <option value="Computación">Computación</option>
              <option value="Audio">Audio</option>
              <option value="Telefonía">Telefonía</option>
              <option value="Wearables">Wearables</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Hogar">Hogar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Products Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Producto / SKU</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio Unitario</th>
                <th className="py-3.5 px-4">Existencias (Stock)</th>
                <th className="py-3.5 px-4">Estado del Sistema</th>
                <th className="py-3.5 px-6 text-right">Acciones de Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 3;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Product & SKU */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">
                            {product.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            SKU: {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {product.category}
                    </td>

                    {/* Price with Edit Button */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          onClick={() => openPriceModal(product)}
                          title="Modificar precio"
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Stock with Quick Adjust Button */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-sm px-2 py-0.5 rounded-lg border ${
                            isOutOfStock
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isLowStock
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {product.stock} pzas.
                        </span>
                        <button
                          onClick={() => openStockModal(product)}
                          title="Controlar existencias"
                          className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                        >
                          <Boxes className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          <XCircle className="w-3 h-3" />
                          Agotado (Bloqueado)
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          Stock Crítico
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          En Stock Óptimo
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPriceModal(product)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Precio
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openStockModal(product)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        Stock
                      </Button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        title="Eliminar producto"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex align-middle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Registrar Nuevo Producto */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Registrar Nuevo Producto en Catálogo"
        description="Ingresa la ficha del producto. Se validará precio positivo y stock inicial."
        maxWidth="xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Nombre Comercial del Producto"
            placeholder="Ej. MacBook Air M3 15 Pulgadas"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={addErrors.name}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                <option value="Computación">Computación</option>
                <option value="Audio">Audio</option>
                <option value="Telefonía">Telefonía</option>
                <option value="Wearables">Wearables</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Hogar">Hogar</option>
              </select>
            </div>

            <Input
              label="Código SKU Único"
              placeholder="Ej. LAP-APP-M3-15"
              value={newSku}
              onChange={(e) => setNewSku(e.target.value)}
              error={addErrors.sku}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Precio de Venta ($ MXN)"
              placeholder="Ej. 24999.00"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              error={addErrors.price}
            />

            <Input
              label="Existencias Iniciales en Almacén"
              placeholder="Ej. 10"
              type="number"
              min="0"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              error={addErrors.stock}
            />
          </div>

          <Input
            label="URL de Imagen del Producto (Opcional)"
            placeholder="https://images.unsplash.com/..."
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            helperText="Si se deja vacío, se asignará una imagen ilustrativa por defecto."
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">Descripción Detallada</label>
            <textarea
              rows={3}
              placeholder="Describe las ventajas, garantía y características..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            {addErrors.description && (
              <p className="text-xs text-rose-600 font-medium">⚠ {addErrors.description}</p>
            )}
          </div>

          <Input
            label="Características Clave (Separadas por comas)"
            placeholder="Ej. Procesador Octa-Core, Pantalla Retina, Batería 18h"
            value={newFeatures}
            onChange={(e) => setNewFeatures(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="accent">
              Guardar y Publicar Producto
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Modificar Precio */}
      <Dialog
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        title="Modificar Precio de Venta"
        description={selectedProductForAction ? `Ajustando precio para: ${selectedProductForAction.name}` : ''}
        maxWidth="md"
      >
        <form onSubmit={handlePriceSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
            <span className="text-slate-500">Precio Actual en Catálogo:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {selectedProductForAction && formatPrice(selectedProductForAction.price)}
            </span>
          </div>

          <Input
            label="Nuevo Precio ($ MXN)"
            type="number"
            step="0.01"
            min="0.01"
            value={priceInput}
            onChange={(e) => {
              setPriceInput(e.target.value);
              setPriceError('');
            }}
            error={priceError}
            placeholder="0.00"
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsPriceModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Actualizar Precio
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal: Controlar Existencias (Stock) */}
      <Dialog
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        title="Control de Existencias en Almacén"
        description={selectedProductForAction ? `Ajustando unidades disponibles de: ${selectedProductForAction.name}` : ''}
        maxWidth="md"
      >
        <form onSubmit={handleStockSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex justify-between items-center">
            <span className="text-slate-500">Existencias Actuales:</span>
            <span className="font-extrabold text-slate-900 text-sm">
              {selectedProductForAction?.stock} unidades
            </span>
          </div>

          <Input
            label="Nueva Cantidad de Existencias"
            type="number"
            min="0"
            value={stockInput}
            onChange={(e) => {
              setStockInput(e.target.value);
              setStockError('');
            }}
            error={stockError}
            helperText="Si estableces 0 unidades, el producto pasará inmediatamente al estado Agotado."
            autoFocus
          />

          {/* Quick stock shortcuts */}
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              onClick={() => setStockInput('0')}
              className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-semibold"
            >
              Fijar en 0 (Agotar)
            </button>
            <button
              type="button"
              onClick={() => setStockInput('5')}
              className="px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold"
            >
              Fijar en 5 (Stock Bajo)
            </button>
            <button
              type="button"
              onClick={() => setStockInput('25')}
              className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold"
            >
              Fijar en 25 (Abundante)
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsStockModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Existencias
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
