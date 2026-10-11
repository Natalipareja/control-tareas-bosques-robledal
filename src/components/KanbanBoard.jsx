import React from 'react';
import { 
  Plus, 
  Clock, 
  PlayCircle, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  Search, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/store';
import TaskCard from './TaskCard';

const columns = [
  {
    id: 'pending',
    title: 'Por Iniciar / Pendiente',
    icon: Clock,
    color: 'from-amber-500 to-amber-600',
    headerBg: 'bg-amber-50/80 border-amber-200 text-amber-900',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    accentBorder: 'border-t-amber-500'
  },
  {
    id: 'in-progress',
    title: 'En Proceso',
    icon: PlayCircle,
    color: 'from-blue-600 to-indigo-600',
    headerBg: 'bg-blue-50/80 border-blue-200 text-blue-900',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    accentBorder: 'border-t-blue-500'
  },
  {
    id: 'overdue',
    title: 'Vencido / Urgente',
    icon: AlertTriangle,
    color: 'from-red-600 to-rose-600',
    headerBg: 'bg-red-50/80 border-red-200 text-red-900',
    badgeBg: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
    accentBorder: 'border-t-red-500'
  },
  {
    id: 'completed',
    title: 'Completado',
    icon: CheckCircle,
    color: 'from-emerald-600 to-teal-600',
    headerBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    accentBorder: 'border-t-emerald-500'
  }
];

export default function KanbanBoard({ onOpenNewTask, onOpenDetail, onEdit }) {
  const { 
    tasks, 
    users, 
    selectedAssigneeId, 
    setSelectedAssigneeId,
    searchQuery, 
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPriority,
    setSelectedPriority 
  } = useStore();

  const selectedUser = users.find(u => u.id === selectedAssigneeId);

  // Filter tasks based on search, assignee, category, and priority
  const filteredTasks = tasks.filter((task) => {
    // Assignee filter
    if (selectedAssigneeId && task.assigneeId !== selectedAssigneeId) {
      return false;
    }
    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) {
      return false;
    }
    // Priority filter
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
      return false;
    }
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const taskAssignee = users.find(u => u.id === task.assigneeId);
      const assigneeName = taskAssignee ? taskAssignee.name.toLowerCase() : '';
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q) || false;
      const matchCategory = task.category?.toLowerCase().includes(q) || false;
      const matchAssignee = assigneeName.includes(q);
      if (!matchTitle && !matchDesc && !matchCategory && !matchAssignee) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Board Controls Toolbar */}
      <div className="bg-white rounded-2xl p-4 mb-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Left: Summary Title & Active filter chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-base">
              Tablero de Tareas Operativas
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {filteredTasks.length} de {tasks.length} tareas
            </span>
          </div>

          {selectedUser && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              👤 Filtrado por: {selectedUser.name}
              <button 
                onClick={() => setSelectedAssigneeId(null)}
                className="hover:text-red-600 font-bold ml-1"
                title="Quitar filtro"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {/* Right: Category, Priority Filters & Search */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Category Selector */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-emerald-500 outline-none"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Zonas Verdes">Zonas Verdes</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Convivencia">Convivencia</option>
            <option value="Legal">Legal</option>
          </select>

          {/* Priority Selector */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:border-emerald-500 outline-none"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          {/* New Task Button on Board toolbar */}
          <button
            onClick={() => onOpenNewTask()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* 4 Columns Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const IconComponent = col.icon;

          return (
            <div
              key={col.id}
              className={`bg-slate-100/90 rounded-2xl border border-slate-200/90 p-3.5 flex flex-col min-h-[580px] shadow-2xs border-t-4 ${col.accentBorder}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${col.headerBg}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wide text-slate-800">
                      {col.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.badgeBg}`}
                  >
                    {colTasks.length}
                  </span>
                  
                  {/* Quick Add into this column */}
                  <button
                    onClick={() => onOpenNewTask({ status: col.id })}
                    title={`Añadir tarea en ${col.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[75vh] pr-0.5">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onOpenDetail={onOpenDetail}
                      onEdit={onEdit}
                    />
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                      No hay tareas en esta columna
                    </p>
                    <button
                      onClick={() => onOpenNewTask({ status: col.id })}
                      className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Añadir tarea
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
