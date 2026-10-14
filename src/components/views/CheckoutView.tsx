'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatPrice } from '@/lib/utils';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Building2,
  Banknote,
  Truck,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Lock,
  Package,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CheckoutView() {
  const {
    cart,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartDiscount,
    cartTotal,
    createOrder,
    setCurrentView,
    currentUser,
    products,
  } = useStore();

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || 'María González López');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'maria.gonzalez@example.com');
  const [customerPhone, setCustomerPhone] = useState('+52 55 1234 5678');
  const [street, setStreet] = useState('Av. Insurgentes Sur 1450, Piso 5');
  const [city, setCity] = useState('Ciudad de México');
  const [postalCode, setPostalCode] = useState('03900');
  const [notes, setNotes] = useState('Entregar en horario de oficina de 9am a 6pm');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    'Tarjeta de Crédito / Débito' | 'Transferencia Bancaria (SPEI)' | 'Pago Contra Entrega'
  >('Tarjeta de Crédito / Débito');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExp, setCardExp] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('321');
  const [cardHolder, setCardHolder] = useState('MARIA GONZALEZ');

  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateCheckout = () => {
    const errs: { [key: string]: string } = {};

    if (!customerName.trim()) errs.customerName = 'El nombre completo es requerido.';
    if (!customerEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      errs.customerEmail = 'Proporciona un correo válido para el comprobante.';
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      errs.customerPhone = 'Teléfono requerido para la paquetería.';
    }
    if (!street.trim()) errs.street = 'Dirección de calle y número requerida.';
    if (!city.trim()) errs.city = 'Ciudad o municipio requerido.';
    if (!postalCode.trim() || postalCode.length < 4) {
      errs.postalCode = 'Código postal válido requerido.';
    }

    if (paymentMethod === 'Tarjeta de Crédito / Débito') {
      if (!cardNumber.trim()) errs.cardNumber = 'Número de tarjeta requerido.';
      if (!cardExp.trim()) errs.cardExp = 'Fecha de expiración requerida.';
      if (!cardCvv.trim()) errs.cardCvv = 'CVV requerido.';
    }

    if (!acceptTerms) {
      errs.acceptTerms = 'Debes aceptar los términos y condiciones de compra.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmOrder = () => {
    if (!validateCheckout()) return;

    setIsSubmitting(true);

    // Simulate inventory verification delay for rich UX
    setTimeout(() => {
      const result = createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: {
          street,
          city,
          postalCode,
          notes,
        },
        paymentMethod,
      });

      setIsSubmitting(false);

      if (result.success) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // ignore if canvas unsupported
        }
      }
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900">No hay productos pendientes para confirmar</h3>
        <Button onClick={() => setCurrentView('catalog')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ir al Catálogo
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={() => setCurrentView('cart')}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-semibold mb-2 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a editar carrito
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Confirmación del Pedido
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Completa los datos de envío y selecciona tu método de pago para generar tu orden de compra.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <div className="text-xs">
            <span className="font-bold block text-indigo-900">Verificación de Existencias Activa</span>
            <span className="text-indigo-600">Stock auditado antes de emitir la orden</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left) vs Summary Review (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Shipping & Payment Information Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Customer & Shipping Details */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Información del Destinatario y Dirección de Entrega
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo del Receptor"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nombre y Apellidos"
                error={errors.customerName}
              />
              <Input
                label="Teléfono de Contacto"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+52 55..."
                error={errors.customerPhone}
              />
            </div>

            <Input
              label="Correo Electrónico para Notificaciones y Rastreo"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="cliente@correo.com"
              type="email"
              error={errors.customerEmail}
            />

            <Input
              label="Calle, Número Exterior e Interior"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Av. Principal #123 Edificio A..."
              error={errors.street}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Ciudad / Estado"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ciudad de México"
                error={errors.city}
              />
              <Input
                label="Código Postal (C.P.)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="06600"
                error={errors.postalCode}
              />
            </div>

            <Input
              label="Instrucciones Especiales de Entrega (Opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Dejar en recepción con vigilancia, timbre #2..."
            />
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Selección del Método de Pago
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Tarjeta de Crédito / Débito')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  paymentMethod === 'Tarjeta de Crédito / Débito'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'Tarjeta de Crédito / Débito' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold block text-slate-900">Tarjeta Bancaria</span>
                  <span className="text-[10px] text-slate-500">Crédito o Débito</span>
                </div>
              </button>

              {/* Option 2: Bank Transfer (SPEI) */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Transferencia Bancaria (SPEI)')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  paymentMethod === 'Transferencia Bancaria (SPEI)'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Building2 className={`w-6 h-6 ${paymentMethod === 'Transferencia Bancaria (SPEI)' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold block text-slate-900">Transferencia SPEI</span>
                  <span className="text-[10px] text-slate-500">Acreditación rápida</span>
                </div>
              </button>

              {/* Option 3: Cash on delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Pago Contra Entrega')}
                className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  paymentMethod === 'Pago Contra Entrega'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'Pago Contra Entrega' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold block text-slate-900">Contra Entrega</span>
                  <span className="text-[10px] text-slate-500">Paga al recibir en mano</span>
                </div>
              </button>
            </div>

            {/* Credit Card Detailed Inputs */}
            {paymentMethod === 'Tarjeta de Crédito / Débito' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-700">Datos de la Tarjeta</span>
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                </div>

                <Input
                  label="Número de Tarjeta"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                  error={errors.cardNumber}
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Vencimiento (MM/AA)"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="MM/AA"
                    error={errors.cardExp}
                  />
                  <Input
                    label="Código CVV"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                    type="password"
                    maxLength={4}
                    error={errors.cardCvv}
                  />
                </div>

                <Input
                  label="Nombre del Titular"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="NOMBRE COMO APARECE EN LA TARJETA"
                />
              </div>
            )}

            {paymentMethod === 'Transferencia Bancaria (SPEI)' && (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-1.5 animate-in fade-in">
                <span className="font-bold block">Instrucciones para Pago SPEI:</span>
                <p>Al confirmar tu orden, se generará una clave de rastreo bancaria exclusiva. Dispondrás de 24 horas para realizar la transferencia.</p>
                <div className="p-2 rounded-lg bg-white/80 border border-indigo-200 font-mono text-[11px] font-bold">
                  CLABE Interbancaria: 0121 8000 1234 5678 90 (BBVA)
                </div>
              </div>
            )}

            {paymentMethod === 'Pago Contra Entrega' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-xs text-amber-900 space-y-1 animate-in fade-in">
                <span className="font-bold block">Pago al Recibir:</span>
                <p>El repartidor llevará una terminal bancaria o podrás pagar con efectivo en el momento de la entrega en tu domicilio.</p>
              </div>
            )}

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  He leído y acepto los términos de compra, políticas de garantía y autorizo la verificación de existencias para este pedido.
                </span>
              </label>
              {errors.acceptTerms && (
                <p className="text-xs text-rose-600 font-semibold mt-1">
                  ⚠ {errors.acceptTerms}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Atomic Inventory Confirmation */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Revisión de Artículos</span>
              <span className="text-xs text-slate-500 font-normal">{cart.length} partidas</span>
            </h3>

            {/* Compact Cart Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h5>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-0.5">
                      <span>Cant: {item.quantity} pza(s)</span>
                      <span className="font-semibold text-slate-800">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Inventory Real-Time Check Badge */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="leading-tight">
                <span className="font-bold block">Existencias verificadas con éxito</span>
                <span className="text-[11px] text-emerald-700">
                  Los artículos están reservados temporalmente para esta transacción.
                </span>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatPrice(cartSubtotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Descuento:</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>IVA (16%):</span>
                <span className="font-semibold text-slate-800">{formatPrice(cartTax)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Envío:</span>
                <span className="font-semibold text-slate-800">
                  {cartShipping === 0 ? 'Gratis' : formatPrice(cartShipping)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estado Inicial:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Pendiente
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-slate-900">Total a Pagar:</span>
                <span className="text-2xl font-black text-indigo-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Submit Confirmation Button */}
            <Button
              variant="accent"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="w-full text-sm font-bold shadow-xl shadow-indigo-200 py-3.5"
            >
              <span>{isSubmitting ? 'Confirmando existencias y registrando...' : 'Confirmar y Pagar Pedido'}</span>
            </Button>

            <div className="text-[11px] text-slate-500 text-center space-y-1">
              <p>Al hacer clic, se descontará el stock de inventario automáticamente.</p>
              <p className="text-slate-400">Entrega estimada: 4 a 5 días hábiles a domicilio.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
