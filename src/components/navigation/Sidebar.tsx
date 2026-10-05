import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  GraduationCap, 
  CreditCard, 
  ShieldCheck, 
  BellRing, 
  Database,
  Building,
  Lock,
  KeyRound
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVault: () => void;
  onOpenDjangoArch: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVault,
  onOpenDjangoArch,
}) => {
  const { currentUser } = useAuth();
  const { students, attendance, fees, activeKeyMeta } = useSchoolData();

  const pendingFeesCount = fees.filter(f => f.status === 'pending' || f.status === 'partial').length;
  const todayAttendanceRate = '98.4%';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Role Dashboard',
      icon: LayoutDashboard,
      badge: currentUser.role.toUpperCase(),
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: Users,
      badge: `${students.length} Total`,
    },
    {
      id: 'attendance',
      label: 'Attendance Register',
      icon: CalendarCheck,
      badge: todayAttendanceRate,
    },
    {
      id: 'academics',
      label: 'Academic Gradebook',
      icon: GraduationCap,
    },
    {
      id: 'finance',
      label: 'Tuition & Billing',
      icon: CreditCard,
      badge: pendingFeesCount > 0 ? `${pendingFeesCount} Unpaid` : undefined,
    },
    {
      id: 'announcements',
      label: 'Campus Bulletins',
      icon: BellRing,
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
      {/* Institution Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white leading-tight">
              Aether Academy
            </h2>
            <div className="text-[11px] text-slate-400">
              Campus ID: AET-CLOUD-880
            </div>
          </div>
        </div>

        {/* Current Active Persona Card */}
        <div className="mt-4 p-3 bg-slate-800/70 rounded border border-slate-700/60">
          <div className="text-[11px] text-slate-400">
            Active User Persona
          </div>
          <div className="text-xs font-medium text-white truncate mt-0.5">
            {currentUser.name}
          </div>
          <div className="text-[11px] text-indigo-400 font-medium">
            {currentUser.roleTitle}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Core ERP Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono tabular-nums ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-4 px-3 pb-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          Security & Scale Tools
        </div>

        <button
          onClick={onOpenVault}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic Vault</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400">
            Active
          </span>
        </button>

        <button
          onClick={onOpenDjangoArch}
          className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-sky-400" />
            <span>Django / DRF Specs</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            DRF v3.15
          </span>
        </button>
      </div>

      {/* Security Status Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1">
          <Lock className="w-3.5 h-3.5 text-indigo-400" />
          <span>Encrypted Storage</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Field-Level AES-GCM 256 active. FERPA/GDPR audit ledger enabled.
        </p>
        <div className="mt-2 text-[10px] text-slate-500 font-mono truncate">
          Key: {activeKeyMeta.keyId}
        </div>
      </div>
    </aside>
  );
};
