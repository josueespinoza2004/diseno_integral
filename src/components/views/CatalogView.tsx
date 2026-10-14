'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowUpDown,
  Tag,
  FilterX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function CatalogView() {
  const { products, addToCart, viewProductDetail, cart } = useStore();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(25000);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const cats = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];
    return cats;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search filter
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase());

        // Category filter
        const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;

        // Stock filter
        let matchesStock = true;
        if (stockFilter === 'in-stock') matchesStock = product.stock > 0;
        else if (stockFilter === 'low-stock') matchesStock = product.stock > 0 && product.stock <= 3;
        else if (stockFilter === 'out-of-stock') matchesStock = product.stock === 0;

        // Price filter
        const matchesPrice = product.price <= maxPrice;

        return matchesSearch && matchesCategory && matchesStock && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0; // featured/default
      });
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy, maxPrice]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Todos');
    setStockFilter('all');
    setSortBy('featured');
    setMaxPrice(25000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Hero / Banner with stock rule showcase */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Catálogo Oficial de Productos</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Tecnología y Vanguardia con Existencias Garantizadas
          </h2>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            Explora nuestro catálogo con control automático de inventario. El sistema valida las existencias en almacén antes de permitir cualquier agregado al carrito.
          </p>
        </div>
      </div>

      {/* Control Bar: Search, Category Pills, Filters */}
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU, marca o especificación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          {/* Stock Filter Selector */}
          <div className="md:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">📦 Todas las existencias</option>
              <option value="in-stock">✓ Solo disponibles en Stock</option>
              <option value="low-stock">⚠ Stock crítico (≤ 3 unidades)</option>
              <option value="out-of-stock">❌ Agotados (Sin stock)</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
                <option value="name">Nombre: A - Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills & Price Slider */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Active Filter Counter & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Mostrando <strong className="text-slate-900">{filteredProducts.length}</strong> de {products.length} productos
            </span>
            {(searchTerm || selectedCategory !== 'Todos' || stockFilter !== 'all' || sortBy !== 'featured') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
              >
                <FilterX className="w-3.5 h-3.5 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No se encontraron productos con estos filtros
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Intenta modificando los términos de búsqueda, la categoría o el filtro de disponibilidad.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Restablecer todos los filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 3;
            const cartItem = cart.find((i) => i.product.id === product.id);
            const inCartQty = cartItem ? cartItem.quantity : 0;
            const remainingAllowed = product.stock - inCartQty;

            return (
              <div
                key={product.id}
                className={`group flex flex-col justify-between rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  isOutOfStock ? 'opacity-85 border-slate-200' : 'hover:-translate-y-1'
                }`}
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => viewProductDetail(product.id)}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Stock Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600 text-white shadow-md">
                        <XCircle className="w-3.5 h-3.5" />
                        Agotado
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-md animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        ¡Solo {product.stock} disponibles!
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-600/90 text-white backdrop-blur-xs">
                        <CheckCircle className="w-3 h-3" />
                        {product.stock} en Stock
                      </span>
                    )}
                  </div>

                  {/* Category Pill */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/70 text-white text-[10px] font-medium backdrop-blur-xs">
                    {product.category}
                  </span>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* SKU & Rating */}
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                      <span className="font-mono text-[10px] uppercase">{product.sku}</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="font-semibold text-slate-700 text-xs">{product.rating}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h4
                      onClick={() => viewProductDetail(product.id)}
                      className="font-bold text-slate-900 text-sm line-clamp-1 cursor-pointer hover:text-indigo-600 transition-colors"
                      title={product.name}
                    >
                      {product.name}
                    </h4>

                    {/* Description excerpt */}
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-xs text-slate-400">Precio:</span>
                        <div className="text-lg font-black text-slate-900 tracking-tight">
                          {formatPrice(product.price)}
                        </div>
                      </div>

                      {inCartQty > 0 && (
                        <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          En carrito: {inCartQty}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewProductDetail(product.id)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Detalle
                      </Button>

                      {/* Add to Cart Button (Blocked if Out of Stock or Exceeding inventory) */}
                      <Button
                        size="sm"
                        disabled={isOutOfStock || remainingAllowed <= 0}
                        onClick={() => addToCart(product, 1)}
                        className={`text-xs ${
                          isOutOfStock || remainingAllowed <= 0
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                        title={
                          isOutOfStock
                            ? 'No se puede agregar: producto agotado'
                            : remainingAllowed <= 0
                            ? 'Ya agregaste todas las existencias disponibles'
                            : 'Agregar 1 unidad al carrito'
                        }
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                        {isOutOfStock ? 'Sin Stock' : remainingAllowed <= 0 ? 'Tope Stock' : 'Agregar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
