import React, { useState } from 'react';
import { Student } from '../../types';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  X, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  HeartPulse, 
  PhoneCall, 
  AlertTriangle, 
  FileText, 
  GraduationCap, 
  Calendar,
  CheckCircle2,
  Key
} from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, onClose }) => {
  const { decryptStudentPII, encryptStudentPII, grades, attendance } = useSchoolData();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sensitive' | 'grades' | 'attendance'>('overview');
  const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

  if (!student) return null;

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    await decryptStudentPII(student.id);
    setIsDecrypting(false);
  };

  const handleLock = () => {
    encryptStudentPII(student.id);
  };

  const studentGrades = grades.filter(g => g.studentId === student.id);
  const studentAttendance = attendance.filter(a => a.studentId === student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold text-sm ${student.avatarBg}`}>
              {student.avatarInitials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">
                  {student.firstName} {student.lastName}
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {student.admissionNo}
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Grade {student.grade} · Section {student.section} · Enrolled {student.enrolledDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-xs">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-mono text-[11px]">AES-256 FLE</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-4 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic & Guardian Profile
          </button>
          <button
            onClick={() => setActiveTab('sensitive')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sensitive'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Encrypted Health & Identity</span>
            {student.isDecrypted ? (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'grades'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Grade History ({studentGrades.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Attendance Logs ({studentAttendance.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div>
                  <div className="text-slate-500">Cumulative GPA:</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {student.gpa.toFixed(2)} / 4.00
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Attendance Rate:</div>
                  <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
                    {student.attendanceRate}%
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Enrollment Status:</div>
                  <div className="text-sm font-semibold text-slate-900 capitalize mt-1">
                    {student.status}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Date of Birth:</div>
                  <div className="text-sm font-semibold text-slate-900 font-mono mt-1">
                    {student.dateOfBirth}
                  </div>
                </div>
              </div>

              {/* Guardian Information */}
              <div className="border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-slate-900 mb-3 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
                  <span>Primary Guardian & Household Contacts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Guardian Name:</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{student.guardianName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Guardian Email:</span>
                    <div className="font-semibold text-slate-900 mt-0.5">{student.guardianEmail}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Emergency Mobile:</span>
                    <div className="font-semibold text-slate-900 font-mono mt-0.5">{student.guardianPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sensitive' && (
            <div className="space-y-6">
              {/* Vault Authorization Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Cryptographic Access Authorization</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Health and national identity records are stored at rest under AES-GCM 256. Access is logged in the FERPA audit ledger.
                  </div>
                </div>

                <div>
                  {student.isDecrypted ? (
                    <button
                      onClick={handleLock}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Lock & Encrypt View</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleDecrypt}
                      disabled={isDecrypting}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-50"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>{isDecrypting ? 'Verifying Key...' : 'Authorize & Decrypt PII'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Protected Fields View */}
              <div className="space-y-4">
                {/* 1. National Identification */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-800">
                      National ID / SSN
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Field: enc_national_id
                    </span>
                  </div>
                  {student.isDecrypted ? (
                    <div className="text-xs font-mono font-bold text-slate-900 bg-emerald-50 border border-emerald-200 p-2.5 rounded">
                      {student.decryptedPII?.nationalId}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 p-2.5 rounded truncate">
                      ••••-••-•••• [Ciphertext: {student.encNationalId.ciphertext.substring(0, 16)}...]
                    </div>
                  )}
                </div>

                {/* 2. Medical Records */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                      <span>Confidential Health & Allergy History</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Field: enc_medical_notes
                    </span>
                  </div>
                  {student.isDecrypted ? (
                    <div className="text-xs text-slate-900 bg-emerald-50 border border-emerald-200 p-3 rounded leading-relaxed">
                      {student.decryptedPII?.medicalNotes}
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 p-3 rounded leading-relaxed">
                      [Encrypted medical history shielded by AES-GCM 256. Click "Authorize & Decrypt PII" with Nurse/Superintendent role to view.]
                    </div>
                  )}
                </div>

                {/* 3. Emergency Contact Details */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Encrypted Emergency Contact Hierarchy</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Field: enc_emergency_contact
                    </span>
                  </div>
                  {student.isDecrypted ? (
                    <div className="text-xs text-slate-900 bg-emerald-50 border border-emerald-200 p-3 rounded space-y-1">
                      <div><strong className="text-slate-700">Contact:</strong> {student.decryptedPII?.emergencyContact.name} ({student.decryptedPII?.emergencyContact.relationship})</div>
                      <div><strong className="text-slate-700">Primary Phone:</strong> <span className="font-mono">{student.decryptedPII?.emergencyContact.phone}</span></div>
                      {student.decryptedPII?.emergencyContact.altPhone && (
                        <div><strong className="text-slate-700">Alternate Phone:</strong> <span className="font-mono">{student.decryptedPII?.emergencyContact.altPhone}</span></div>
                      )}
                      <div><strong className="text-slate-700">Notes:</strong> {student.decryptedPII?.emergencyContact.notes}</div>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-slate-400 bg-slate-100 p-3 rounded">
                      [Emergency contact telephone hierarchy encrypted at rest.]
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'grades' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Course</th>
                      <th className="py-2 px-3">Assessment Title</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3 text-right">Score</th>
                      <th className="py-2 px-3 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentGrades.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-500">
                          No assessment grades logged yet for this student.
                        </td>
                      </tr>
                    ) : (
                      studentGrades.map(g => (
                        <tr key={g.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{g.date}</td>
                          <td className="py-2 px-3 font-semibold text-slate-800">{g.courseCode}</td>
                          <td className="py-2 px-3 text-slate-900">{g.title}</td>
                          <td className="py-2 px-3 text-slate-600">{g.category}</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">{g.score} / {g.maxScore}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-indigo-600">{g.letterGrade}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2 px-3">Date</th>
                      <th className="py-2 px-3">Period / Subject</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Recorded At</th>
                      <th className="py-2 px-3">Verified By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-slate-500">
                          No attendance entries found for this student.
                        </td>
                      </tr>
                    ) : (
                      studentAttendance.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{a.date}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">{a.subject}</td>
                          <td className="py-2 px-3 capitalize font-semibold">
                            <span className={
                              a.status === 'present' ? 'text-emerald-700' :
                              a.status === 'late' ? 'text-amber-700' :
                              a.status === 'excused' ? 'text-sky-700' : 'text-rose-700'
                            }>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">{a.recordedAt}</td>
                          <td className="py-2 px-3 text-slate-600">{a.recordedBy}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            FERPA Protected Record · Student ID: <span className="font-mono text-slate-800">{student.id}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
