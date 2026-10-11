import React, { useState } from 'react';
import { 
  Table, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  PlayCircle, 
  MessageCircle, 
  Phone, 
  Calendar, 
  Users, 
  Filter, 
  Plus, 
  Bell,
  ArrowUpDown,
  FileSpreadsheet,
  Download,
  Check
} from 'lucide-react';
import { useStore } from '../store/store';
import { exportTasksToExcel, exportTasksToCSV } from '../utils/excelExport';

const statusBadges = {
  pending: {
    label: 'Por Iniciar',
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Clock
  },
  'in-progress': {
    label: 'En Proceso',
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: PlayCircle
  },
  overdue: {
    label: 'Vencido / Urg.',
    badge: 'bg-red-100 text-red-900 border-red-300 animate-pulse',
    icon: AlertTriangle
  },
  completed: {
    label: 'Completado',
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    icon: CheckCircle2
  }
};

const priorityBadges = {
  Urgente: 'bg-red-50 text-red-700 border-red-200 font-bold',
  Alta: 'bg-orange-50 text-orange-700 border-orange-200 font-semibold',
  Media: 'bg-amber-50 text-amber-700 border-amber-200 font-medium',
  Baja: 'bg-slate-100 text-slate-700 border-slate-200'
};

export default function TasksMatrix({ onOpenNewTask, onOpenDetail, onEdit }) {
  const { 
    tasks, 
    users, 
    selectedAssigneeId,
    searchQuery,
    selectedCategory,
    selectedPriority,
    deleteTask, 
    updateTaskStatus 
  } = useStore();
  const [matrixStatusFilter, setMatrixStatusFilter] = useState('all');
  const [taskToDelete, setTaskToDelete] = useState(null);

  const filteredTasks = tasks.filter((t) => {
    // Status filter
    if (matrixStatusFilter !== 'all' && t.status !== matrixStatusFilter) {
      return false;
    }

    // Consejero filter
    if (selectedAssigneeId) {
      if (selectedAssigneeId === 'all') {
        if (t.assigneeId !== 'all') return false;
      } else {
        if (t.assigneeId !== selectedAssigneeId && t.assigneeId !== 'all') return false;
      }
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }

    // Priority filter
    if (selectedPriority && selectedPriority !== 'all' && t.priority !== selectedPriority) {
      return false;
    }

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  const handleDelete = (task) => {
    setTaskToDelete(task);
  };

  const getAssignee = (assigneeId) => {
    if (assigneeId === 'all' || assigneeId === 0) {
      return {
        name: 'Todo el Consejo',
        role: '5 Consejeros',
        phone: 'Todos',
        isGroup: true,
        color: 'from-amber-500 via-emerald-600 to-teal-700'
      };
    }
    const u = users.find(user => user.id === Number(assigneeId));
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
      phone: 'Sin teléfono',
      isGroup: false,
      color: 'from-slate-400 to-slate-500'
    };
  };

  const today = new Date().toISOString().split('T')[0];
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const exportToExcel = async () => {
    const success = await exportTasksToExcel(filteredTasks, users);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } else {
      alert('Hubo un problema al generar el archivo Excel. Por favor intenta con el botón CSV.');
    }
  };

  const exportToCSV = () => {
    const success = exportTasksToCSV(filteredTasks, users);
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    }
  };

  return (
    <div className="mt-12 bg-white rounded-3xl border border-slate-200 shadow-md p-6 max-w-7xl mx-auto space-y-5">
      
      {/* Matrix Header & Title */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 text-white">
              <Table className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Matriz General de Control Operativo
            </h3>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {filteredTasks.length} registradas
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Resumen permanente de compromisos, fechas límites y seguimiento oficial del Consejo de Administración.
          </p>
        </div>

        {/* Right side: Status Quick Filter Buttons & Excel Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Status Quick Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: 'Todas', count: tasks.length },
              { id: 'pending', label: 'Por Iniciar', count: tasks.filter(t => t.status === 'pending').length },
              { id: 'in-progress', label: 'En Proceso', count: tasks.filter(t => t.status === 'in-progress').length },
              { id: 'overdue', label: 'Vencidas', count: tasks.filter(t => t.status === 'overdue').length },
              { id: 'completed', label: 'Completadas', count: tasks.filter(t => t.status === 'completed').length }
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setMatrixStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  matrixStatusFilter === st.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>{st.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  matrixStatusFilter === st.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {st.count}
                </span>
              </button>
            ))}
          </div>

          {/* Excel & CSV Export Action Buttons */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={exportToExcel}
              id="btn-download-excel-matrix"
              title="Descargar matriz en formato Excel (.xlsx oficial de Microsoft Excel)"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm hover:shadow-md transition-all transform active:scale-95 ${
                downloadSuccess 
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡Descargando Excel (.xlsx)!</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                  <span>Descargar Excel</span>
                </>
              )}
            </button>

            <button
              onClick={exportToCSV}
              id="btn-download-csv-matrix"
              title="Descargar como archivo CSV compatible con Excel"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4">Tarea / Compromiso</th>
              <th className="py-3.5 px-4">Área & Prioridad</th>
              <th className="py-3.5 px-4">Responsable</th>
              <th className="py-3.5 px-4">Fecha Límite</th>
              <th className="py-3.5 px-4">Alerta / Cumplimiento</th>
              <th className="py-3.5 px-4 text-right">Acciones (Eliminar/Editar)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => {
                const assignee = getAssignee(t.assigneeId);
                const statusInfo = statusBadges[t.status] || statusBadges.pending;
                const StatusIcon = statusInfo.icon;
                const isOverdue = t.dueDate && t.dueDate < today && t.status !== 'completed';

                const formattedDate = t.dueDate ? new Date(t.dueDate + 'T00:00:00').toLocaleDateString('es-CO', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }) : 'Sin fecha';

                const isGroupTask = assignee.isGroup || t.assigneeId === 'all' || t.assigneeId === 0;
                const waPhone = (!isGroupTask && assignee.whatsapp) ? assignee.whatsapp.replace(/[^0-9]/g, '') : '';
                const waUrl = waPhone ? `https://wa.me/${waPhone}?text=${encodeURIComponent(
                  `Hola ${assignee.name}, te contacto del Consejo de Administración sobre la tarea: *${t.title}*. Fecha límite: ${formattedDate}.`
                )}` : null;

                return (
                  <tr 
                    key={t.id} 
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                    onClick={() => onOpenDetail(t)}
                  >
                    {/* Status Column */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusInfo.badge}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </td>

                    {/* Task Title & Description - Full text display, wraps naturally */}
                    <td className="py-3.5 px-4 min-w-[260px] max-w-md">
                      <p className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-normal break-words leading-snug text-xs sm:text-sm">
                        {t.title}
                      </p>
                      {t.description && (
                        <p className="text-[11px] text-slate-600 whitespace-normal break-words mt-1 leading-relaxed">
                          {t.description}
                        </p>
                      )}
                    </td>

                    {/* Category & Priority */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md font-semibold text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {t.category || 'General'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] border ${priorityBadges[t.priority] || priorityBadges.Media}`}>
                          {t.priority}
                        </span>
                      </div>
                    </td>

                    {/* Assignee */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-md bg-gradient-to-tr ${assignee.color} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                          {assignee.isGroup ? '👥' : assignee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs truncate">
                            {assignee.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            <span>{assignee.phone}</span>
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Abrir WhatsApp"
                                className="text-emerald-600 hover:text-emerald-700"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-semibold flex items-center gap-1 ${
                        isOverdue ? 'text-red-600 font-bold' : t.status === 'completed' ? 'text-emerald-700' : 'text-slate-700'
                      }`}>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formattedDate}</span>
                      </span>
                    </td>

                    {/* Compliance Alert Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {isOverdue ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-red-100 text-red-800 rounded-lg text-[11px] font-extrabold border border-red-300 animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <span>Vencida</span>
                        </span>
                      ) : t.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200">
                          ✓ Cumplida
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200">
                          En plazo
                        </span>
                      )}
                    </td>

                    {/* Actions Column (View, Edit, DELETE) */}
                    <td className="py-3 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEdit(t)}
                          title="Editar tarea"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(t)}
                          title="Eliminar tarea"
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                  No hay tareas registradas en este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
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
                <h4 className="text-sm font-extrabold text-slate-900">¿Eliminar Tarea?</h4>
                <p className="text-xs text-slate-500">Se eliminará permanentemente</p>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-xs font-bold text-slate-800 line-clamp-2">
                "{taskToDelete.title}"
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Responsable: {getAssignee(taskToDelete.assigneeId).name}
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
