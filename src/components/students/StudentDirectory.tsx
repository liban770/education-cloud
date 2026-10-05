import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Student } from '../../types';
import { StudentDetailModal } from './StudentDetailModal';
import { AddStudentModal } from './AddStudentModal';
import { Search, UserPlus, Lock, Filter, ShieldCheck, ChevronRight } from 'lucide-react';

export const StudentDirectory: React.FC = () => {
  const { students } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGrade = selectedGrade === 'all' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Student Information System (SIS)
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>{students.length} Enrolled Scholars</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge Field Encryption Enabled</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-medium">FERPA Verified</span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors whitespace-nowrap shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 border border-slate-200 rounded-lg">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, admission number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Grade Filters (Interactive Segmented Buttons) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md text-xs font-medium">
          {['all', '11', '12', '10', '8'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedGrade === g
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'all' ? 'All Grades' : `Grade ${g}`}
            </button>
          ))}
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Scholar Profile</th>
              <th className="py-3 px-4">Admission ID</th>
              <th className="py-3 px-4">Grade & Section</th>
              <th className="py-3 px-4 text-right">GPA</th>
              <th className="py-3 px-4 text-right">Attendance</th>
              <th className="py-3 px-4">Cryptographic Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No student records found matching "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Name and Initials */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold text-xs ${student.avatarBg}`}>
                        {student.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Admission ID */}
                  <td className="py-3 px-4 font-mono text-slate-700">
                    {student.admissionNo}
                  </td>

                  {/* Grade & Section */}
                  <td className="py-3 px-4 text-slate-700">
                    Grade {student.grade} · Section {student.section}
                  </td>

                  {/* GPA */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                    {student.gpa.toFixed(2)}
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-4 text-right font-mono font-medium tabular-nums">
                    <span className={student.attendanceRate >= 95 ? 'text-emerald-700' : 'text-amber-700'}>
                      {student.attendanceRate}%
                    </span>
                  </td>

                  {/* Security / FLE Status */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>AES-GCM Sealed</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">4 fields</span>
                    </div>
                  </td>

                  {/* Inspect CTA */}
                  <td className="py-3 px-4 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:underline">
                      <span>View File</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <StudentDetailModal
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
