import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  CheckSquare, 
  FileText, 
  Send, 
  Trash2, 
  Edit3, 
  Phone, 
  ShieldCheck, 
  Paperclip,
  Bell,
  Link,
  Users
} from 'lucide-react';
import { useStore } from '../store/store';

export default function TaskDetailModal({ task, isOpen, onClose, onEdit }) {
  const { 
    users, 
    updateTaskStatus, 
    toggleCheckpoint, 
    addComment, 
    deleteTask,
    sendTaskNotification,
    whatsappConfig 
  } = useStore();

  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState(users[0]?.name || 'Consejo de Administración');
  const [sentNotice, setSentNotice] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!isOpen || !task) return null;

  const isAll = task.assigneeId === 'all' || task.assigneeId === 0;

  const assignee = isAll
    ? {
        name: 'Todo el Consejo',
        role: 'Responsabilidad Colectiva (5 Consejeros)',
        whatsapp: '',
        displayPhone: '5 Consejeros',
        color: 'from-amber-500 via-emerald-600 to-teal-700',
        isGroup: true
      }
    : (users.find((u) => u.id === Number(task.assigneeId)) || {
        name: 'Sin asignar',
        role: 'Consejero',
        whatsapp: '',
        displayPhone: 'Sin teléfono',
        color: 'from-slate-400 to-slate-500',
        isGroup: false
      });

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleAddCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim(), commentAuthor);
    setCommentText('');
  };

  const handleDelete = () => {
    if (window.confirm(`⚠️ ¿Estás seguro de que deseas ELIMINAR permanentemente la tarea "${task.title}"? Esta acción no se puede deshacer.`)) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleSendManualNotification = (type = 'assign') => {
    sendTaskNotification(task.id, type);
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  const formattedDueDate = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : 'Sin fecha límite';

  const appUrl = whatsappConfig?.appUrl || window.location.origin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {task.category || 'General'}
              </span>
              <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                Prioridad: {task.priority}
              </span>
              {isAll && (
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  👥 Asignado a Todos
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">
              {task.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              title="Editar"
              className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              title="Eliminar tarea"
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Status Quick Switcher */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Estado en el Tablero Operativo
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'pending', label: 'Por Iniciar', color: 'hover:bg-amber-100' },
                { id: 'in-progress', label: 'En Proceso', color: 'hover:bg-blue-100' },
                { id: 'overdue', label: 'Vencido / Urg.', color: 'hover:bg-red-100' },
                { id: 'completed', label: 'Completado', color: 'hover:bg-emerald-100' }
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => handleStatusChange(st.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    task.status === st.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : `bg-white text-slate-700 border-slate-200 ${st.color}`
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Descripción y Alcance
            </h4>
            <p className="text-sm text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/60 leading-relaxed whitespace-pre-line">
              {task.description || 'Sin descripción detallada.'}
            </p>
          </div>

          {/* Assigned Consejero Card */}
          <div className="bg-gradient-to-r from-emerald-50/60 to-teal-50/60 p-4 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${
                  assignee.color || 'from-emerald-600 to-teal-600'
                } text-white font-bold text-base flex items-center justify-center shadow-xs shrink-0`}
              >
                {isAll ? '👥' : (assignee.name ? assignee.name.charAt(0) : '?')}
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">
                  {isAll ? 'Asignación Colectiva' : 'Consejero Responsable Asignado'}
                </p>
                <h4 className="text-sm font-bold text-slate-900">
                  {assignee.name}
                </h4>
                <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{assignee.displayPhone || assignee.whatsapp}</span>
                  <span className="text-slate-400">•</span>
                  <span>{assignee.role}</span>
                </p>
              </div>
            </div>

            {!isAll && (
              <button
                onClick={() => handleSendManualNotification()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{sentNotice ? '¡Notificación Enviada!' : 'Enviar a su WhatsApp'}</span>
              </button>
            )}
          </div>




          {/* Due Date Info */}
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">Fecha Límite:</span>
            <span className="capitalize">{formattedDueDate}</span>
          </div>

          {/* Checkpoints Checklist */}
          {task.checkpoints && task.checkpoints.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Subtareas y Puntos de Control ({task.checkpoints.filter(c => c.done).length}/{task.checkpoints.length})
              </h4>
              <div className="space-y-2">
                {task.checkpoints.map((cp, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleCheckpoint(task.id, idx)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      cp.done
                        ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900 line-through opacity-85'
                        : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={cp.done}
                      onChange={() => {}}
                      className="w-4 h-4 rounded accent-emerald-600 cursor-pointer pointer-events-none"
                    />
                    <span className="text-xs font-medium">{cp.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments from the Council */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Bitácora y Comentarios del Consejo ({task.comments?.length || 0})
            </h4>

            {/* List */}
            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
              {task.comments && task.comments.length > 0 ? (
                task.comments.map((cm) => (
                  <div
                    key={cm.id}
                    className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="font-bold text-slate-800">{cm.author}</span>
                      <span className="text-[10px]">{cm.date}</span>
                    </div>
                    <p className="text-slate-700">{cm.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Aún no hay comentarios registrados. Agrega uno abajo.
                </p>
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddCommentSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe una observación o actualización..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Firmar como:</span>
                <select
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="text-[11px] font-semibold text-slate-700 bg-transparent border-0 outline-none cursor-pointer"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.name}>
                      {u.name}
                    </option>
                  ))}
                  <option value="Consejo de Administración">Consejo de Administración</option>
                </select>
              </div>
            </form>
          </div>

        </div>

        {/* Footer with Prominent Delete Button */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          {isConfirmingDelete ? (
            <div className="flex-1 bg-red-100 border border-red-300 rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in duration-150">
              <div className="flex items-center gap-2 text-red-900">
                <Trash2 className="w-5 h-5 shrink-0 text-red-600" />
                <span className="text-xs font-extrabold">¿Confirmas eliminar definitivamente esta tarea?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteTask(task.id);
                    setIsConfirmingDelete(false);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors"
                >
                  Sí, Eliminar Ahora
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors shadow-2xs"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              <span>Eliminar Tarea</span>
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(task);
              }}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
