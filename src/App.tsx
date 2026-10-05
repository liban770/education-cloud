/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SchoolDataProvider, useSchoolData } from './context/SchoolDataContext';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { AdminDashboard } from './components/dashboards/AdminDashboard';
import { TeacherDashboard } from './components/dashboards/TeacherDashboard';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { ParentDashboard } from './components/dashboards/ParentDashboard';
import { DpoDashboard } from './components/dashboards/DpoDashboard';
import { StudentDirectory } from './components/students/StudentDirectory';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { GradebookView } from './components/academics/GradebookView';
import { FeeManagement } from './components/finance/FeeManagement';
import { AnnouncementsHub } from './components/communication/AnnouncementsHub';
import { SecurityVaultModal } from './components/security/SecurityVaultModal';
import { DjangoArchitectureModal } from './components/security/DjangoArchitectureModal';
import { CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const { toastMessage } = useSchoolData();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isDjangoArchOpen, setIsDjangoArchOpen] = useState<boolean>(false);

  // Render role-specific dashboard
  const renderDashboardByRole = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <AdminDashboard
            onOpenVault={() => setIsVaultOpen(true)}
            onOpenDjangoArch={() => setIsDjangoArchOpen(true)}
            setActiveTab={setActiveTab}
          />
        );
      case 'teacher':
        return <TeacherDashboard setActiveTab={setActiveTab} />;
      case 'student':
        return <StudentDashboard />;
      case 'parent':
        return <ParentDashboard setActiveTab={setActiveTab} />;
      case 'dpo':
        return (
          <DpoDashboard
            onOpenVault={() => setIsVaultOpen(true)}
            onOpenDjangoArch={() => setIsDjangoArchOpen(true)}
          />
        );
      default:
        return (
          <AdminDashboard
            onOpenVault={() => setIsVaultOpen(true)}
            onOpenDjangoArch={() => setIsDjangoArchOpen(true)}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenDjangoArch={() => setIsDjangoArchOpen(true)}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenVault={() => setIsVaultOpen(true)}
          onOpenDjangoArch={() => setIsDjangoArchOpen(true)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl">
          {activeTab === 'dashboard' && renderDashboardByRole()}
          {activeTab === 'students' && <StudentDirectory />}
          {activeTab === 'attendance' && <AttendanceTracker />}
          {activeTab === 'academics' && <GradebookView />}
          {activeTab === 'finance' && <FeeManagement />}
          {activeTab === 'announcements' && <AnnouncementsHub />}
        </main>
      </div>

      {/* Security Modals */}
      <SecurityVaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
      />

      <DjangoArchitectureModal
        isOpen={isDjangoArchOpen}
        onClose={() => setIsDjangoArchOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SchoolDataProvider>
        <AppContent />
      </SchoolDataProvider>
    </AuthProvider>
  );
}
