import { create } from 'zustand';
import { 
  db, 
  saveTaskToCloud, 
  deleteTaskFromCloud, 
  saveUserToCloud, 
  bulkUploadToCloud 
} from '../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';

export const initialUsers = [
  { 
    id: 1, 
    name: 'Lizeth Pelaez', 
    role: 'Consejera de Administración', 
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
      // Normalize all roles to Consejero/a de Administración (No Presidenta)
      const normalized = parsed.map(u => ({
        ...u,
        role: (u.name.toLowerCase().includes('lizeth') || u.name.toLowerCase().includes('alejandra') || u.name.toLowerCase().includes('natali'))
          ? 'Consejera de Administración'
          : 'Consejero de Administración'
      }));
      const existingNames = new Set(normalized.map(u => u.name.toLowerCase()));
      const missing = fallback.filter(u => !existingNames.has(u.name.toLowerCase()));
      const merged = missing.length > 0 ? [...normalized, ...missing] : normalized;
      localStorage.setItem(key, JSON.stringify(merged));
      return merged;
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


export const buildWhatsAppMessage = ({ task, assignee, appUrl }) => {
  const formattedDueDate = task.dueDate 
    ? new Date(`${task.dueDate.split('T')[0]}T00:00:00`).toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) 
    : 'Por definir';

  const cleanAppUrl = appUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

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

  // If no external API configured or if webhook is not available, open WhatsApp Web
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
  autoSend: true
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
  
  // Tasks & Users batch setter actions
  setTasks: (tasks) => {
    saveToStorage('br_tasks', tasks);
    set({ tasks });
    if (db) bulkUploadToCloud(tasks, get().users);
  },

  setUsers: (users) => {
    saveToStorage('br_consejeros', users);
    set({ users });
    if (db) bulkUploadToCloud(get().tasks, users);
  },

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
    const newTask = {
      ...taskData,
      id: Date.now(),
      status: taskData.status || 'pending',
      checkpoints: taskData.checkpoints || [],
      evidences: taskData.evidences || [],
      comments: taskData.comments || [],
      notificationsLog: [
        {
          id: Date.now(),
          type: 'assigned',
          date: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
          note: 'Tarea asignada en el sistema'
        }
      ]
    };

    set((state) => {
      const updated = [newTask, ...state.tasks];
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });

    // Mirror to Firebase Cloud if connected
    saveTaskToCloud(newTask);

    // Auto-send WhatsApp ONLY if specific user (NOT for "Todos" / collective tasks)
    const state = get();
    if (state.whatsappConfig.autoSend && newTask.assigneeId !== 'all') {
      const assignee = state.users.find(u => u.id === Number(newTask.assigneeId));
      if (assignee?.whatsapp) {
        const msg = buildWhatsAppMessage({
          task: newTask,
          assignee,
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

    return newTask;
  },

  updateTaskStatus: (taskId, newStatus) => {
    set((state) => {
      let targetTask = null;
      const updated = state.tasks.map((t) => {
        if (t.id === taskId) {
          targetTask = { ...t, status: newStatus };
          return targetTask;
        }
        return t;
      });
      saveToStorage('br_tasks', updated);
      if (targetTask) saveTaskToCloud(targetTask);
      return { tasks: updated };
    });
  },

  updateTask: (taskId, updatedFields) => {
    set((state) => {
      let targetTask = null;
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        targetTask = { ...t, ...updatedFields };
        return targetTask;
      });
      saveToStorage('br_tasks', updated);
      if (targetTask) saveTaskToCloud(targetTask);
      return { tasks: updated };
    });
  },

  deleteTask: (taskId) => {
    set((state) => {
      const updated = state.tasks.filter((t) => String(t.id) !== String(taskId));
      saveToStorage('br_tasks', updated);
      return { tasks: updated };
    });
    deleteTaskFromCloud(taskId);
  },

  sendTaskNotification: async (taskId) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Do NOT send WhatsApp if assigned to Todos
    if (task.assigneeId === 'all') {
      return;
    }

    const assignee = state.users.find(u => u.id === Number(task.assigneeId));
    if (!assignee || !assignee.whatsapp) return;

    const msg = buildWhatsAppMessage({
      task,
      assignee,
      appUrl: state.whatsappConfig.appUrl
    });
    await dispatchWhatsAppSilently({
      phone: assignee.whatsapp,
      text: msg,
      apiUrl: state.whatsappConfig.apiUrl,
      apiToken: state.whatsappConfig.apiToken
    });

    const newLog = {
      id: Date.now(),
      type: 'assigned',
      date: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      note: `Notificación enviada a WhatsApp a ${assignee.name}`
    };

    set((s) => {
      let savedTask = null;
      const updated = s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        savedTask = {
          ...t,
          notificationsLog: [newLog, ...(t.notificationsLog || [])]
        };
        return savedTask;
      });
      saveToStorage('br_tasks', updated);
      if (savedTask) saveTaskToCloud(savedTask);
      return { tasks: updated };
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
      let targetTask = null;
      const updated = state.tasks.map((t) => {
        if (t.id === taskId) {
          targetTask = { ...t, comments: [...(t.comments || []), newComment] };
          return targetTask;
        }
        return t;
      });
      saveToStorage('br_tasks', updated);
      if (targetTask) saveTaskToCloud(targetTask);
      return { tasks: updated };
    });
  },

  toggleCheckpoint: (taskId, index) => {
    set((state) => {
      let targetTask = null;
      const updated = state.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const newCheckpoints = [...(t.checkpoints || [])];
        if (newCheckpoints[index]) {
          newCheckpoints[index] = { 
            ...newCheckpoints[index], 
            done: !newCheckpoints[index].done 
          };
        }
        targetTask = { ...t, checkpoints: newCheckpoints };
        return targetTask;
      });
      saveToStorage('br_tasks', updated);
      if (targetTask) saveTaskToCloud(targetTask);
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
    saveUserToCloud(newUser);
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

export const normalizeUserRole = (u) => {
  if (!u) return u;
  const name = (u.name || '').toLowerCase();
  const role = (name.includes('lizeth') || name.includes('alejandra') || name.includes('natali'))
    ? 'Consejera de Administración'
    : 'Consejero de Administración';
  return { ...u, role };
};

// Setup realtime listener for Firebase Firestore if connected
if (db) {
  try {
    // Tasks subscription
    onSnapshot(collection(db, 'tasks'), (snapshot) => {
      if (snapshot.empty) {
        // If Firestore collection is empty, automatically seed with local tasks
        const currentTasks = useStore.getState().tasks;
        const currentUsers = useStore.getState().users.map(normalizeUserRole);
        if (currentTasks.length > 0) {
          bulkUploadToCloud(currentTasks, currentUsers).catch(console.warn);
        }
      } else {
        const cloudTasks = snapshot.docs.map(doc => doc.data());
        cloudTasks.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        saveToStorage('br_tasks', cloudTasks);
        useStore.setState({ tasks: cloudTasks });
      }
    }, (err) => {
      console.warn('Firebase realtime sync (tasks) note:', err.message);
    });

    // Consejeros subscription with forced role normalization
    onSnapshot(collection(db, 'consejeros'), (snapshot) => {
      if (!snapshot.empty) {
        const cloudUsers = snapshot.docs.map(doc => {
          const data = doc.data();
          const normalized = normalizeUserRole(data);
          // If Firestore still had "Presidenta", overwrite in Firestore with correct Consejera role
          if (data.role !== normalized.role) {
            saveUserToCloud(normalized);
          }
          return normalized;
        });
        cloudUsers.sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
        saveToStorage('br_consejeros', cloudUsers);
        useStore.setState({ users: cloudUsers });
      }
    }, (err) => {
      console.warn('Firebase realtime sync (consejeros) note:', err.message);
    });
  } catch (err) {
    console.warn('Firebase initialization listener error:', err);
  }
}

// Immediate migration check to purge "Presidenta" from localStorage and Firestore
try {
  const existingUsers = useStore.getState().users.map(normalizeUserRole);
  useStore.setState({ users: existingUsers });
  saveToStorage('br_consejeros', existingUsers);
  if (db) {
    existingUsers.forEach(u => saveUserToCloud(u));
  }
} catch (e) {
  console.warn('User normalization check:', e);
}



