import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  CreditCard, 
  CalendarCheck, 
  HeartPulse, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Receipt, 
  Send,
  Phone
} from 'lucide-react';

interface ParentDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ setActiveTab }) => {
  const { students, fees, attendance, grades, decryptStudentPII, encryptStudentPII, payFeeInvoice, showToast } = useSchoolData();
  const { selectedChildId, setSelectedChildId } = useAuth();

  // Guardians David & Elena Lin have Maya (stud_101) and Leo (stud_105)
  const myChildren = students.filter(s => s.id === 'stud_101' || s.id === 'stud_105');
  const activeChild = myChildren.find(c => c.id === selectedChildId) || myChildren[0] || students[0];

  const childFees = fees.filter(f => f.studentId === activeChild.id);
  const childGrades = grades.filter(g => g.studentId === activeChild.id);
  const childAttendance = attendance.filter(a => a.studentId === activeChild.id);

  // Excuse Note Form State
  const [excuseDate, setExcuseDate] = useState(new Date().toISOString().split('T')[0]);
  const [excuseReason, setExcuseReason] = useState('');
  const [isExcuseSubmitted, setIsExcuseSubmitted] = useState(false);

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseReason) return;
    setIsExcuseSubmitted(true);
    showToast(`Absence excuse submitted to Campus Attendance Office for ${activeChild.firstName}.`);
    setTimeout(() => {
      setIsExcuseSubmitted(false);
      setExcuseReason('');
    }, 4000);
  };

  const handleToggleDecrypt = async () => {
    if (activeChild.isDecrypted) {
      encryptStudentPII(activeChild.id);
    } else {
      await decryptStudentPII(activeChild.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Multi-Child Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Family & Guardian Portal
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Household: David & Elena Lin</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Guardian Dashboard for {activeChild.firstName} {activeChild.lastName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grade {activeChild.grade} · Section {activeChild.section} · Admission ID: {activeChild.admissionNo}
          </p>
        </div>

        {/* Multi-Child Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <span className="text-xs font-semibold text-slate-600 px-2">Select Child:</span>
          {myChildren.map(child => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                child.id === activeChild.id
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {child.firstName} (Grade {child.grade})
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Academic Attendance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-2 tabular-nums">
            {activeChild.attendanceRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Checked in today at 08:32 AM
          </div>
        </div>

        {/* GPA Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Current Cumulative GPA</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {activeChild.gpa.toFixed(2)} / 4.00
          </div>
          <div className="text-xs text-indigo-700 font-medium mt-1">
            Honors Scholar Standing
          </div>
        </div>

        {/* Tuition Status Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Tuition & Fees</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {childFees.some(f => f.balance > 0) ? `$${childFees.reduce((s, f) => s + f.balance, 0)} Due` : 'Settled ($0.00)'}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Fall 2026 Term Fully Paid
          </div>
        </div>
      </div>

      {/* Two Column Grid: Encrypted Health Record & Absence Excuse Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Encrypted Health & Emergency Record */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-500" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Confidential Health & Allergy Profile
              </h2>
            </div>

            <button
              onClick={handleToggleDecrypt}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              {activeChild.isDecrypted ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Lock Plaintext</span>
                </>
              ) : (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Decrypt Health Record</span>
                </>
              )}
            </button>
          </div>

          {activeChild.isDecrypted ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-2">
              <div className="font-semibold text-emerald-950">
                Medical & Clinical Notes for {activeChild.firstName}:
              </div>
              <p className="text-emerald-900 leading-relaxed font-sans">
                {activeChild.decryptedPII?.medicalNotes}
              </p>
              <div className="border-t border-emerald-200 pt-2 text-[11px] text-emerald-800">
                Primary Emergency Phone: <span className="font-mono font-bold">{activeChild.decryptedPII?.emergencyContact.phone}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2 font-mono">
              <div className="flex items-center gap-2 text-slate-600">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">AES-256 Protected Medical Vault</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                Encrypted at rest with hardware key. Click "Decrypt Health Record" above to view allergy management details.
              </p>
            </div>
          )}
        </div>

        {/* Submit Leave / Doctor's Absence Excuse */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Submit Absence Note / Early Dismissal
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Registrar Portal
            </span>
          </div>

          <form onSubmit={handleExcuseSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Date of Absence / Leave</label>
              <input
                type="date"
                value={excuseDate}
                onChange={(e) => setExcuseDate(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Reason (Medical, Family, Transportation)</label>
              <textarea
                rows={2}
                required
                value={excuseReason}
                onChange={(e) => setExcuseReason(e.target.value)}
                placeholder="e.g. Maya has an orthodontist appointment scheduled at 14:00..."
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Note to Attendance Office</span>
            </button>
          </form>
        </div>
      </div>

      {/* Tuition Invoice & Payment Receipts */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Tuition Statements & Official Receipts for {activeChild.firstName}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('finance')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Open Full Ledger
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {childFees.map(fee => (
            <div key={fee.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 font-mono">{fee.invoiceNo}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{fee.term}</span>
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5">
                  Payment Method: {fee.paymentMethod || 'Stripe'} · Ref: <span className="font-mono">{fee.transactionRef}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-slate-900">${fee.paidAmount.toLocaleString()}</div>
                  <div className="text-[10px] text-emerald-700 font-bold uppercase">PAID & VERIFIED</div>
                </div>
                <button
                  onClick={() => setActiveTab('finance')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50"
                >
                  View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
