import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { useStore } from '../store/store';

export default function MonthView({ onOpenNewTask, onOpenDetail, onEdit }) {
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric'
  });

  // Calculate days in month and starting day of week
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks based on selectedAssigneeId and other criteria
  const visibleTasks = tasks.filter((t) => {
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
      return { name: 'Todo el Consejo', isGroup: true, color: 'from-amber-500 to-teal-700' };
    }
    const u = users.find(user => user.id === Number(assigneeId));
    return u ? { name: u.name, isGroup: false, color: u.color } : { name: 'Sin Asignar', isGroup: false, color: 'from-slate-400 to-slate-500' };
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-6">
      
      {/* Month Navigator Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Mes anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 capitalize">
              {monthName}
            </h3>
            <p className="text-xs text-slate-500">
              Calendario mensual de tareas y fechas límite
            </p>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Mes siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCurrentMonth}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
          >
            Mes Actual
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

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold uppercase text-slate-500 tracking-wider">
        <span>Lun</span>
        <span>Mar</span>
        <span>Mié</span>
        <span>Jue</span>
        <span>Vie</span>
        <span>Sáb</span>
        <span>Dom</span>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty slots before first day */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[105px] rounded-2xl bg-slate-50/40 border border-slate-100 opacity-40"></div>
        ))}

        {/* Days of Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const dayTasks = visibleTasks.filter(t => t.dueDate === dateStr);

          return (
            <div
              key={dateStr}
              onClick={() => onOpenNewTask({ dueDate: dateStr })}
              className={`min-h-[115px] p-2 rounded-2xl border transition-all flex flex-col justify-between group cursor-pointer ${
                isToday
                  ? 'bg-emerald-50/40 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold ${isToday ? 'text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md' : 'text-slate-800'}`}>
                  {dayNum}
                </span>

                {dayTasks.length > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks List within day cell */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-[75px]" onClick={(e) => e.stopPropagation()}>
                {dayTasks.map((t) => {
                  const assignee = getAssignee(t.assigneeId);
                  return (
                    <div
                      key={t.id}
                      onClick={() => onOpenDetail(t)}
                      className={`text-[10px] p-1.5 rounded-lg border font-semibold truncate flex items-center justify-between gap-1 cursor-pointer transition-all ${
                        t.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : t.status === 'overdue'
                          ? 'bg-red-50 text-red-900 border-red-200'
                          : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`}
                    >
                      <span className="truncate">{t.title}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`¿Eliminar la tarea "${t.title}"?`)) {
                            deleteTask(t.id);
                          }
                        }}
                        title="Eliminar tarea"
                        className="opacity-0 group-hover:opacity-100 hover:text-red-600 shrink-0"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="opacity-0 group-hover:opacity-100 text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 justify-end">
                <Plus className="w-2.5 h-2.5" />
                <span>Añadir</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
