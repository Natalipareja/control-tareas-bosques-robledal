import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { useStore } from '../store/store';

export default function WeekView({ onOpenNewTask, onOpenDetail, onEdit }) {
  const { 
    tasks, 
    users, 
    selectedAssigneeId,
    searchQuery,
    selectedCategory,
    selectedPriority,
    deleteTask 
  } = useStore();
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Get Monday of the current week
  const getMonday = (d) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(currentDate);

  // Generate 7 days
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      dateObj: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-CO', { weekday: 'short' }),
      dayNumber: d.getDate(),
      monthName: d.toLocaleDateString('es-CO', { month: 'short' })
    };
  });

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  const handleThisWeek = () => {
    setCurrentDate(new Date());
  };

  const weekTitle = `${weekDays[0].dayNumber} ${weekDays[0].monthName} — ${weekDays[6].dayNumber} ${weekDays[6].monthName} (${weekDays[0].dateObj.getFullYear()})`;

  const todayStr = new Date().toISOString().split('T')[0];

  const getAssignee = (assigneeId) => {
    if (assigneeId === 'all' || assigneeId === 0) {
      return { name: 'Todo el Consejo', isGroup: true, color: 'from-amber-500 to-teal-700' };
    }
    const u = users.find(user => user.id === Number(assigneeId));
    return u ? { name: u.name, isGroup: false, color: u.color } : { name: 'Sin Asignar', isGroup: false, color: 'from-slate-400 to-slate-500' };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      
      {/* Week Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevWeek}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Semana anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 capitalize">
              Semana: {weekTitle}
            </h3>
            <p className="text-xs text-slate-500">
              Vista semanal de 7 días (Lunes a Domingo)
            </p>
          </div>

          <button
            onClick={handleNextWeek}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Semana siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleThisWeek}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Esta Semana
          </button>
          <button
            onClick={() => onOpenNewTask()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 items-start">
        {weekDays.map((day) => {
          const isToday = day.dateStr === todayStr;
          const dayTasks = tasks.filter(t => {
            if (t.dueDate !== day.dateStr) return false;
            
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

          return (
            <div
              key={day.dateStr}
              className={`rounded-2xl border p-3 flex flex-col min-h-[360px] ${
                isToday 
                  ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20' 
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500 capitalize">
                    {day.dayName}
                  </p>
                  <p className={`text-base font-extrabold ${isToday ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {day.dayNumber}
                  </p>
                </div>

                <button
                  onClick={() => onOpenNewTask({ dueDate: day.dateStr })}
                  title={`Añadir tarea el ${day.dateStr}`}
                  className="p-1 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks in this day */}
              <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px]">
                {dayTasks.length > 0 ? (
                  dayTasks.map((t) => {
                    const assignee = getAssignee(t.assigneeId);
                    return (
                      <div
                        key={t.id}
                        onClick={() => onOpenDetail(t)}
                        className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-2xs hover:border-emerald-400 cursor-pointer text-xs space-y-1.5 group relative transition-all"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {t.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`¿Eliminar la tarea "${t.title}"?`)) {
                                deleteTask(t.id);
                              }
                            }}
                            title="Eliminar tarea"
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-700">
                          {t.title}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          <span className="text-slate-500 font-medium truncate max-w-[80px]">
                            {assignee.name}
                          </span>
                          <span className={`px-1 rounded text-[9px] font-bold ${
                            t.status === 'completed' ? 'text-emerald-700' : 'text-blue-700'
                          }`}>
                            {t.status === 'completed' ? '✓' : '•'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[10px] text-slate-400 text-center py-6">
                    Sin tareas
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
