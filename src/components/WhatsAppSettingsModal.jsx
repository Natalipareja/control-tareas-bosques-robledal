import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Settings, 
  Send, 
  Check, 
  Link, 
  Bell, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useStore, dispatchWhatsAppSilently } from '../store/store';

export default function WhatsAppSettingsModal({ isOpen, onClose }) {
  const { whatsappConfig, updateWhatsAppConfig, users } = useStore();

  const [apiUrl, setApiUrl] = useState(whatsappConfig?.apiUrl || '');
  const [apiToken, setApiToken] = useState(whatsappConfig?.apiToken || '');
  const [appUrl, setAppUrl] = useState(whatsappConfig?.appUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'));
  const [autoSend, setAutoSend] = useState(whatsappConfig?.autoSend ?? true);
  const [remindersEnabled, setRemindersEnabled] = useState(whatsappConfig?.remindersEnabled ?? true);
  const [testPhone, setTestPhone] = useState(users[0]?.whatsapp || '573148798974');
  const [testStatus, setTestStatus] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateWhatsAppConfig({
      apiUrl: apiUrl.trim(),
      apiToken: apiToken.trim(),
      appUrl: appUrl.trim(),
      autoSend,
      remindersEnabled
    });
    alert('¡Configuración de WhatsApp guardada exitosamente!');
    onClose();
  };

  const handleTestSend = async () => {
    setTestStatus('sending');
    const res = await dispatchWhatsAppSilently({
      phone: testPhone,
      text: `🏛️ *Prueba de Notificación - Bosques de Robledal 2026*\n\nHola, esta es una prueba de envío en segundo plano del sistema de gestión de tareas.\n🔗 Aplicativo: ${appUrl}`,
      apiUrl,
      apiToken
    });
    setTestStatus(res.success ? 'success' : 'error');
    setTimeout(() => setTestStatus(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ajustes de WhatsApp y Recordatorios
              </h3>
              <p className="text-xs text-slate-500">
                Envío silencioso en segundo plano y enlaces del aplicativo
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          {/* App URL */}
          <div>
            <label className="block font-bold uppercase text-slate-700 mb-1">
              URL del Aplicativo Web (se incluye en los mensajes)
            </label>
            <input
              type="text"
              placeholder="http://localhost:5173"
              value={appUrl}
              onChange={(e) => setAppUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:border-emerald-500 outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Enlace que recibirán los consejeros en su WhatsApp para abrir la tarea con 1 clic.
            </p>
          </div>

          {/* Webhook / API URL */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                URL de Webhook o API de WhatsApp (Segundo Plano)
              </label>
              <input
                type="text"
                placeholder="Ej: https://mi-servidor-whatsapp.com/api/send o Meta Cloud API"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:border-emerald-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Si configuras una URL de API (Evolution API, UltraMsg, Twilio o Meta Cloud), las notificaciones se enviarán 100% en silencio sin abrir ninguna pestaña.
              </p>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-700 mb-1">
                Token de Autorización (Opcional)
              </label>
              <input
                type="password"
                placeholder="Bearer Token si la API lo requiere"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="font-bold text-slate-800">
                Notificación automática al asignar tarea
              </span>
              <input
                type="checkbox"
                checked={autoSend}
                onChange={(e) => setAutoSend(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="font-bold text-slate-800">
                Recordatorios de cumplimiento (24h, 12h y 6h antes)
              </span>
              <input
                type="checkbox"
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded"
              />
            </label>
          </div>

          {/* Test Send */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <select
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none"
            >
              {users.map((u) => (
                <option key={u.id} value={u.whatsapp}>
                  {u.name} ({u.displayPhone})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleTestSend}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors shrink-0"
            >
              {testStatus === 'sending' ? 'Enviando...' : testStatus === 'success' ? '✓ Enviado' : 'Probar Envío'}
            </button>
          </div>

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
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
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
