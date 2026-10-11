import React, { useState } from 'react';
import { 
  Cloud, 
  CloudCheck, 
  Database, 
  X, 
  Key, 
  Check, 
  Upload, 
  Download, 
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { db, getStoredFirebaseConfig, saveStoredFirebaseConfig } from '../firebase/config';
import { useStore } from '../store/store';

export default function CloudSyncModal({ isOpen, onClose }) {
  const { tasks, users, setTasks } = useStore();
  const currentConfig = getStoredFirebaseConfig();
  const isConnected = !!db;

  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');
  const [projectId, setProjectId] = useState(currentConfig?.projectId || '');
  const [authDomain, setAuthDomain] = useState(currentConfig?.authDomain || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig?.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig?.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig?.appId || '');

  const [jsonSuccess, setJsonSuccess] = useState(null);

  if (!isOpen) return null;

  const handleSaveFirebase = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('Por favor ingresa al menos la API Key y el Project ID de Firebase.');
      return;
    }
    const newConfig = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim() || `${projectId.trim()}.firebaseapp.com`,
      storageBucket: storageBucket.trim() || `${projectId.trim()}.appspot.com`,
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };
    saveStoredFirebaseConfig(newConfig);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '2026.1',
      date: new Date().toISOString(),
      tasks,
      users
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Respaldo_Tareas_Bosques_Robledal_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1500);

    setJsonSuccess('¡Copia de seguridad descargada en tu equipo!');
    setTimeout(() => setJsonSuccess(null), 3500);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.tasks && Array.isArray(data.tasks)) {
          setTasks(data.tasks);
          setJsonSuccess(`¡${data.tasks.length} tareas importadas con éxito!`);
          setTimeout(() => setJsonSuccess(null), 3500);
        } else {
          alert('El archivo no contiene un formato de tareas válido.');
        }
      } catch (err) {
        alert('Error al leer el archivo de respaldo: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-150 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ring-4 ${
              isConnected 
                ? 'bg-emerald-100 text-emerald-700 ring-emerald-50' 
                : 'bg-amber-100 text-amber-700 ring-amber-50'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Sincronización en la Nube
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${
                  isConnected 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {isConnected ? '🟢 Conectado a Firebase' : '⚪ Modo Local'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Permite que todos los consejeros vean y actualicen las tareas desde cualquier celular o computador.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option A: Quick Backup & Restore */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Traspaso Inmediato entre Dispositivos (Sin registro)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Instantáneo
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Descarga una copia de las tareas que ya digitaste para cargarlas de inmediato en tu otro navegador o celular.
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleExportBackup}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar Respaldo ({tasks.length} tareas)</span>
            </button>

            <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Cargar Respaldo en este navegador</span>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportBackup} 
                className="hidden" 
              />
            </label>
          </div>

          {jsonSuccess && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 animate-in fade-in">
              {jsonSuccess}
            </div>
          )}
        </div>

        {/* Option B: Firebase Cloud Database Setup */}
        <form onSubmit={handleSaveFirebase} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Conectar a Google Firebase (Tiempo Real Permanente)
            </span>
            <a 
              href="https://console.firebase.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Abrir Firebase Console</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                API Key
              </label>
              <input 
                type="text" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="AIzaSy..." 
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Project ID
              </label>
              <input 
                type="text" 
                value={projectId} 
                onChange={(e) => setProjectId(e.target.value)} 
                placeholder="bosques-robledal-2026" 
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Auth Domain (Opcional)
              </label>
              <input 
                type="text" 
                value={authDomain} 
                onChange={(e) => setAuthDomain(e.target.value)} 
                placeholder="proyecto.firebaseapp.com" 
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                App ID (Opcional)
              </label>
              <input 
                type="text" 
                value={appId} 
                onChange={(e) => setAppId(e.target.value)} 
                placeholder="1:123456789:web:abcdef" 
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-400">
              * Datos 100% seguros y guardados en tu navegador.
            </p>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Cloud className="w-3.5 h-3.5 text-emerald-400" />
              <span>Guardar y Conectar Nube</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
