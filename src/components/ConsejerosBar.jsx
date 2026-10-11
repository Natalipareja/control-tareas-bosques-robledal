import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  UserPlus, 
  Filter, 
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../store/store';

export default function ConsejerosBar({ onOpenNewUser }) {
  const { 
    users, 
    tasks, 
    selectedAssigneeId, 
    setSelectedAssigneeId 
  } = useStore();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getUserTaskStats = (userId) => {
    const userTasks = tasks.filter((t) => t.assigneeId === userId);
    const pending = userTasks.filter((t) => t.status === 'pending' || t.status === 'in-progress').length;
    const overdue = userTasks.filter((t) => t.status === 'overdue').length;
    const completed = userTasks.filter((t) => t.status === 'completed').length;
    return { total: userTasks.length, pending, overdue, completed };
  };

  return (
    <div className="bg-white border-b border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Equipo de Consejeros (2026)
            </h2>
            <span className="hidden sm:inline text-xs text-slate-400 font-normal">
              • Haz clic para filtrar tareas
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedAssigneeId && (
              <button
                onClick={() => setSelectedAssigneeId(null)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpiar filtro</span>
              </button>
            )}

            <button
              onClick={onOpenNewUser}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Nuevo</span>
            </button>
          </div>
        </div>

        {/* Consejeros Cards Grid: Horizontally swipeable on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-2 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 scroll-smooth">
          {users.map((user) => {
            const stats = getUserTaskStats(user.id);
            const isSelected = selectedAssigneeId === user.id;
            const waNumber = user.whatsapp.replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
              `Hola ${user.name}, te escribo desde el sistema de gestión del Consejo de Administración Bosques de Robledal 2026.`
            )}`;

            return (
              <div
                key={user.id}
                onClick={() => setSelectedAssigneeId(isSelected ? null : user.id)}
                className={`relative group rounded-2xl p-3.5 border transition-all cursor-pointer min-w-[230px] sm:min-w-0 shrink-0 sm:shrink ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    {/* Avatar with Gradient */}
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${
                        user.color || 'from-emerald-600 to-teal-600'
                      } text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0`}
                    >
                      {getInitials(user.name)}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                          {user.name}
                        </h3>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate font-medium">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Direct WhatsApp Action Button */}
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title={`Escribir a ${user.name} por WhatsApp`}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-600 transition-all shadow-2xs group/wa"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>

                {/* Contact Phone & Task Counts */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user.displayPhone || user.whatsapp}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {stats.overdue > 0 && (
                      <span 
                        title={`${stats.overdue} tarea(s) vencida(s)`}
                        className="px-1.5 py-0.5 rounded-md font-bold text-[10px] bg-red-100 text-red-700 border border-red-200"
                      >
                        {stats.overdue} urg
                      </span>
                    )}
                    <span 
                      title={`${stats.pending} en curso`}
                      className="px-1.5 py-0.5 rounded-md font-semibold text-[10px] bg-slate-200 text-slate-700"
                    >
                      {stats.pending} activas
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
