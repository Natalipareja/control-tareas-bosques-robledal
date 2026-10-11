import React, { useState } from 'react';
import { X, UserPlus, Phone, Mail, Shield } from 'lucide-react';
import { useStore } from '../store/store';

export default function NewUserModal({ isOpen, onClose }) {
  const { addUser } = useStore();
  const [name, setName] = useState('');
  const [role, setRole] = useState('Consejero de Administración');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Por favor ingresa al menos el nombre y el número de teléfono/WhatsApp.');
      return;
    }

    // Clean phone number for Colombia (+57)
    let clean = phone.replace(/[^0-9]/g, '');
    if (!clean.startsWith('57') && clean.length === 10) {
      clean = '57' + clean;
    }

    addUser({
      name: name.trim(),
      role: role.trim(),
      whatsapp: clean,
      displayPhone: phone.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@bosquesrobledal.com`,
      color: 'from-teal-600 to-emerald-700'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Registrar Miembro del Consejo
              </h3>
              <p className="text-xs text-slate-500">
                Bosques de Robledal 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Nombre Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Carlos Mario Gomez"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Cargo / Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
            >
              <option value="Consejero de Administración">Consejero de Administración</option>
              <option value="Presidente(a) del Consejo">Presidente(a) del Consejo</option>
              <option value="Vicepresidente del Consejo">Vicepresidente del Consejo</option>
              <option value="Comité de Convivencia">Comité de Convivencia</option>
              <option value="Administrador(a) Copropiedad">Administrador(a) Copropiedad</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Número de Celular / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: 310 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
              Correo Electrónico (Opcional)
            </label>
            <input
              type="email"
              placeholder="Ej: consejero@bosquesrobledal.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-500 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
            >
              Guardar Miembro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
