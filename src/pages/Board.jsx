import React from 'react';
import { useStore } from '../store/store';

export default function Board() {
  const { tasks } = useStore();
  
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tablero Operativo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-xl min-h-[500px]">
          <h3 className="font-semibold text-orange-600 mb-4">Pendiente / En Proceso</h3>
          {tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').map(t => (
            <div key={t.id} className="card mb-3 border-l-4 border-l-orange-500">
              <h4 className="font-bold">{t.title}</h4>
              <p className="text-sm text-gray-600">{t.description}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-xl min-h-[500px]">
          <h3 className="font-semibold text-red-600 mb-4">Vencido / Urgente</h3>
          {tasks.filter(t => t.status === 'overdue').map(t => (
            <div key={t.id} className="card mb-3 border-l-4 border-l-red-500">
              <h4 className="font-bold">{t.title}</h4>
              <p className="text-sm text-gray-600">{t.description}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-4 rounded-xl min-h-[500px]">
          <h3 className="font-semibold text-vibrant-green mb-4">Completado</h3>
          {tasks.filter(t => t.status === 'completed').map(t => (
            <div key={t.id} className="card mb-3 border-l-4 border-l-emerald-500">
              <h4 className="font-bold">{t.title}</h4>
              <p className="text-sm text-gray-600">{t.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
