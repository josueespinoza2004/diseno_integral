'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import {
  Lock,
  Mail,
  User,
  Shield,
  Eye,
  EyeOff,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';

export function LoginView() {
  const { loginAs, showToast, setCurrentView } = useStore();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Ingresa un formato de correo electrónico válido (ej. usuario@correo.com).';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'La contraseña es requerida.';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe contener al menos 6 caracteres.';
    }

    if (isRegisterMode) {
      if (!name.trim()) {
        newErrors.name = 'El nombre completo es obligatorio.';
      }
      if (!phone.trim()) {
        newErrors.phone = 'El teléfono es obligatorio para envíos.';
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (isRegisterMode) {
      showToast('success', 'Cuenta Creada', `¡Bienvenido(a) ${name}! Tu cuenta de cliente ha sido registrada.`);
      loginAs('cliente');
    } else {
      // Determine if logging in as admin or client based on email pattern or default
      if (email.toLowerCase().includes('admin')) {
        loginAs('admin');
      } else {
        loginAs('cliente');
      }
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail)) {
      showToast('error', 'Correo inválido', 'Introduce un correo válido para recuperar tu contraseña.');
      return;
    }
    showToast('info', 'Enlace Enviado', `Se ha enviado el enlace de restablecimiento a ${resetEmail}`);
    setForgotPasswordModal(false);
    setResetEmail('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-radial from-indigo-50/70 via-slate-50 to-slate-100">
      <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
        {/* Left Side: Visual Showcase & Brand */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plataforma E-Commerce 2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Sistema de Gestión de Pedidos
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Solución integral con control estricto de existencias y flujo de estados en tiempo real:
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Control de existencias previo a la venta</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Flujo de 5 estados: Pendiente a Entregado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Panel de administración con reportes de ventas</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-8 pt-6 border-t border-slate-700/60 relative z-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              ⚡ Accesos Rápidos de Prueba (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAs('cliente')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold text-white transition-all text-left"
              >
                <User className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span>Como Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-xs font-semibold text-amber-200 transition-all text-left"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Como Administrador</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Header Tabs (Login vs Register) */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {isRegisterMode ? 'Crear Cuenta Nueva' : 'Iniciar Sesión'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isRegisterMode
                    ? 'Regístrate para explorar el catálogo y realizar compras.'
                    : 'Ingresa tus credenciales para acceder a tu cuenta.'}
                </p>
              </div>

              <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrors({});
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    !isRegisterMode ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Acceso
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrors({});
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isRegisterMode ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Registro
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegisterMode && (
                <>
                  <Input
                    label="Nombre Completo"
                    placeholder="Ej. María González López"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name}
                  />
                  <Input
                    label="Teléfono Móvil (para entrega de pedidos)"
                    placeholder="Ej. +52 55 1234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone}
                  />
                </>
              )}

              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`flex h-10 w-full rounded-lg border bg-white px-3.5 pr-10 py-2 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 ${
                      errors.password
                        ? 'border-rose-500 focus-visible:ring-rose-100'
                        : 'border-slate-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-100'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-600 font-medium flex items-center gap-1">
                    <span>⚠</span> {errors.password}
                  </p>
                )}
              </div>

              {isRegisterMode && (
                <Input
                  label="Confirmar Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={errors.confirmPassword}
                />
              )}

              {!isRegisterMode && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Recordar sesión</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(true)}
                    className="font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              <Button type="submit" variant="accent" size="lg" className="w-full mt-4">
                <span>{isRegisterMode ? 'Completar Registro' : 'Ingresar al Sistema'}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>

            {/* Quick Helper Credentials */}
            <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">
                Credenciales sugeridas para prueba:
              </span>
              <div className="flex flex-col gap-1 text-[11px]">
                <div>
                  <span className="font-medium text-indigo-700">Cliente:</span> maria.gonzalez@example.com (contraseña libre)
                </div>
                <div>
                  <span className="font-medium text-amber-700">Administrador:</span> admin@tienda.com (contraseña libre)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog
        isOpen={forgotPasswordModal}
        onClose={() => setForgotPasswordModal(false)}
        title="Recuperar Contraseña"
        description="Ingresa tu correo para recibir las instrucciones de restablecimiento."
      >
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico Registrado"
            placeholder="usuario@ejemplo.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            type="email"
            required
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setForgotPasswordModal(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Enviar Enlace
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}
