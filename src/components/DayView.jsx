import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  MessageCircle,
  Phone
} from 'lucide-react';
import { useStore } from '../store/store';

export default function DayView({ onOpenNewTask, onOpenDetail, onEdit }) {
  const { 
    tasks, 
    users, 
    selectedAssigneeId,
    searchQuery,
    selectedCategory,
    selectedPriority,
    deleteTask 
  } = useStore();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const formattedDayTitle = new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const dayTasks = tasks.filter(t => {
    if (t.dueDate !== selectedDate) return false;
    
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

  const getAssignee = (assigneeId) => {
    if (assigneeId === 'all' || assigneeId === 0) {
      return { name: 'Todo el Consejo', phone: 'Todos', isGroup: true, color: 'from-amber-500 to-teal-700' };
    }
    const u = users.find(user => user.id === Number(assigneeId));
    return u ? { name: u.name, phone: u.displayPhone || u.whatsapp, isGroup: false, color: u.color } : { name: 'Sin Asignar', phone: '', color: 'from-slate-400 to-slate-500' };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      
      {/* Date Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Día anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 capitalize">
              {formattedDayTitle}
            </h3>
            <p className="text-xs text-slate-500">
              {dayTasks.length} tarea(s) programada(s) para esta fecha
            </p>
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Día siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Hoy
          </button>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => onOpenNewTask({ dueDate: selectedDate })}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir en este día</span>
          </button>
        </div>
      </div>

      {/* Day Tasks List */}
      <div className="space-y-3">
        {dayTasks.length > 0 ? (
          dayTasks.map((t) => {
            const assignee = getAssignee(t.assigneeId);
            return (
              <div
                key={t.id}
                onClick={() => onOpenDetail(t)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      {t.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      {t.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-500 capitalize">
                      • {t.status === 'completed' ? 'Completado' : t.status === 'in-progress' ? 'En Proceso' : t.status === 'overdue' ? 'Vencido' : 'Por Iniciar'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {t.title}
                  </h4>
                  {t.description && (
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {t.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2 text-xs">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${assignee.color} text-white font-bold text-[10px] flex items-center justify-center`}>
                      {assignee.isGroup ? '👥' : assignee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{assignee.name}</p>
                      <p className="text-[10px] text-slate-500">{assignee.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                    <button
                      onClick={() => onEdit(t)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar la tarea "${t.title}"?`)) {
                          deleteTask(t.id);
                        }
                      }}
                      title="Eliminar tarea"
                      className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">
              No hay tareas programadas para este día ({selectedDate})
            </p>
            <button
              onClick={() => onOpenNewTask({ dueDate: selectedDate })}
              className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear tarea para este día</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
