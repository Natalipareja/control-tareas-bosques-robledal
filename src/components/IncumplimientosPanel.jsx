import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  UserX,
  UserCheck
} from 'lucide-react';
import { useStore } from '../store/store';

export default function IncumplimientosPanel({ onOpenDetail, onEdit }) {
  const { tasks, users, updateTaskStatus, deleteTask } = useStore();
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [filterConsejeroId, setFilterConsejeroId] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date(todayStr + 'T00:00:00');

  // Find all overdue / incomplete tasks
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    if (t.status === 'overdue') return true;
    if (t.dueDate && t.dueDate < todayStr) return true;
    return false;
  });

  // Calculate days overdue
  const getDaysOverdue = (dueDateStr) => {
    if (!dueDateStr) return 0;
    const taskDate = new Date(dueDateStr + 'T00:00:00');
    const diffTime = today.getTime() - taskDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  // Stats per consejero
  const consejerosStats = users.map((user) => {
    const userOverdue = overdueTasks.filter(t => t.assigneeId === user.id);
    return {
      user,
      overdueCount: userOverdue.length,
      tasks: userOverdue
    };
  });

  // Group tasks assigned to 'all'
  const groupOverdue = overdueTasks.filter(t => t.assigneeId === 'all' || t.assigneeId === 0);

  // Filtered overdue tasks if a specific consejero is selected
  const displayedTasks = filterConsejeroId 
    ? (filterConsejeroId === 'all' 
        ? groupOverdue 
        : overdueTasks.filter(t => t.assigneeId === filterConsejeroId || t.assigneeId === 'all'))
    : overdueTasks;

  const getAssigneeInfo = (assigneeId) => {
    if (assigneeId === 'all' || assigneeId === 0) {
      return {
        name: 'Todo el Consejo',
        role: 'Responsabilidad Colectiva (5 Consejeros)',
        phone: 'Los 5 Consejeros',
        whatsapp: '',
        isGroup: true,
        color: 'from-amber-500 to-rose-600'
      };
    }
    const u = users.find(usr => usr.id === Number(assigneeId));
    return u ? {
      name: u.name,
      role: u.role,
      phone: u.displayPhone || u.whatsapp,
      whatsapp: u.whatsapp,
      isGroup: false,
      color: u.color
    } : {
      name: 'Sin Asignar',
      role: 'Consejero',
      phone: '',
      whatsapp: '',
      isGroup: false,
      color: 'from-slate-400 to-slate-500'
    };
  };

  const generateRequerimientoWhatsApp = (task, assignee) => {
    const days = getDaysOverdue(task.dueDate);
    const text = encodeURIComponent(
      `⚠️ *REQUERIMIENTO DE CUMPLIMIENTO - CONSEJO DE ADMINISTRACIÓN*\n` +
      `*Bosques de Robledal (Gestión 2026)*\n\n` +
      `Estimado(a) *${assignee.name}*,\n` +
      `Te informamos que la siguiente tarea a tu cargo presenta *${days} día(s) de vencimiento* sin registro de entrega:\n\n` +
      `📌 *Tarea:* ${task.title}\n` +
      `📂 *Categoría:* ${task.category}\n` +
      `📅 *Fecha Límite Incumplida:* ${task.dueDate}\n` +
      `⚡ *Prioridad:* ${task.priority}\n\n` +
      `Agradecemos indicar al Consejo el motivo del retraso y la fecha en que se presentará el avance o cumplimiento a satisfacción.\n\n` +
      `🔗 *Ingresa al aplicativo para reportar avances o finalizarla:* ${window.location.origin}`
    );

    const cleanPhone = assignee.whatsapp ? assignee.whatsapp.replace(/[^0-9]/g, '') : '';
    return cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : null;
  };

  return (
    <div className="bg-white rounded-3xl border border-red-200/90 shadow-sm overflow-hidden space-y-6 p-6 transition-all">
      
      {/* Header of the Overdue Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-red-100">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 bg-red-100 text-red-600 rounded-2xl ring-4 ring-red-50 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Control de Incumplimientos y Tareas Vencidas
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-red-100 text-red-800 border border-red-300">
                {overdueTasks.length} {overdueTasks.length === 1 ? 'tarea vencida' : 'tareas vencidas'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Seguimiento riguroso a compromisos no entregados a tiempo por los consejeros de administración
            </p>
          </div>
        </div>

        {filterConsejeroId && (
          <button
            onClick={() => setFilterConsejeroId(null)}
            className="self-start md:self-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Ver todos los incumplimientos ({overdueTasks.length})
          </button>
        )}
      </div>

      {/* Semáforo por Consejero (Tarjetas Rápidas de Cumplimiento) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <span>Semáforo de Cumplimiento por Consejero (2026):</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {consejerosStats.map(({ user, overdueCount }) => {
            const isSelected = filterConsejeroId === user.id;
            const hasOverdue = overdueCount > 0;

            return (
              <div
                key={user.id}
                onClick={() => setFilterConsejeroId(isSelected ? null : user.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                  hasOverdue 
                    ? isSelected 
                      ? 'bg-red-50/90 border-red-500 ring-2 ring-red-400/30 shadow-xs' 
                      : 'bg-red-50/40 hover:bg-red-50/80 border-red-200 hover:border-red-300'
                    : isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${user.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate font-medium">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Icon indicator */}
                  {hasOverdue ? (
                    <UserX className="w-4 h-4 text-red-600 shrink-0" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Estado:
                  </span>
                  {hasOverdue ? (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                      {overdueCount} {overdueCount === 1 ? 'vencida' : 'vencidas'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Al día (0)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Listado de Tareas con Incumplimiento */}
      {displayedTasks.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>Tareas Vencidas pendientes de solución ({displayedTasks.length}):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {displayedTasks.map((task) => {
              const assignee = getAssigneeInfo(task.assigneeId);
              const days = getDaysOverdue(task.dueDate);
              const waLink = generateRequerimientoWhatsApp(task, assignee);

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl border-2 border-red-200 p-4.5 hover:border-red-400 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between gap-3.5 relative group"
                >
                  {/* Top Bar: Categoría, Días de Retraso y Botón Eliminar */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                        <span>{days} {days === 1 ? 'día de retraso' : 'días de retraso'}</span>
                      </span>

                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {task.category || 'Operativo'}
                      </span>
                    </div>

                    {/* Delete Task */}
                    <button
                      type="button"
                      onClick={() => setTaskToDelete(task)}
                      title="Eliminar esta tarea"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Task Title & Description */}
                  <div>
                    <h4 
                      onClick={() => onOpenDetail(task)}
                      className="text-sm font-extrabold text-slate-900 group-hover:text-red-700 cursor-pointer transition-colors leading-snug"
                    >
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Assignee Box */}
                  <div className="bg-red-50/50 rounded-xl p-2.5 border border-red-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${assignee.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {assignee.isGroup ? '👥' : assignee.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {assignee.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          <span>{assignee.phone}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400">
                        Debió entregarse:
                      </p>
                      <p className="text-xs font-extrabold text-red-700">
                        {task.dueDate}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: WhatsApp Requerimiento & Mark Done */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    {/* Direct WhatsApp requirement link */}
                    {waLink ? (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Requerir por WhatsApp</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">
                        Sin teléfono registrado
                      </span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(task)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        title="Marcar como cumplida y resuelta"
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Marcar Cumplida</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-extrabold text-emerald-900">
            ¡Felicitaciones! No hay tareas con incumplimiento en este momento
          </h4>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Todos los consejeros de administración se encuentran al día con sus compromisos asignados.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal for Overdue Panel */}
      {taskToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setTaskToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-red-200 space-y-4 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-3 bg-red-100 rounded-2xl">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">¿Eliminar Tarea Vencida?</h4>
                <p className="text-xs text-slate-500">Se eliminará permanentemente</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 line-clamp-2">
                "{taskToDelete.title}"
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteTask(taskToDelete.id);
                  setTaskToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-xs transition-all"
              >
                Sí, Eliminar Ahora
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
