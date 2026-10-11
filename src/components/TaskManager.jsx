import React, { useState } from 'react';
import { 
  CheckSquare, 
  CalendarDays, 
  CalendarRange, 
  Calendar as CalendarIcon, 
  Filter, 
  Search, 
  Plus, 
  Users, 
  X,
  Sparkles,
  AlertTriangle,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { useStore } from '../store/store';
import { exportTasksToExcel } from '../utils/excelExport';
import KanbanBoard from './KanbanBoard';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import TasksMatrix from './TasksMatrix';
import IncumplimientosPanel from './IncumplimientosPanel';
import ExcelExportModal from './ExcelExportModal';

export default function TaskManager({ onOpenNewTask, onOpenDetail, onEdit }) {
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

  const [activeSubView, setActiveSubView] = useState('kanban'); // 'kanban' | 'day' | 'week' | 'month' | 'overdue'
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportModalInfo, setExportModalInfo] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => t.status !== 'completed' && (t.status === 'overdue' || (t.dueDate && t.dueDate < todayStr))).length;

  const selectedUser = users.find(u => u.id === selectedAssigneeId);

  // Filtered tasks according to active selectors
  const filteredTasks = tasks.filter((t) => {
    if (selectedAssigneeId) {
      if (selectedAssigneeId === 'all') {
        if (t.assigneeId !== 'all') return false;
      } else {
        if (t.assigneeId !== selectedAssigneeId && t.assigneeId !== 'all') return false;
      }
    }
    if (selectedCategory && selectedCategory !== 'all' && t.category !== selectedCategory) {
      return false;
    }
    if (selectedPriority && selectedPriority !== 'all' && t.priority !== selectedPriority) {
      return false;
    }
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchDesc = t.description?.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const handleExportTop = async () => {
    setDownloadSuccess(true);
    const res = await exportTasksToExcel(filteredTasks, users);
    if (res && res.success) {
      setExportModalInfo({
        savedPath: res.savedPath,
        filename: res.filename
      });
      setTimeout(() => setDownloadSuccess(false), 3000);
    } else {
      setDownloadSuccess(false);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* View Switcher & Toolbar Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/60 overflow-x-auto">
          {[
            { id: 'kanban', label: 'Tablero Kanban', icon: CheckSquare },
            { id: 'day', label: 'Por Día', icon: CalendarIcon },
            { id: 'week', label: 'Por Semana', icon: CalendarDays },
            { id: 'month', label: 'Por Mes', icon: CalendarRange },
            { id: 'overdue', label: 'Incumplimientos', icon: AlertTriangle, badge: overdueCount }
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = activeSubView === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveSubView(mode.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? mode.id === 'overdue' 
                      ? 'bg-red-600 text-white shadow-xs' 
                      : 'bg-white text-emerald-800 shadow-xs ring-1 ring-slate-200/60'
                    : mode.id === 'overdue' && mode.badge > 0
                      ? 'text-red-700 bg-red-50 hover:bg-red-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (mode.id === 'overdue' ? 'text-white' : 'text-emerald-600') : (mode.id === 'overdue' ? 'text-red-600' : 'text-slate-400')}`} />
                <span>{mode.label}</span>
                {mode.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                    isActive && mode.id === 'overdue' ? 'bg-white text-red-700' : 'bg-red-200 text-red-900'
                  }`}>
                    {mode.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Consejero, Category & Priority Filters */}
        <div className="flex items-center gap-2.5 flex-wrap">
          
          {/* Consejero Filter Selector (Prominent requirement) */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <select
              value={selectedAssigneeId === null ? 'all' : selectedAssigneeId}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'all') setSelectedAssigneeId(null);
                else if (val === 'group_all') setSelectedAssigneeId('all');
                else setSelectedAssigneeId(Number(val));
              }}
              className="text-xs font-bold bg-transparent text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Filtrar por Consejero: (Todos)</option>
              <option value="group_all">👥 Solo asignadas a "Todo el Consejo"</option>
              <optgroup label="Consejeros individuales:">
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">Todas las Categorías</option>
            <option value="Finanzas">Finanzas</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Zonas Verdes">Zonas Verdes</option>
            <option value="Seguridad">Seguridad</option>
            <option value="Convivencia">Convivencia</option>
            <option value="Legal">Legal</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:border-emerald-500"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="Urgente">Urgente</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>

          {/* Descargar Excel Button in Toolbar */}
          <button
            onClick={handleExportTop}
            id="btn-export-excel-top-toolbar"
            title="Descargar matriz de control operativo en formato Excel (.xlsx oficial)"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs border ${
              downloadSuccess
                ? 'bg-emerald-700 text-white border-emerald-600 ring-2 ring-emerald-300'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>¡Descargado .xlsx!</span>
              </>
            ) : (
              <>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Descargar Excel</span>
              </>
            )}
          </button>

          {/* New Task Action */}
          <button
            onClick={() => onOpenNewTask()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Nueva Tarea</span>
          </button>
        </div>
      </div>

      {/* Active Filter Pill */}
      {selectedUser && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            👤 Mostrando tareas de: {selectedUser.name} ({selectedUser.displayPhone})
            <button
              onClick={() => setSelectedAssigneeId(null)}
              className="text-slate-400 hover:text-red-600 font-bold ml-1"
              title="Quitar filtro"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Render Active View */}
      {activeSubView === 'kanban' && (
        <KanbanBoard
          onOpenNewTask={onOpenNewTask}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
        />
      )}

      {activeSubView === 'day' && (
        <DayView
          onOpenNewTask={onOpenNewTask}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
        />
      )}

      {activeSubView === 'week' && (
        <WeekView
          onOpenNewTask={onOpenNewTask}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
        />
      )}

      {activeSubView === 'month' && (
        <MonthView
          onOpenNewTask={onOpenNewTask}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
        />
      )}

      {/* DEDICATED OVERDUE PANEL (Cuadro aparte de tareas y consejeros con incumplimiento) */}
      <IncumplimientosPanel
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
      />

      {/* PERMANENT BOTTOM MATRIX (Always visible at the bottom) */}
      <TasksMatrix
        onOpenNewTask={onOpenNewTask}
        onOpenDetail={onOpenDetail}
        onEdit={onEdit}
      />

      {/* Excel Export Success & Direct Open Modal */}
      <ExcelExportModal
        isOpen={!!exportModalInfo}
        onClose={() => setExportModalInfo(null)}
        savedPath={exportModalInfo?.savedPath}
        filename={exportModalInfo?.filename}
      />

    </div>
  );
}
