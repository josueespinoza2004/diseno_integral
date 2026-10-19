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
  Phone,
  KeyRound,
  ShieldAlert,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';

export function LoginView() {
  const { loginWithCredentials, registerUser, loginAs, showToast } = useStore();

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
      const res = registerUser({ name, email, phone, password });
      if (!res.success) {
        setErrors((prev) => ({ ...prev, email: res.message }));
      }
    } else {
      const res = loginWithCredentials(email, password);
      if (!res.success) {
        setErrors((prev) => ({ ...prev, form: res.message }));
      }
    }
  };

  const handleAutofill = (type: 'cliente' | 'admin') => {
    if (type === 'cliente') {
      setEmail('maria.gonzalez@example.com');
      setPassword('cliente123');
      setIsRegisterMode(false);
      setErrors({});
      showToast('info', 'Datos Cargados', 'Credenciales de Cliente cargadas en el formulario.');
    } else {
      setEmail('admin@tienda.com');
      setPassword('admin123');
      setIsRegisterMode(false);
      setErrors({});
      showToast('info', 'Datos Cargados', 'Credenciales de Administrador cargadas en el formulario.');
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
    <div className="w-full flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
      {/* Security Banner Alert */}
      <div className="w-full max-w-4xl mb-4 p-4 rounded-2xl bg-indigo-950 text-indigo-100 border border-indigo-800 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-800 text-indigo-300 shrink-0">
            <Lock className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="text-xs">
            <span className="font-bold text-white block text-sm">
              Acceso Restringido • Autenticación Requerida
            </span>
            <span className="text-indigo-200">
              El catálogo de productos, carrito y módulos de administración están bloqueados hasta identificarte.
            </span>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold border border-indigo-400/30">
          Paso Obligatorio
        </span>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white">
        {/* Left Side: Visual Showcase & Burned Credentials */}
        <div className="md:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-6 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>NovaStore • E-Commerce Seguro</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Portal de Inicio de Sesión
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Autentícate para habilitar la navegación, realizar compras controladas y supervisar pedidos.
            </p>

            <div className="mt-5 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Control de existencias previo a la venta</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Flujo de 5 estados del pedido</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Panel exclusivo para administradores</span>
              </div>
            </div>
          </div>

          {/* Burned Accounts / Usuarios Quemados Box */}
          <div className="mt-8 pt-5 border-t border-slate-700/60 relative z-10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Usuarios Quemados (Evaluación)
              </span>
            </div>

            {/* Burned Account 1: Cliente */}
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-xs space-y-1.5 hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-400" />
                  Rol Cliente:
                </span>
                <button
                  type="button"
                  onClick={() => handleAutofill('cliente')}
                  className="text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-2 py-0.5 rounded-md transition-colors"
                >
                  Autollenar
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300 select-all">
                maria.gonzalez@example.com
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Clave:</span>
                <span className="font-mono font-bold text-slate-200 bg-black/30 px-1.5 py-0.2 rounded">cliente123</span>
              </div>
            </div>

            {/* Burned Account 2: Admin */}
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs space-y-1.5 hover:bg-amber-500/20 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Rol Administrador:
                </span>
                <button
                  type="button"
                  onClick={() => handleAutofill('admin')}
                  className="text-[10px] bg-amber-600 hover:bg-amber-500 text-white font-semibold px-2 py-0.5 rounded-md transition-colors"
                >
                  Autollenar
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300 select-all">
                admin@tienda.com
              </div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>Clave:</span>
                <span className="font-mono font-bold text-amber-200 bg-black/30 px-1.5 py-0.2 rounded">admin123</span>
              </div>
            </div>

            {/* Quick 1-click access buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => loginAs('cliente')}
                className="py-1.5 px-2 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-[11px] font-semibold text-white transition-all text-center"
              >
                1 Clic: Cliente
              </button>
              <button
                type="button"
                onClick={() => loginAs('admin')}
                className="py-1.5 px-2 rounded-xl bg-amber-600/60 hover:bg-amber-600 text-[11px] font-semibold text-amber-100 transition-all text-center"
              >
                1 Clic: Admin
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
                    : 'Ingresa las credenciales para desbloquear la plataforma.'}
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

            {/* General form error alert */}
            {errors.form && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email || errors.form) setErrors({});
                }}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password || errors.form) setErrors({});
                    }}
                    className={`flex h-10 w-full rounded-lg border bg-white px-3.5 pr-10 py-2 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 ${
                      errors.password || errors.form
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
                <span>{isRegisterMode ? 'Completar Registro y Entrar' : 'Validar Credenciales e Ingresar'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
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
