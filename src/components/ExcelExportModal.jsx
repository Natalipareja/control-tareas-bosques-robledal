import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  CheckCircle2, 
  FolderOpen, 
  ExternalLink, 
  X, 
  Sparkles,
  Download
} from 'lucide-react';
import { openExcelFile, openDownloadsFolder } from '../utils/excelExport';

export default function ExcelExportModal({ isOpen, onClose, savedPath, filename }) {
  const [openingExcel, setOpeningExcel] = useState(false);
  const [openingFolder, setOpeningFolder] = useState(false);
  const [openedMsg, setOpenedMsg] = useState(null);

  if (!isOpen) return null;

  const handleOpenExcel = async () => {
    setOpeningExcel(true);
    const ok = await openExcelFile(savedPath);
    setOpeningExcel(false);
    if (ok) {
      setOpenedMsg('¡Abriendo en Microsoft Excel...!');
      setTimeout(() => setOpenedMsg(null), 3500);
    }
  };

  const handleOpenFolder = async () => {
    setOpeningFolder(true);
    const ok = await openDownloadsFolder();
    setOpeningFolder(false);
    if (ok) {
      setOpenedMsg('¡Abriendo carpeta en el Explorador de Windows...!');
      setTimeout(() => setOpenedMsg(null), 3500);
    }
  };

  const displayFilename = filename || `Matriz_Control_Operativo_Bosques_Robledal_${new Date().toISOString().split('T')[0]}.xlsx`;
  const displayFolder = savedPath || `D:\\Downloads\\${displayFilename}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl ring-4 ring-emerald-50">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  Matriz Exportada con Éxito
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Excel .xlsx
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Conjunto Residencial Bosques de Robledal • Gestión 2026
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Location Banner */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Archivo generado y guardado en tu computador:</span>
          </div>
          <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs font-mono font-bold text-emerald-900 break-all select-all">
            {displayFolder}
          </div>
          <p className="text-[11px] text-slate-500">
            El archivo contiene todas las tareas, estados, responsables, fechas límite y semáforo de cumplimiento.
          </p>
        </div>

        {/* Feedback message */}
        {openedMsg && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-bold text-emerald-800 animate-in fade-in duration-200">
            {openedMsg}
          </div>
        )}

        {/* Actions Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleOpenExcel}
            disabled={openingExcel}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-2xl text-xs font-extrabold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{openingExcel ? 'Abriendo...' : 'Abrir en Microsoft Excel'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenFolder}
            disabled={openingFolder}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
          >
            <FolderOpen className="w-4 h-4 text-slate-600" />
            <span>{openingFolder ? 'Abriendo...' : 'Abrir Carpeta'}</span>
          </button>
        </div>

        {/* Footer close */}
        <div className="text-center pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600 py-1"
          >
            Cerrar ventana
          </button>
        </div>
      </div>
    </div>
  );
}
