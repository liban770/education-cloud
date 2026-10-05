import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Save, 
  Check, 
  Filter,
  Users
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const { students, courses, recordAttendance, attendance } = useSchoolData();
  const { currentUser } = useAuth();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'crs_phys11');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Local state for attendance status of each student
  const [statusMap, setStatusMap] = useState<Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; reason?: string }>>(() => {
    const initial: Record<string, { status: 'present' | 'absent' | 'late' | 'excused'; reason?: string }> = {};
    students.forEach(s => {
      initial[s.id] = { status: 'present' };
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setStatusMap(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], reason }
    }));
  };

  const handleMarkAllPresent = () => {
    setStatusMap(prev => {
      const updated = { ...prev };
      students.forEach(s => {
        updated[s.id] = { status: 'present' };
      });
      return updated;
    });
  };

  const handleSubmit = async () => {
    const batch = Object.entries(statusMap).map(([studentId, data]) => ({
      studentId,
      status: data.status,
      reason: data.reason,
    }));
    await recordAttendance(batch, selectedCourseId);
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  // Statistics calculation for current view
  const total = students.length;
  const presentCount = Object.values(statusMap).filter(v => v.status === 'present').length;
  const lateCount = Object.values(statusMap).filter(v => v.status === 'late').length;
  const absentCount = Object.values(statusMap).filter(v => v.status === 'absent').length;
  const excusedCount = Object.values(statusMap).filter(v => v.status === 'excused').length;
  const percentPresent = total > 0 ? Math.round(((presentCount + excusedCount) / total) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Attendance Verification Ledger
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Daily Register & RFID Scan</span>
            <span aria-hidden="true">·</span>
            <span>Recorded By: {currentUser.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Auto-Sync With Guardian Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Submit Verified Register</span>
          </button>
        </div>
      </div>

      {/* Control Panel & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Course & Date Picker */}
        <div className="md:col-span-2 bg-white p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row items-center gap-3">
          <div className="w-full">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Select Course / Homeroom
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.name} ({c.schedule})
                </option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Register Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
            >
            </input>
          </div>
        </div>

        {/* Attendance Summary KPIs */}
        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              Current Session Rate
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5 tabular-nums">
              {percentPresent}%
            </div>
          </div>
          <div className="text-right text-xs space-y-0.5">
            <div className="text-emerald-700 font-medium">Present: {presentCount}</div>
            <div className="text-amber-700 font-medium">Late: {lateCount}</div>
            <div className="text-rose-700 font-medium">Absent: {absentCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900">{selectedCourse?.room || 'Room 304'}</div>
            <div className="text-slate-500">Instructor: {selectedCourse?.instructorName}</div>
          </div>
        </div>
      </div>

      {/* Roster Attendance Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Scholar</th>
              <th className="py-3 px-4">Admission ID</th>
              <th className="py-3 px-4">Grade</th>
              <th className="py-3 px-4">Attendance Status</th>
              <th className="py-3 px-4">Reason / Notes (Optional)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((student) => {
              const currentStatus = statusMap[student.id]?.status || 'present';
              const currentReason = statusMap[student.id]?.reason || '';

              return (
                <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs ${student.avatarBg}`}>
                        {student.avatarInitials}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {student.firstName} {student.lastName}
                      </span>
                    </div>
                  </td>

                  <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px]">
                    {student.admissionNo}
                  </td>

                  <td className="py-2.5 px-4 text-slate-600">
                    Grade {student.grade}-{student.section}
                  </td>

                  {/* Status Toggle Buttons */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          currentStatus === 'late'
                            ? 'bg-amber-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Absent
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'excused')}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          currentStatus === 'excused'
                            ? 'bg-sky-600 text-white font-semibold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Excused
                      </button>
                    </div>
                  </td>

                  {/* Reason input */}
                  <td className="py-2.5 px-4">
                    <input
                      type="text"
                      placeholder={currentStatus !== 'present' ? 'Reason (e.g. Transit delay, Nurse visit)' : 'Optional notes...'}
                      value={currentReason}
                      onChange={(e) => handleReasonChange(student.id, e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded px-2.5 py-1 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
