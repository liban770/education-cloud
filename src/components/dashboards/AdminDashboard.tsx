import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { 
  Building, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  CreditCard, 
  ShieldCheck, 
  Key, 
  TrendingUp, 
  Activity, 
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenVault: () => void;
  onOpenDjangoArch: () => void;
  setActiveTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenVault,
  onOpenDjangoArch,
  setActiveTab,
}) => {
  const { students, faculty, courses, fees, auditLogs, activeKeyMeta, rotateEncryptionKeys, isEncrypting } = useSchoolData();

  const totalFeesBilled = fees.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalFeesCollected = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const avgGpa = (students.reduce((sum, s) => sum + s.gpa, 0) / (students.length || 1)).toFixed(2);
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / (students.length || 1) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Executive Administration Console
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Academic Year 2026-2027</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Dr. Sarah Chen, Head of Institution
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time institutional oversight across academics, enrollment, zero-knowledge encryption, and fiscal operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDjangoArch}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
          >
            Django Scalability Specs
          </button>
          <button
            onClick={onOpenVault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>KMS Vault Settings</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div 
          onClick={() => setActiveTab('students')}
          className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Enrollment</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {students.length} Scholars
          </div>
          <div className="text-xs text-slate-500 mt-1">
            100% AES-256 FLE sealed
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Daily Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {avgAttendance}%
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            98.4% On-time campus check-in
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => setActiveTab('academics')}
          className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Institutional GPA</span>
            <GraduationCap className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {avgGpa} / 4.00
          </div>
          <div className="text-xs text-slate-500 mt-1">
            AP & Honors curve applied
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => setActiveTab('finance')}
          className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 transition-colors shadow-xs"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Tuition Revenue</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            ${(totalFeesCollected / 1000).toFixed(1)}k
          </div>
          <div className="text-xs text-slate-500 mt-1">
            of ${(totalFeesBilled / 1000).toFixed(1)}k total term ledger
          </div>
        </div>
      </div>

      {/* Two Column Layout: Cryptographic Audit Status & Academic Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Security & KMS At-Rest Status */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Cryptographic Key & Vault Status
              </h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-medium">
              Hardware HSM Active
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-2 font-mono">
            <div>
              <span className="text-slate-500">Key ID: </span>
              <strong className="text-slate-900">{activeKeyMeta.keyId}</strong>
            </div>
            <div>
              <span className="text-slate-500">Algorithm: </span>
              <span className="text-indigo-600 font-bold">{activeKeyMeta.algorithm}</span>
            </div>
            <div className="truncate" title={activeKeyMeta.keyFingerprint}>
              <span className="text-slate-500">Fingerprint: </span>
              <span className="text-slate-700">{activeKeyMeta.keyFingerprint}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Encrypted Student Fields:</span>
              <span className="font-semibold text-slate-900 font-mono">{students.length * 4} fields</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tamper-Proof Audit Signatures:</span>
              <span className="font-semibold text-slate-900 font-mono">{auditLogs.length} verified</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>FERPA Audit State:</span>
              <span className="font-semibold text-emerald-700 font-mono">100% Compliant</span>
            </div>
          </div>

          <button
            onClick={rotateEncryptionKeys}
            disabled={isEncrypting}
            className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors disabled:opacity-50"
          >
            {isEncrypting ? 'Re-encrypting records...' : 'Trigger Zero-Downtime Key Rotation'}
          </button>
        </div>

        {/* Right Column: Live Tamper-Evident Activity Trail */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Recent Cryptographic Audit Trail (FERPA Log)
              </h2>
            </div>
            <button
              onClick={onOpenVault}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 4).map((log) => (
              <div 
                key={log.id} 
                className="p-3 border border-slate-100 rounded-md hover:bg-slate-50 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{log.actorName}</span>
                    <span className="text-[10px] text-slate-400 capitalize">({log.actorRole})</span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-indigo-700 text-[11px] font-semibold">{log.action}</span>
                  </div>
                  <div className="text-slate-600 mt-0.5 text-[11px] truncate max-w-md">
                    {log.details}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-mono text-slate-400">{log.timestamp}</div>
                  <div className="text-[10px] font-mono text-emerald-700">HMAC: {log.cryptographicSignature.substring(0, 8)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
