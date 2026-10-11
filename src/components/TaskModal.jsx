import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  User, 
  MessageCircle, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Users,
  Bell
} from 'lucide-react';
import { useStore } from '../store/store';

export default function TaskModal({ isOpen, onClose, initialData = null }) {
  const { users, addTask, updateTask, deleteTask, sendTaskNotification } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('all');
  const [category, setCategory] = useState('Mantenimiento');
  const [priority, setPriority] = useState('Media');
  const [status, setStatus] = useState('pending');
  const [dueDate, setDueDate] = useState('');
  const [checkpoints, setCheckpoints] = useState([]);
  const [newCheckpointText, setNewCheckpointText] = useState('');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setAssigneeId(initialData.assigneeId ?? users[0]?.id ?? 1);
      setCategory(initialData.category || 'Mantenimiento');
      setPriority(initialData.priority || 'Media');
      setStatus(initialData.status || 'pending');
      setDueDate(initialData.dueDate || new Date().toISOString().split('T')[0]);
      setCheckpoints(initialData.checkpoints || []);
    } else {
      // Default new task date: 3 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      setTitle('');
      setDescription('');
      setAssigneeId('all'); // default to 'all' or first user
      setCategory('Mantenimiento');
      setPriority('Media');
      setStatus(initialData?.status || 'pending');
      setDueDate(defaultDate.toISOString().split('T')[0]);
      setCheckpoints([]);
    }
  }, [initialData, isOpen, users]);

  if (!isOpen) return null;

  const handleAddCheckpoint = (e) => {
    e.preventDefault();
    if (!newCheckpointText.trim()) return;
    setCheckpoints([...checkpoints, { text: newCheckpointText.trim(), done: false }]);
    setNewCheckpointText('');
  };

  const handleRemoveCheckpoint = (index) => {
    setCheckpoints(checkpoints.filter((_, i) => i !== index));
  };

  const handleDeleteTask = () => {
    if (initialData?.id && window.confirm(`¿Seguro que deseas eliminar la tarea "${title}"?`)) {
      deleteTask(initialData.id);
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Por favor escribe el título de la tarea.');
      return;
    }

    const finalAssigneeId = assigneeId === 'all' ? 'all' : Number(assigneeId);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      assigneeId: finalAssigneeId,
      category,
      priority,
      status,
      dueDate,
      checkpoints
    };

    let savedTask;
    if (initialData?.id) {
      updateTask(initialData.id, taskData);
      savedTask = { ...initialData, ...taskData };
      if (notifyWhatsApp && finalAssigneeId !== 'all') {
        sendTaskNotification(initialData.id);
      }
    } else {
      savedTask = addTask(taskData);
    }


    onClose();
  };

  const isAllSelected = assigneeId === 'all';
  const selectedConsejero = !isAllSelected ? users.find(u => u.id === Number(assigneeId)) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {initialData ? 'Editar Tarea del Consejo' : 'Asignar Nueva Tarea'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Bosques de Robledal • Gestión 2026
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título de la Tarea <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Cotización Poda de Árboles y Taludes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Descripción y Alcance
            </label>
            <textarea
              rows={3}
              placeholder="Describe las especificaciones, acuerdos de asamblea o instrucciones..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Consejero Responsable Selection with 'TODOS' option */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
              <span>Consejero Responsable <span className="text-red-500">*</span></span>
              {isAllSelected ? (
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                  👥 Asignado a todos ({users.length} miembros)
                </span>
              ) : selectedConsejero ? (
                <span className="text-[11px] font-semibold text-emerald-700">
                  📱 Tel: {selectedConsejero.displayPhone}
                </span>
              ) : null}
            </label>

            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none cursor-pointer"
            >
              <option value="all" className="font-extrabold text-emerald-800">
                👥 TODOS — Asignar colectivamente a todos los consejeros ({users.length} miembros)
              </option>
              <optgroup label="Asignar individualmente:">
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — ({u.role}) • Tel: {u.displayPhone}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Category, Priority & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-none"
              >
                <option value="Finanzas">Finanzas</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Zonas Verdes">Zonas Verdes</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Convivencia">Convivencia</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Prioridad
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-none"
              >
                <option value="Urgente">🚨 Urgente</option>
                <option value="Alta">🔴 Alta</option>
                <option value="Media">🟡 Media</option>
                <option value="Baja">🟢 Baja</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Columna / Estado
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-emerald-500 outline-none"
              >
                <option value="pending">Por Iniciar</option>
                <option value="in-progress">En Proceso</option>
                <option value="overdue">Vencido / Urgente</option>
                <option value="completed">Completado</option>
              </select>
            </div>
          </div>

          {/* Due Date & Scheduled Reminders Info */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha Límite de Cumplimiento
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Bell className="w-3 h-3 text-emerald-600" />
                3 Recordatorios incluidos
              </span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:border-emerald-500 outline-none"
            />
            {/* Compliance Reminders notice */}
            <div className="p-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Recordatorios automáticos:</strong> Se enviará aviso con la URL del aplicativo <strong>24h antes</strong>, <strong>12h antes</strong> y <strong>6h antes</strong> del vencimiento.
              </span>
            </div>
          </div>

          {/* Subtasks / Checkpoints */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Subtareas o Puntos de Control ({checkpoints.length})
            </label>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Añadir paso a seguir..."
                value={newCheckpointText}
                onChange={(e) => setNewCheckpointText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCheckpoint(e)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddCheckpoint}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                + Añadir
              </button>
            </div>

            {checkpoints.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {checkpoints.map((cp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                  >
                    <span className="text-slate-700 font-medium truncate">
                      • {cp.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCheckpoint(idx)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Direct Notification Option (Only for individual consejeros) */}
          {!isAllSelected && (
            <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">
                    Notificar asignación por WhatsApp
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    Prepara el mensaje con fecha límite y enlace directo para el consejero.
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsApp}
                onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          )}


          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            {initialData?.id ? (
              isConfirmingDelete ? (
                <div className="flex-1 bg-red-100 border border-red-300 rounded-2xl p-2.5 flex items-center justify-between gap-2 animate-in fade-in duration-100">
                  <span className="text-xs font-bold text-red-900">¿Eliminar esta tarea definitivamente?</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200"
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteTask(initialData.id);
                        setIsConfirmingDelete(false);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs"
                    >
                      Sí, Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                  <span>Eliminar Tarea</span>
                </button>
              )
            ) : (
              <div></div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all"
              >
                {initialData ? 'Guardar Cambios' : 'Asignar Tarea'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
