import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Copy, 
  Check, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { useStore } from '../store/store';

export default function MetricsDashboard() {
  const { tasks, users } = useStore();
  const [copied, setCopied] = useState(false);

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const overdue = tasks.filter(t => t.status === 'overdue').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const activeTotal = pending + inProgress + overdue;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Breakdown by category
  const categories = ['Finanzas', 'Mantenimiento', 'Zonas Verdes', 'Seguridad', 'Convivencia', 'Legal'];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category === cat).length
  })).filter(c => c.count > 0);

  // Generate executive summary text for Council Meetings / Minutes (Actas de Consejo)
  const generateMeetingSummary = () => {
    let summary = `🏛️ REPORTE EJECUTIVO - CONSEJO DE ADMINISTRACIÓN BOSQUES DE ROBLEDAL (GESTIÓN 2026)\n`;
    summary += `Fecha de corte: ${new Date().toLocaleDateString('es-CO')}\n`;
    summary += `---------------------------------------------------------\n`;
    summary += `📊 ESTADO GENERAL:\n`;
    summary += `• Total Tareas Registradas: ${total}\n`;
    summary += `• Tareas Completadas: ${completed} (${completionRate}%)\n`;
    summary += `• Tareas en Proceso / Pendientes: ${pending + inProgress}\n`;
    summary += `• Tareas Vencidas / Urgentes: ${overdue}\n\n`;
    summary += `👥 RESPONSABILIDAD POR CONSEJERO:\n`;
    users.forEach(u => {
      const uTasks = tasks.filter(t => t.assigneeId === u.id);
      const uComp = uTasks.filter(t => t.status === 'completed').length;
      summary += `• ${u.name} (${u.role}): ${uTasks.length} tareas (${uComp} completadas) - Tel: ${u.displayPhone}\n`;
    });
    return summary;
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateMeetingSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Métricas de Gestión 2026
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Indicadores y Rendimiento del Consejo
          </h2>
          <p className="text-sm text-slate-500">
            Seguimiento de compromisos, carga operativa y efectividad de ejecución.
          </p>
        </div>

        {/* Copy for WhatsApp / Minutes Button */}
        <button
          onClick={handleCopySummary}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Resumen para Acta / WhatsApp'}</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tareas</p>
          <p className="text-3xl font-black text-slate-900 mt-2">{total}</p>
          <p className="text-xs text-slate-400 mt-1">100% de la gestión</p>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600">En Curso</p>
          <p className="text-3xl font-black text-blue-700 mt-2">{inProgress + pending}</p>
          <p className="text-xs text-slate-400 mt-1">Actualmente activas</p>
        </div>

        {/* Overdue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-red-600">Vencidas / Urg.</p>
          <p className="text-3xl font-black text-red-700 mt-2">{overdue}</p>
          <p className="text-xs text-slate-400 mt-1">Requieren atención</p>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Completadas</p>
          <p className="text-3xl font-black text-emerald-700 mt-2">{completed}</p>
          <p className="text-xs text-slate-400 mt-1">Ejecutadas con éxito</p>
        </div>

        {/* Effectiveness Rate */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-3xl text-white shadow-md col-span-2 lg:col-span-1">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">Cumplimiento</p>
          <p className="text-3xl font-black mt-2">{completionRate}%</p>
          <p className="text-xs text-emerald-200 mt-1">Tasa de resolución</p>
        </div>
      </div>

      {/* Breakdown by Consejero & Breakdown by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Consejeros Workload */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Carga de Trabajo por Consejero</span>
            </h3>
            <span className="text-xs text-slate-400">{users.length} miembros</span>
          </div>

          <div className="space-y-4">
            {users.map((user) => {
              const uTasks = tasks.filter((t) => t.assigneeId === user.id);
              const uComp = uTasks.filter((t) => t.status === 'completed').length;
              const uPct = total > 0 ? Math.round((uTasks.length / total) * 100) : 0;

              return (
                <div key={user.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{user.name}</span>
                    <span className="text-slate-500 font-medium">
                      {uTasks.length} tareas ({uComp} listas) • <strong className="text-emerald-700">{uPct}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${user.color || 'from-emerald-500 to-teal-600'}`}
                      style={{ width: `${uPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Distribución por Áreas del Conjunto</span>
            </h3>
            <span className="text-xs text-slate-400">{categoryCounts.length} áreas</span>
          </div>

          <div className="space-y-4">
            {categoryCounts.map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{cat.name}</span>
                    <span className="text-slate-500 font-medium">
                      {cat.count} tareas • <strong className="text-slate-800">{pct}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-800"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
