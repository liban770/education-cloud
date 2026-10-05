import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { UserRole } from '../../types';
import { ShieldCheck, Lock, UserCheck, Database, Key } from 'lucide-react';

interface TopBarProps {
  onOpenVault: () => void;
  onOpenDjangoArch: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenVault,
  onOpenDjangoArch,
  activeTab,
  setActiveTab,
}) => {
  const { currentUser, switchRole } = useAuth();
  const { activeKeyMeta, isEncrypting } = useSchoolData();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switchRole(e.target.value as UserRole);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-6">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2"
        >
          <span className="flex items-center justify-center w-7 h-7 bg-indigo-600 text-white rounded text-xs font-semibold tracking-wider">
            AE
          </span>
          <span>AetherEdu Cloud</span>
        </a>

        {/* Quiet metadata */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span>AES-GCM-256</span>
          <span aria-hidden="true">·</span>
          <span>{activeKeyMeta.keyId.substring(0, 16)}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-600 font-medium">HSM Sealed</span>
        </div>
      </div>

      {/* Zone 2: Clean primary navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`transition-colors text-left ${activeTab === 'dashboard' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`transition-colors text-left ${activeTab === 'students' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'}`}
        >
          Directory
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`transition-colors text-left ${activeTab === 'attendance' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'}`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`transition-colors text-left ${activeTab === 'academics' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'}`}
        >
          Grades
        </button>
        <button
          onClick={() => setActiveTab('finance')}
          className={`transition-colors text-left ${activeTab === 'finance' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-0.5' : 'hover:text-slate-900'}`}
        >
          Finance
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Role Persona Switcher + Security Vault Button) */}
      <div className="flex items-center gap-3">
        {/* Backend & Django Architecture Button */}
        <button
          onClick={onOpenDjangoArch}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors whitespace-nowrap"
          title="Inspect Django REST Framework & PostgreSQL Architecture"
        >
          <Database className="w-3.5 h-3.5 text-slate-600" />
          <span>Django & Scaling Blueprint</span>
        </button>

        {/* Security Vault Button */}
        <button
          onClick={onOpenVault}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors whitespace-nowrap"
        >
          <Lock className="w-3.5 h-3.5 text-indigo-600" />
          <span>Cryptographic Vault</span>
          {isEncrypting && (
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
          )}
        </button>

        {/* Interactive Persona / Role Switcher */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 capitalize">
              {currentUser.badge}
            </div>
          </div>

          <div className="relative">
            <select
              value={currentUser.role}
              onChange={handleRoleChange}
              aria-label="Switch Role Dashboard"
              className="text-xs font-medium bg-slate-900 text-white rounded px-2.5 py-1.5 cursor-pointer hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="admin">Role: Admin (Principal)</option>
              <option value="teacher">Role: Teacher (Faculty)</option>
              <option value="student">Role: Student (Scholar)</option>
              <option value="parent">Role: Parent (Guardian)</option>
              <option value="dpo">Role: DPO (Data Protection)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
