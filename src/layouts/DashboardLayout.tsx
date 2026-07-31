import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TaskModal } from '../components/task/TaskModal';

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarCollapsed((v) => !v)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header
          onMobileMenuOpen={() => setMobileOpen(true)}
          onNewTask={() => setTaskModalOpen(true)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-8 w-full">
            <Outlet
              context={{
                openNewTaskModal: () => setTaskModalOpen(true),
                onRefresh: handleRefresh,
                isRefreshing,
              }}
            />
          </div>
        </main>
      </div>

      {/* Global New Task modal */}
      <TaskModal
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={() => setTaskModalOpen(false)}
      />
    </div>
  );
}
