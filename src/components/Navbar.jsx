import { 
  CheckSquare, 
  PlusCircle, 
  Users, 
  BarChart3, 
  RotateCcw,
  Search, 
  ShieldCheck, 
  Cloud
} from 'lucide-react';
import { useStore } from '../store/store';
import { db } from '../firebase/config';

export default function Navbar({ onOpenNewTask, onOpenNewUser, onOpenWhatsAppConfig, onOpenCloudSync }) {
  const { 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery,
    resetDefaults 
  } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        {/* Main Header Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
          
          {/* Top Row on Mobile: Brand Logo + Primary Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Logo & Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight leading-tight">
                    Bosques de Robledal
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                    2026
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                  Consejo de Administración
                </p>
              </div>
            </div>

            {/* Actions for Mobile / Right side */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Cloud Sync Button */}
              <button
                onClick={onOpenCloudSync}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  db 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100 shadow-2xs' 
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
                title="Sincronización en la Nube y Respaldo Multi-dispositivo"
              >
                <Cloud className={`w-3.5 h-3.5 ${db ? 'text-emerald-600' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">
                  {db ? 'Nube Activa' : 'Nube'}
                </span>
              </button>

              {/* Asignar Tarea */}
              <button
                onClick={onOpenNewTask}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/25 transition-all shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">+ Tarea</span>
              </button>

              {/* Reset button */}
              <button
                onClick={() => {
                  if (window.confirm('¿Deseas restaurar las tareas y consejeros originales?')) {
                    resetDefaults();
                  }
                }}
                title="Restablecer datos originales"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Row on Mobile / Middle section on Desktop: Views Navigation & Search */}
          <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Search Box */}
            <div className="hidden lg:flex items-center max-w-xs relative mr-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar tarea..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-emerald-500 outline-none transition-all"
              />
            </div>

            {/* View Switcher Tabs (Full width on mobile, compact on desktop) */}
            <div className="grid grid-cols-3 sm:flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold border border-slate-200/60 w-full sm:w-auto">
              <button
                onClick={() => setActiveView('board')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-center ${
                  activeView === 'board'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Tareas</span>
              </button>

              <button
                onClick={() => setActiveView('directory')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-center ${
                  activeView === 'directory'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Consejeros</span>
              </button>

              <button
                onClick={() => setActiveView('metrics')}
                className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-center ${
                  activeView === 'metrics'
                    ? 'bg-white text-emerald-800 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Métricas</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
