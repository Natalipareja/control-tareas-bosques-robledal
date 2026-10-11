import * as XLSX from 'xlsx';

export function getAssigneeInfo(assigneeId, users) {
  if (assigneeId === 'all' || assigneeId === 0) {
    return {
      name: 'Todo el Consejo',
      role: '5 Consejeros',
      phone: 'Todos',
      isGroup: true
    };
  }
  const u = users.find(user => user.id === Number(assigneeId));
  return u ? {
    name: u.name,
    role: u.role,
    phone: u.displayPhone || u.whatsapp,
    whatsapp: u.whatsapp,
    isGroup: false
  } : {
    name: 'Sin Asignar',
    role: 'Consejero',
    phone: 'Sin teléfono',
    isGroup: false
  };
}

export async function exportTasksToExcel(tasks, users, filterTitle = 'Todas') {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const filenameDate = now.toISOString().split('T')[0];
    const fileName = `Matriz_Control_Operativo_Bosques_Robledal_${filenameDate}.xlsx`;

    // Structured data array
    const wsData = [
      ['CONJUNTO RESIDENCIAL BOSQUES DE ROBLEDAL'],
      ['CONSEJO DE ADMINISTRACIÓN - GESTIÓN 2026'],
      ['MATRIZ GENERAL DE CONTROL Y SEGUIMIENTO OPERATIVO'],
      [`Fecha y hora de generación: ${dateFormatted} | Registros: ${tasks.length} compromisos`],
      [], // blank separator
      [
        'No.',
        'ESTADO',
        'TAREA / COMPROMISO',
        'DESCRIPCIÓN Y ALCANCE',
        'ÁREA / CATEGORÍA',
        'PRIORIDAD',
        'CONSEJERO RESPONSABLE',
        'CARGO',
        'TELÉFONO / WHATSAPP',
        'FECHA LÍMITE',
        'ESTADO CUMPLIMIENTO'
      ]
    ];

    tasks.forEach((task, index) => {
      const assignee = getAssigneeInfo(task.assigneeId, users);
      const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';

      let statusLabel = 'Por Iniciar';
      if (task.status === 'in-progress') statusLabel = 'En Proceso';
      else if (task.status === 'overdue' || isOverdue) statusLabel = 'Vencida / Urgente';
      else if (task.status === 'completed') statusLabel = 'Completada';

      const complianceText = isOverdue
        ? 'Incumplida / Con Retraso'
        : task.status === 'completed'
          ? 'Cumplida a satisfacción'
          : 'En plazo normal';

      wsData.push([
        index + 1,
        statusLabel,
        task.title || '',
        task.description || 'Sin notas adicionales',
        task.category || 'General',
        task.priority || 'Media',
        assignee.name,
        assignee.role,
        assignee.phone,
        task.dueDate || 'Sin fecha',
        complianceText
      ]);
    });

    // Build workbook
    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    worksheet['!cols'] = [
      { wch: 6 }, { wch: 20 }, { wch: 38 }, { wch: 45 }, { wch: 18 },
      { wch: 14 }, { wch: 26 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 26 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriz Control 2026');

    // 1. SAVE TO DISK VIA BACKEND (Directly into D:\Downloads)
    let serverResult = null;
    try {
      const res = await fetch('/api/prepare-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: wsData })
      });
      if (res.ok) {
        serverResult = await res.json();
      }
    } catch (e) {
      console.warn('Backend save unavailable:', e);
    }

    // 2. NATIVE WINDOWS SAVE AS PICKER (Bypasses Chrome's download manager UUID renaming)
    if ('showSaveFilePicker' in window) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Libro de Microsoft Excel (*.xlsx)',
            accept: {
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
            }
          }]
        });
        const writable = await handle.createWritable();
        const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        await writable.write(arrayBuffer);
        await writable.close();
        return { 
          success: true, 
          directSave: true, 
          filename: handle.name, 
          savedPath: serverResult?.savedPath || '' 
        };
      } catch (err) {
        if (err.name === 'AbortError') {
          // User cancelled the Save As prompt, but file is still in D:\Downloads
          return { 
            success: true, 
            cancelled: true, 
            savedPath: serverResult?.savedPath || '' 
          };
        }
      }
    }

    // 3. CLIENT-SIDE DOWNLOAD (100% works on Vercel / Production)
    try {
      const b64 = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });
      const a = document.createElement('a');
      a.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + b64;
      a.download = fileName;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) a.parentNode.removeChild(a);
      }, 1500);
    } catch (clientErr) {
      console.warn('Client-side download fallback error:', clientErr);
    }

    return { 
      success: true, 
      filename: fileName, 
      savedPath: serverResult?.savedPath || fileName 
    };
  } catch (error) {
    console.error('Error al generar Excel:', error);
    return { success: false, error: error.message };
  }
}

export async function openExcelFile(targetPath) {
  try {
    const res = await fetch('/api/open-excel?path=' + encodeURIComponent(targetPath || ''));
    return res.ok;
  } catch (err) {
    console.error('Error abriendo Excel:', err);
    return false;
  }
}

export async function openDownloadsFolder() {
  try {
    const res = await fetch('/api/open-folder');
    return res.ok;
  } catch (err) {
    console.error('Error abriendo carpeta:', err);
    return false;
  }
}

export function exportTasksToCSV(tasks, users) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const filenameDate = now.toISOString().split('T')[0];
    const fileName = `Matriz_Control_Operativo_Bosques_Robledal_${filenameDate}.csv`;

    const headers = [
      '#',
      'Estado',
      'Tarea / Compromiso',
      'Descripción / Alcance',
      'Área / Categoría',
      'Prioridad',
      'Consejero Responsable',
      'Cargo',
      'Teléfono / WhatsApp',
      'Fecha Límite',
      'Estado Cumplimiento'
    ];

    const rows = tasks.map((task, idx) => {
      const assignee = getAssigneeInfo(task.assigneeId, users);
      const isOverdue = task.dueDate && task.dueDate < today && task.status !== 'completed';
      const statusText = task.status === 'completed' ? 'Completado' : task.status === 'in-progress' ? 'En Proceso' : (task.status === 'overdue' || isOverdue) ? 'Vencido' : 'Pendiente';
      const complianceText = isOverdue ? 'Vencida / Incumplida' : task.status === 'completed' ? 'Cumplida' : 'En plazo';

      return [
        idx + 1,
        `"${statusText}"`,
        `"${(task.title || '').replace(/"/g, '""')}"`,
        `"${(task.description || '').replace(/"/g, '""')}"`,
        `"${task.category || 'General'}"`,
        `"${task.priority || 'Media'}"`,
        `"${assignee.name}"`,
        `"${assignee.role}"`,
        `"${assignee.phone}"`,
        `"${task.dueDate || ''}"`,
        `"${complianceText}"`
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 1500);

    return true;
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    return false;
  }
}
