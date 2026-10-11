import { create } from 'zustand';

export const initialUsers = [
  { 
    id: 1, 
    name: 'Lizeth Pelaez', 
    role: 'Presidenta del Consejo', 
    email: 'lizeth.pelaez@bosquesrobledal.com', 
    whatsapp: '573193985086', 
    displayPhone: '319 398 5086',
    color: 'from-rose-500 to-pink-600',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  { 
    id: 2, 
    name: 'Juan Jadir Rojas', 
    role: 'Consejero de Administración', 
    email: 'juan.rojas@bosquesrobledal.com', 
    whatsapp: '573113597443', 
    displayPhone: '311 359 7443',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  { 
    id: 3, 
    name: 'Cesar Rivas', 
    role: 'Consejero de Administración', 
    email: 'cesar.rivas@bosquesrobledal.com', 
    whatsapp: '573242966995', 
    displayPhone: '324 296 6995',
    color: 'from-purple-600 to-violet-600',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  { 
    id: 4, 
    name: 'Alejandra Gutierrez', 
    role: 'Consejera de Administración', 
    email: 'alejandra.gutierrez@bosquesrobledal.com', 
    whatsapp: '573002976021', 
    displayPhone: '300 297 6021',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  { 
    id: 5, 
    name: 'Natali Sánchez Pareja', 
    role: 'Consejera de Administración', 
    email: 'natali.sanchez@bosquesrobledal.com', 
    whatsapp: '573148798974', 
    displayPhone: '314 879 8974',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  }
];

export const initialTasks = [
  {
    id: 1,
    title: 'Revisión Presupuesto y Cuotas 2026',
    description: 'Analizar la proyección financiera de gastos operativos, mantenimiento y fondo de imprevistos para presentar al consejo.',
    category: 'Finanzas',
    priority: 'Alta',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 1,
    status: 'pending',
    checkpoints: [
      { text: 'Consolidar gastos 2025', done: true },
      { text: 'Ajuste IPC y salarios conserjería', done: false },
      { text: 'Presentar borrador al Consejo', done: false }
    ],
    evidences: ['Borrador_Presupuesto_2026.pdf'],
    comments: [
      { id: 1, author: 'Juan Jadir Rojas', text: 'Tener en cuenta el incremento proyectado de vigilancia.', date: 'Ayer, 4:30 PM' }
    ]
  },
  {
    id: 2,
    title: 'Cotizaciones Poda y Mantenimiento de Zonas Verdes',
    description: 'Gestionar al menos 3 propuestas comerciales para el corte de césped, poda fitosanitaria de árboles y abono de jardines perimetrales.',
    category: 'Zonas Verdes',
    priority: 'Urgente',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 2,
    status: 'overdue',
    checkpoints: [
      { text: 'Visita técnica de proveedores', done: true },
      { text: 'Recepción de cotizaciones escritas', done: false },
      { text: 'Cuadro comparativo', done: false }
    ],
    evidences: [],
    comments: [
      { id: 1, author: 'Lizeth Pelaez', text: 'Urgente definir proveedor antes del fin de semana por lluvias.', date: 'Hace 2 días' }
    ]
  },
  {
    id: 3,
    title: 'Mantenimiento Preventivo de Bombas de Agua',
    description: 'Supervisar el mantenimiento trimestral del sistema hidroneumático, limpieza de filtros y verificación de válvulas de retención.',
    category: 'Mantenimiento',
    priority: 'Alta',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 3,
    status: 'in-progress',
    checkpoints: [
      { text: 'Verificación de niveles de presión', done: true },
      { text: 'Cambio de sellos mecánicos', done: true },
      { text: 'Prueba de alternancia de motores', done: false }
    ],
    evidences: ['Informe_Tecnico_HidroBombas.pdf'],
    comments: [
      { id: 1, author: 'Cesar Rivas', text: 'El técnico viene este jueves a las 9:00 AM para la prueba final.', date: 'Hoy, 10:15 AM' }
    ]
  },
  {
    id: 4,
    title: 'Actualización Protocolo de Seguridad y Portería',
    description: 'Revisión y actualización del manual de control de acceso vehicular, registro de mensajería y bitácora de visitantes en portería principal.',
    category: 'Seguridad',
    priority: 'Media',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 4,
    status: 'in-progress',
    checkpoints: [
      { text: 'Reunión con supervisor de empresa de vigilancia', done: true },
      { text: 'Ajuste de formato de planilla digital', done: false }
    ],
    evidences: [],
    comments: []
  },
  {
    id: 5,
    title: 'Demarcación y Señalización de Parqueaderos',
    description: 'Pintura de líneas de parqueaderos de residentes y visitantes, señales de velocidad máxima (10 km/h) y zonas peatonales.',
    category: 'Mantenimiento',
    priority: 'Media',
    dueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 2,
    status: 'completed',
    checkpoints: [
      { text: 'Compra de pintura de tráfico pesado', done: true },
      { text: 'Jornada de demarcación', done: true },
      { text: 'Recepción a satisfacción por el Consejo', done: true }
    ],
    evidences: ['Acta_Entrega_Parqueaderos.pdf', 'Foto_Antes_Despues.jpg'],
    comments: [
      { id: 1, author: 'Alejandra Gutierrez', text: 'Excelente trabajo, quedó muy bien señalizado.', date: 'Hace 3 días' }
    ]
  },
  {
    id: 6,
    title: 'Campaña y Circular de Convivencia con Mascotas',
    description: 'Elaborar circular pedagógica recordando el uso obligatorio de correa, recolección de heces y normas de la Ley 675 en zonas comunes.',
    category: 'Convivencia',
    priority: 'Baja',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 4,
    status: 'pending',
    checkpoints: [
      { text: 'Redacción de texto informativo', done: false },
      { text: 'Diseño para envío por correo y WhatsApp comunitario', done: false }
    ],
    evidences: [],
    comments: []
  },
  {
    id: 7,
    title: 'Auditoría de Contratos de Proveedores y Póliza Común 2026',
    description: 'Revisión exhaustiva de contratos de vigilancia, mantenimiento de ascensores/bombas y vigencia de la póliza de áreas comunes.',
    category: 'Legal',
    priority: 'Alta',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeId: 5,
    status: 'in-progress',
    checkpoints: [
      { text: 'Solicitar copia de póliza todo riesgo vigente', done: true },
      { text: 'Matriz comparativa de cláusulas contractuales', done: false },
      { text: 'Presentar informe de recomendaciones al Consejo', done: false }
    ],
    evidences: ['Poliza_Zonas_Comunes_Resumen.pdf'],
    comments: [
      { id: 1, author: 'Natali Sánchez Pareja', text: 'Inicié la recopilación de los contratos con la administración.', date: 'Hoy, 2:15 PM' }
    ]
  }
];

const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    if (key === 'br_consejeros' && Array.isArray(parsed)) {
      const existingNames = new Set(parsed.map(u => u.name.toLowerCase()));
      const missing = fallback.filter(u => !existingNames.has(u.name.toLowerCase()));
      if (missing.length > 0) {
        const merged = [...parsed, ...missing];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged;
      }
    }
    if (key === 'br_tasks' && Array.isArray(parsed) && parsed.length === 0) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error', e);
  }
};

export const generateReminders = (dueDateStr) => {
  if (!dueDateStr) return [];
  const targetTime = dueDateStr.includes('T') 
    ? new Date(dueDateStr).getTime() 
    : new Date(`${dueDateStr}T18:00:00`).getTime();

  return [
    {
      id: '24h',
      hoursBefore: 24,
      label: '24 horas antes',
      scheduledTime: new Date(targetTime - 24 * 60 * 60 * 1000).toISOString(),
      sent: false,
      sentAt: null
    },
    {
      id: '12h',
      hoursBefore: 12,
      label: '12 horas antes',
      scheduledTime: new Date(targetTime - 12 * 60 * 60 * 1000).toISOString(),
      sent: false,
      sentAt: null
    },
    {
      id: '6h',
      hoursBefore: 6,
      label: '6 horas antes',
      scheduledTime: new Date(targetTime - 6 * 60 * 60 * 1000).toISOString(),
      sent: false,
      sentAt: null
    }
  ];
};

export const buildWhatsAppMessage = ({ task, assignee, type = 'assign', appUrl }) => {
  const formattedDueDate = task.dueDate 
    ? new Date(`${task.dueDate.split('T')[0]}T00:00:00`).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) 
    : 'Por definir';

  const cleanAppUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

  if (type.startsWith('reminder')) {
    const hours = type === 'reminder_24h' ? '24 HORAS' : type === 'reminder_12h' ? '12 HORAS' : '6 HORAS';
    return (
      `⏰ *RECORDATORIO DE VENCIMIENTO (${hours})*\n` +
      `🏛️ *Consejo de Administración - Bosques de Robledal (Gestión 2026)*\n\n` +
      `Hola *${assignee?.name || 'Consejero'}*,\n` +
      `Te recordamos que la siguiente tarea asignada tiene fecha límite próxima:\n\n` +
      `📌 *Tarea:* ${task.title}\n` +
      `📅 *Fecha Límite:* ${formattedDueDate}\n` +
      `⚡ *Prioridad:* ${task.priority}\n` +
      `📂 *Categoría:* ${task.category}\n\n` +
      `🔗 *Accede al aplicativo para reportar avances o evidencias:*\n` +
      `${cleanAppUrl}\n\n` +
      `_Mensaje automático del Sistema de Gestión 2026._`
    );
  }

  return (
    `🏛️ *Consejo de Administración - Bosques de Robledal (Gestión 2026)*\n\n` +
    `Hola *${assignee?.name || 'Consejero'}*,\n` +
    `Se te ha asignado la siguiente tarea en el Consejo:\n\n` +
    `📌 *Tarea:* ${task.title}\n` +
    `📂 *Categoría:* ${task.category}\n` +
    `⚡ *Prioridad:* ${task.priority}\n` +
    `📅 *Fecha Límite:* ${formattedDueDate}\n\n` +
    `📝 *Alcance:* ${task.description || 'Sin notas adicionales'}\n\n` +
    `🔗 *Ingresa al aplicativo para registrar evidencias y comentarios:*\n` +
    `${cleanAppUrl}\n\n` +
    `_🏛️ Consejo de Administración • Bosques de Robledal 2026_`
  );
};

export const dispatchWhatsAppSilently = async ({ phone, text, apiUrl, apiToken, openWindow = true }) => {
  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiToken ? { 'Authorization': `Bearer ${apiToken}` } : {})
        },
        body: JSON.stringify({
          phone: phone.replace(/[^0-9]/g, ''),
          message: text,
          timestamp: new Date().toISOString()
        })
      });
      if (res.ok) {
        return { success: true, method: 'webhook_sent' };
      }
    } catch (error) {
      console.warn('[WhatsApp Dispatch Error]', error);
    }
  }

  // If no external API configured or if webhook is not available, open WhatsApp Web so the message is ACTUALLY delivered!
  if (openWindow && typeof window !== 'undefined') {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const waUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    return { success: true, method: 'whatsapp_web_opened' };
  }

  return { success: true, method: 'local_queued' };
};

const defaultWaConfig = {
  apiUrl: '',
  apiToken: '',
  appUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173',
  autoSend: true,
  remindersEnabled: true
};

export const useStore = create((set, get) => ({
  users: loadFromStorage('br_consejeros', initialUsers),
  tasks: loadFromStorage('br_tasks', initialTasks),
  whatsappConfig: loadFromStorage('br_wa_config', defaultWaConfig),
  selectedAssigneeId: null, // filter by consejero
  searchQuery: '',
  selectedCategory: 'all',
  selectedPriority: 'all',
  activeView: 'board', // 'board' | 'directory' | 'metrics'
  
  // UI Actions
  setActiveView: (view) => set({ activeView: view }),
  setSelectedAssigneeId: (id) => set({ selectedAssigneeId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  
  // WhatsApp Settings Actions
  updateWhatsAppConfig: (newConfig) => {
    set((state) => {
      const updated = { ...state.whatsappConfig, ...newConfig };
      saveToStorage('br_wa_config', updated);
      return { whatsappConfig: updated };
    });
  },

  // Tasks Actions
  addTask: (taskData) => {
    const reminders = taskData.reminders || generateReminders(taskData.dueDate);
    const newTask = {
      ...taskData,
      id: Date.now(),
      status: taskData.status || 'pending',
      checkpoints: taskData.checkpoints || [],
      evidences: taskData.evidences || [],
      comments: taskData.comments || [],
      reminders,
      notificationsLog: [
        {
          id: Date.now(),
          type: 'assigned',
          date: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          note: 'Tarea asignada y recordatorios (24h, 12h, 6h) programados'
        }
      ]
    };

    set((state) => {
      const updated = [newTask, ...state.tasks];
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });

    // Auto-send WhatsApp in background without opening window if enabled
    const state = get();
    if (state.whatsappConfig.autoSend) {
      if (newTask.assigneeId === 'all') {
        state.users.forEach((u, idx) => {
          if (u.whatsapp) {
            const msg = buildWhatsAppMessage({
              task: newTask,
              assignee: u,
              type: 'assign',
              appUrl: state.whatsappConfig.appUrl
            });
            dispatchWhatsAppSilently({
              phone: u.whatsapp,
              text: msg,
              apiUrl: state.whatsappConfig.apiUrl,
              apiToken: state.whatsappConfig.apiToken,
              openWindow: idx === 0
            });
          }
        });
      } else {
        const assignee = state.users.find(u => u.id === Number(newTask.assigneeId));
        if (assignee?.whatsapp) {
          const msg = buildWhatsAppMessage({
            task: newTask,
            assignee,
            type: 'assign',
            appUrl: state.whatsappConfig.appUrl
          });
          dispatchWhatsAppSilently({
            phone: assignee.whatsapp,
            text: msg,
            apiUrl: state.whatsappConfig.apiUrl,
            apiToken: state.whatsappConfig.apiToken,
            openWindow: true
          });
        }
      }
    }

    return newTask;
  },

  updateTaskStatus: (taskId, newStatus) => {
    set((state) => {
      const updated = state.tasks.map((t) => 
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  updateTask: (taskId, updatedFields) => {
    set((state) => {
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newDueDate = updatedFields.dueDate || t.dueDate;
        const reminders = updatedFields.dueDate && updatedFields.dueDate !== t.dueDate
          ? generateReminders(newDueDate)
          : (t.reminders || generateReminders(t.dueDate));

        return { ...t, ...updatedFields, reminders };
      });
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const updated = state.tasks.filter((t) => String(t.id) !== String(taskId));
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  sendTaskNotification: async (taskId, type = 'assign') => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const targets = task.assigneeId === 'all' 
      ? state.users 
      : state.users.filter(u => u.id === Number(task.assigneeId));

    for (const assignee of targets) {
      if (!assignee.whatsapp) continue;
      const msg = buildWhatsAppMessage({
        task,
        assignee,
        type,
        appUrl: state.whatsappConfig.appUrl
      });
      await dispatchWhatsAppSilently({
        phone: assignee.whatsapp,
        text: msg,
        apiUrl: state.whatsappConfig.apiUrl,
        apiToken: state.whatsappConfig.apiToken
      });
    }

    const newLog = {
      id: Date.now(),
      type,
      date: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      note: type.startsWith('reminder') 
        ? `Recordatorio ${type.replace('reminder_', '')} enviado a WhatsApp (${task.assigneeId === 'all' ? 'A todos los consejeros' : 'Al responsable'})` 
        : `Notificación enviada a WhatsApp (${task.assigneeId === 'all' ? 'A todos los consejeros' : 'Al responsable'})`
    };

    set((s) => {
      const updated = s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const updatedReminders = (t.reminders || []).map(r => {
          if (type.includes(r.id)) {
            return { ...r, sent: true, sentAt: new Date().toISOString() };
          }
          return r;
        });
        return {
          ...t,
          reminders: updatedReminders,
          notificationsLog: [newLog, ...(t.notificationsLog || [])]
        };
      });
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  checkDueReminders: () => {
    const state = get();
    if (!state.whatsappConfig.remindersEnabled) return;
    const now = Date.now();

    state.tasks.forEach((task) => {
      if (task.status === 'completed') return;
      (task.reminders || []).forEach((rem) => {
        if (!rem.sent && rem.scheduledTime) {
          const schedTime = new Date(rem.scheduledTime).getTime();
          // If past or within reminder window
          if (schedTime <= now) {
            get().sendTaskNotification(task.id, `reminder_${rem.id}`);
          }
        }
      });
    });
  },

  addComment: (taskId, text, author) => {
    const newComment = {
      id: Date.now(),
      author: author || 'Consejo de Administración',
      text,
      date: 'Justo ahora'
    };
    set((state) => {
      const updated = state.tasks.map((t) => 
        t.id === taskId 
          ? { ...t, comments: [...(t.comments || []), newComment] }
          : t
      );
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  toggleCheckpoint: (taskId, index) => {
    set((state) => {
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newCheckpoints = [...(t.checkpoints || [])];
        if (newCheckpoints[index]) {
          newCheckpoints[index] = { 
            ...newCheckpoints[index], 
            done: !newCheckpoints[index].done 
          };
        }
        return { ...t, checkpoints: newCheckpoints };
      });
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
  },

  // Users / Consejeros Actions
  addUser: (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      whatsapp: userData.whatsapp.replace(/[^0-9]/g, ''),
      displayPhone: userData.displayPhone || userData.whatsapp,
      color: userData.color || 'from-emerald-600 to-teal-600',
      badgeColor: userData.badgeColor || 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
    set((state) => {
      const updated = [...state.users, newUser];
      saveToStorage('br_consejeros', updated);
      return { users: updated };
    });
    return newUser;
  },

  // Reset to initial demo data
  resetDefaults: () => {
    localStorage.removeItem('br_tasks');
    localStorage.removeItem('br_consejeros');
    localStorage.removeItem('br_wa_config');
    set({
      users: initialUsers,
      tasks: initialTasks,
      whatsappConfig: defaultWaConfig,
      selectedAssigneeId: null,
      searchQuery: '',
      selectedCategory: 'all',
      selectedPriority: 'all'
    });
  }
}));

