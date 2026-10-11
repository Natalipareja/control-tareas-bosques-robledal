import React, { useState, useEffect } from 'react';
import { useStore } from './store/store';
import Navbar from './components/Navbar';
import ConsejerosBar from './components/ConsejerosBar';
import TaskManager from './components/TaskManager';
import ConsejerosDirectory from './components/ConsejerosDirectory';
import MetricsDashboard from './components/MetricsDashboard';
import TaskModal from './components/TaskModal';
import TaskDetailModal from './components/TaskDetailModal';
import NewUserModal from './components/NewUserModal';
import WhatsAppSettingsModal from './components/WhatsAppSettingsModal';

function App() {
  const { activeView, setActiveView, setSelectedAssigneeId, checkDueReminders } = useStore();



  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskModalInitialData, setTaskModalInitialData] = useState(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState(null);

  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isWhatsAppSettingsOpen, setIsWhatsAppSettingsOpen] = useState(false);

  // Handlers
  const handleOpenNewTask = (initialOverrides = null) => {
    setTaskModalInitialData(initialOverrides);
    setIsTaskModalOpen(true);
  };

  const handleOpenDetail = (task) => {
    setSelectedTaskForDetail(task);
    setIsDetailModalOpen(true);
  };

  const handleEditTask = (task) => {
    setTaskModalInitialData(task);
    setIsTaskModalOpen(true);
  };

  const handleSelectConsejeroForBoard = (userId) => {
    setSelectedAssigneeId(userId);
    setActiveView('board');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        onOpenNewTask={() => handleOpenNewTask()}
        onOpenNewUser={() => setIsNewUserModalOpen(true)}
        onOpenWhatsAppConfig={() => setIsWhatsAppSettingsOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {activeView === 'board' && (
          <>
            {/* Prominent Consejeros Top Bar with Quick Filter */}
            <ConsejerosBar 
              onOpenNewUser={() => setIsNewUserModalOpen(true)}
            />

            {/* Task Manager (Kanban, Day, Week, Month + Filter by Consejero + Permanent Matrix) */}
            <TaskManager
              onOpenNewTask={handleOpenNewTask}
              onOpenDetail={handleOpenDetail}
              onEdit={handleEditTask}
            />
          </>
        )}

        {activeView === 'directory' && (
          <ConsejerosDirectory
            onOpenNewUser={() => setIsNewUserModalOpen(true)}
            onSelectConsejeroForBoard={handleSelectConsejeroForBoard}
          />
        )}

        {activeView === 'metrics' && (
          <MetricsDashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 px-4 text-center text-xs text-slate-500 font-medium">
        <p>
          🏛️ <strong>Bosques de Robledal</strong> • Sistema de Control y Asignación de Tareas del Consejo de Administración (Gestión 2026)
        </p>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskModalInitialData(null);
        }}
        initialData={taskModalInitialData}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTaskForDetail(null);
        }}
        task={selectedTaskForDetail}
        onEdit={handleEditTask}
      />

      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
      />
    </div>
  );
}

export default App;
