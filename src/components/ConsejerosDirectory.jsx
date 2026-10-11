import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  ShieldCheck,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../store/store';

export default function ConsejerosDirectory({ onOpenNewUser, onSelectConsejeroForBoard }) {
  const { users, tasks } = useStore();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStats = (userId) => {
    const userTasks = tasks.filter((t) => t.assigneeId === userId);
    const completed = userTasks.filter((t) => t.status === 'completed').length;
    const inProgress = userTasks.filter((t) => t.status === 'in-progress' || t.status === 'pending').length;
    const overdue = userTasks.filter((t) => t.status === 'overdue').length;
    const rate = userTasks.length > 0 ? Math.round((completed / userTasks.length) * 100) : 0;
    return { total: userTasks.length, completed, inProgress, overdue, rate };
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Directory Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Directorio Oficial 2026
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-tight">
            Consejo de Administración • Bosques de Robledal
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Canales directos de comunicación telefónica y WhatsApp de los consejeros responsables de la gestión y mantenimiento de la copropiedad.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onOpenNewUser}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrar Nuevo Miembro</span>
            </button>
          </div>
        </div>

        {/* Decorative background watermark */}
        <div className="absolute right-6 -bottom-10 opacity-10 pointer-events-none">
          <ShieldCheck className="w-72 h-72 text-emerald-300" />
        </div>
      </div>

      {/* Consejeros Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {users.map((user) => {
          const stats = getStats(user.id);
          const cleanPhone = user.whatsapp.replace(/[^0-9]/g, '');
          const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
            `Hola ${user.name}, te contacto respecto a las actividades del Consejo de Administración Bosques de Robledal 2026.`
          )}`;

          return (
            <div
              key={user.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
            >
              <div>
                {/* Header: Avatar, Name & Role */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${
                        user.color || 'from-emerald-600 to-teal-600'
                      } text-white font-extrabold text-lg flex items-center justify-center shadow-sm shrink-0`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {user.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700">
                        {user.role}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-700">
                    {stats.total} tareas
                  </span>
                </div>

                {/* Direct Action Buttons: WhatsApp & Call */}
                <div className="grid grid-cols-2 gap-2 mt-5">
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>Llamar: {user.displayPhone}</span>
                  </a>
                </div>

                {/* Tasks Stats Cards */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                    <p className="text-[10px] uppercase font-bold text-blue-700">En Curso</p>
                    <p className="text-sm font-extrabold text-blue-900 mt-0.5">{stats.inProgress}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100">
                    <p className="text-[10px] uppercase font-bold text-red-700">Vencidas</p>
                    <p className="text-sm font-extrabold text-red-900 mt-0.5">{stats.overdue}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <p className="text-[10px] uppercase font-bold text-emerald-700">Listas</p>
                    <p className="text-sm font-extrabold text-emerald-900 mt-0.5">{stats.completed}</p>
                  </div>
                </div>

                {/* Completion Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1">
                    <span>Efectividad de cumplimiento</span>
                    <span className="font-bold text-emerald-700">{stats.rate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${stats.rate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* View in Kanban Button */}
              <button
                onClick={() => onSelectConsejeroForBoard(user.id)}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Ver sus tareas en el Tablero Kanban</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
