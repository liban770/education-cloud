import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  CalendarCheck, 
  QrCode, 
  Award, 
  BookOpen, 
  ShieldCheck, 
  Download, 
  FileText,
  Clock,
  Sparkles,
  Barcode
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { students, courses, grades, attendance, exportFERPAArchive } = useSchoolData();
  const { currentUser } = useAuth();

  // Maya Lin is student stud_101
  const student = students.find(s => s.id === 'stud_101') || students[0];
  const myGrades = grades.filter(g => g.studentId === student.id);
  const myAttendance = attendance.filter(a => a.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Student Scholar Portal
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Academic Track: Advanced STEM</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            {student.firstName} {student.lastName} ({student.admissionNo})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Grade {student.grade} - Section {student.section} · Honor Council Representative
          </p>
        </div>

        <button
          onClick={exportFERPAArchive}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Verified Transcript</span>
        </button>
      </div>

      {/* Two Column Grid: Digital Student ID & Quick Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Holographic Digital Student ID Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 shadow-xl border border-indigo-500/30 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between border-b border-indigo-400/20 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center font-bold text-xs">
                  AE
                </span>
                <span className="text-xs font-bold tracking-wider uppercase text-indigo-200">
                  Aether Academy
                </span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-300 border border-indigo-400/20">
                SCHOLAR 26-27
              </span>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-indigo-400/40 shrink-0">
                {student.avatarInitials}
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {student.firstName} {student.lastName}
                </h3>
                <div className="text-xs font-mono text-indigo-300 mt-0.5">
                  ID: {student.admissionNo}
                </div>
                <div className="text-[11px] text-slate-300 mt-1">
                  Grade {student.grade} · STEM Honors Program
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-400/20 flex items-center justify-between text-[11px]">
            <div className="font-mono text-slate-300">
              <div>Valid Thru: 06/2027</div>
              <div className="text-emerald-400 text-[10px]">AES-256 RFID Verified</div>
            </div>

            <div className="w-10 h-10 bg-white p-1 rounded flex items-center justify-center">
              <QrCode className="w-8 h-8 text-slate-900" />
            </div>
          </div>
        </div>

        {/* Academic Performance Snapshot */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Cumulative GPA</span>
                <GraduationCap className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 font-mono mt-3 tabular-nums">
                {student.gpa.toFixed(2)}
              </div>
              <div className="text-xs text-indigo-700 font-medium mt-1">
                4.00 Scale · Dean's High Honors List
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
              Class Rank: Top 3% of Graduating Class of 2027
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Attendance Record</span>
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-emerald-700 font-mono mt-3 tabular-nums">
                {student.attendanceRate}%
              </div>
              <div className="text-xs text-emerald-700 font-medium mt-1">
                Verified On-Campus Presence
              </div>
            </div>
            <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3 mt-4">
              0 Unexcused Absences · RFID Check-in Active
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses & Real-Time Grades */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Enrolled Courses & Assessment History
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {myGrades.length} Verified Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Subject Name</th>
                <th className="py-2.5 px-3">Recent Assessment</th>
                <th className="py-2.5 px-3 text-right">Score</th>
                <th className="py-2.5 px-3 text-right">Grade</th>
                <th className="py-2.5 px-3">Instructor Feedback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myGrades.map((g) => (
                <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                    {g.courseCode}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {g.courseName}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {g.title} ({g.category})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium tabular-nums">
                    {g.score} / {g.maxScore}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-600 text-sm tabular-nums">
                    {g.letterGrade}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate">
                    {g.feedback || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
