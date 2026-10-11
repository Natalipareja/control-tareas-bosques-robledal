import React from 'react';
import { 
  CheckSquare, 
  PlusCircle, 
  Users, 
  BarChart3, 
  RotateCcw,
  Sparkles,
  Search,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import { useStore } from '../store/store';

export default function Navbar({ onOpenNewTask, onOpenNewUser, onOpenWhatsAppConfig }) {
  const { 
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery,
    resetDefaults 
  } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Council Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 flex items-center justify-center shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">
                  Bosques de Robledal
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Gestión 2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Consejo de Administración • Control y Asignación de Tareas
              </p>
            </div>
          </div>

          {/* Search Box in Header */}
          <div className="hidden md:flex items-center flex-1 max-w-xs relative mx-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar tarea o consejero..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
          </div>

          {/* Views Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs sm:text-sm font-medium border border-slate-200/60">
              <button
                onClick={() => setActiveView('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'board'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tareas & Vistas</span>
              </button>

              <button
                onClick={() => setActiveView('directory')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'directory'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Consejeros</span>
              </button>

              <button
                onClick={() => setActiveView('metrics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'metrics'
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Métricas</span>
              </button>
            </div>



            {/* Primary Action: Asignar Tarea */}
            <button
              onClick={onOpenNewTask}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Asignar Tarea</span>
            </button>

            {/* Reset button with tooltip */}
            <button
              onClick={() => {
                if (window.confirm('¿Deseas restaurar las tareas y consejeros originales?')) {
                  resetDefaults();
                }
              }}
              title="Restablecer datos originales"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
