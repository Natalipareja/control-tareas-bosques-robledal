import React, { useState } from 'react';
import { 
  Calendar, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckSquare, 
  MoreVertical,
  Trash2,
  Edit3,
  Phone
} from 'lucide-react';
import { useStore } from '../store/store';

const categoryColors = {
  Finanzas: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Mantenimiento: 'bg-blue-50 text-blue-700 border-blue-200',
  'Zonas Verdes': 'bg-lime-50 text-lime-700 border-lime-200',
  Seguridad: 'bg-purple-50 text-purple-700 border-purple-200',
  Convivencia: 'bg-amber-50 text-amber-700 border-amber-200',
  Legal: 'bg-slate-100 text-slate-700 border-slate-200'
};

const priorityBadges = {
  Urgente: 'bg-red-100 text-red-800 border-red-200 font-bold animate-pulse',
  Alta: 'bg-orange-100 text-orange-800 border-orange-200 font-semibold',
  Media: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
  Baja: 'bg-slate-100 text-slate-600 border-slate-200 font-normal'
};

const columnsOrder = ['pending', 'in-progress', 'overdue', 'completed'];

export default function TaskCard({ task, onOpenDetail, onEdit }) {
  const { users, updateTaskStatus, deleteTask, sendTaskNotification } = useStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAll = task.assigneeId === 'all' || task.assigneeId === 0;

  const assignee = isAll
    ? {
        name: 'Todo el Consejo',
        role: 'Responsabilidad Grupal (5 Consejeros)',
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

  const currentColumnIndex = columnsOrder.indexOf(task.status);
  const canMovePrev = currentColumnIndex > 0;
  const canMoveNext = currentColumnIndex < columnsOrder.length - 1;

  const handleMovePrev = (e) => {
    e.stopPropagation();
    if (canMovePrev) {
      updateTaskStatus(task.id, columnsOrder[currentColumnIndex - 1]);
    }
  };

  const handleMoveNext = (e) => {
    e.stopPropagation();
    if (canMoveNext) {
      updateTaskStatus(task.id, columnsOrder[currentColumnIndex + 1]);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    deleteTask(task.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  // Format Due Date & calculate delay
  const today = new Date().toISOString().split('T')[0];
  const isPastDue = task.dueDate && task.dueDate < today && task.status !== 'completed';
  
  const formattedDueDate = task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : 'Sin fecha';

  // Checkpoints progress
  const checkpointsTotal = task.checkpoints?.length || 0;
  const checkpointsDone = task.checkpoints?.filter(c => c.done).length || 0;

  // WhatsApp Link generator
  const cleanPhone = assignee.whatsapp ? assignee.whatsapp.replace(/[^0-9]/g, '') : '';
  const waText = encodeURIComponent(
    `Hola ${assignee.name}, te contacto del Consejo de Administración de Bosques de Robledal respecto a la tarea: *"${task.title}"*.\nEstado actual: *${task.status === 'completed' ? 'Completado' : task.status === 'in-progress' ? 'En Proceso' : task.status === 'overdue' ? 'Vencida / Urgente' : 'Pendiente'}*.\nFecha límite: ${formattedDueDate}.\n¿Podrías por favor compartirnos cómo va el avance o las evidencias? ¡Muchas gracias!`
  );
  const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waText}` : null;

  return (
    <div
      onClick={() => onOpenDetail(task)}
      className="card-hover bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-emerald-300 cursor-pointer flex flex-col justify-between gap-3 group relative transition-all"
    >
      {/* Interactive Delete Confirmation Overlay (No browser alert dependency) */}
      {showDeleteConfirm && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-2xl p-4 flex flex-col justify-between z-30 border-2 border-red-500 shadow-xl animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="flex items-start gap-2.5 text-red-700">
            <Trash2 className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-900">¿Eliminar permanentemente?</p>
              <p className="text-[11px] text-slate-700 line-clamp-1 font-semibold mt-0.5">{task.title}</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">Esta tarea se borrará del sistema y de todas las vistas.</p>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      )}

      {/* Top: Category & Priority */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border ${
              categoryColors[task.category] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {task.category || 'General'}
          </span>
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] border ${
              priorityBadges[task.priority] || priorityBadges.Media
            }`}
          >
            {task.priority || 'Media'}
          </span>
        </div>

        {/* Quick Delete Button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          title="Eliminar esta tarea"
          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Title & Description */}
      <div>
        <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      {/* Subtasks Progress if any */}
      {checkpointsTotal > 0 && (
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
              Subtareas
            </span>
            <span>{checkpointsDone}/{checkpointsTotal}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                checkpointsDone === checkpointsTotal ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${(checkpointsDone / checkpointsTotal) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Assignee Box: Full Name & WhatsApp */}
      <div className={`rounded-xl p-2.5 border flex items-center justify-between gap-2 ${
        isAll 
          ? 'bg-amber-50/70 border-amber-200' 
          : 'bg-slate-50/80 border-slate-200/60'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${
              assignee.color || 'from-emerald-600 to-teal-600'
            } text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}
          >
            {isAll ? '👥' : (assignee.name ? assignee.name.charAt(0) : '?')}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate flex items-center gap-1">
              <span>{assignee.name}</span>
              {isAll && (
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1 rounded font-bold">
                  Todos
                </span>
              )}
            </p>
            <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
              <Phone className="w-2.5 h-2.5 text-slate-400" />
              {assignee.displayPhone || assignee.whatsapp}
            </p>
          </div>
        </div>

        {/* WhatsApp Quick Button */}
        {isAll ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              sendTaskNotification(task.id, 'assign');
              alert('¡Notificación enviada por WhatsApp a todos los 5 miembros del Consejo de Administración!');
            }}
            title="Enviar mensaje de WhatsApp a todos los consejeros"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] transition-all shadow-xs shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>A Todos</span>
          </button>
        ) : waUrl ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Notificar a ${assignee.name} por WhatsApp`}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[11px] transition-all shadow-xs shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Sin WhatsApp</span>
        )}
      </div>

      {/* Bottom Footer: Due Date & Move Status Arrows */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        {/* Due Date Indicator */}
        <div
          className={`flex items-center gap-1 font-medium ${
            task.status === 'completed'
              ? 'text-emerald-600'
              : isPastDue
              ? 'text-red-600 font-bold'
              : 'text-slate-500'
          }`}
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : isPastDue ? (
            <AlertCircle className="w-3.5 h-3.5 text-red-500 animate-bounce" />
          ) : (
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span className="text-[11px]">
            {task.status === 'completed'
              ? 'Finalizada'
              : isPastDue
              ? `Vencida (${formattedDueDate})`
              : formattedDueDate}
          </span>
        </div>

        {/* Status Mover Controls */}
        <div className="flex items-center gap-1">
          {canMovePrev && (
            <button
              onClick={handleMovePrev}
              title="Mover al estado anterior"
              className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          {canMoveNext && (
            <button
              onClick={handleMoveNext}
              title="Avanzar de columna"
              className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
