import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BookOpen, 
  CalendarCheck, 
  GraduationCap, 
  Clock, 
  Users, 
  ArrowRight, 
  Lock, 
  AlertCircle,
  Award
} from 'lucide-react';

interface TeacherDashboardProps {
  setActiveTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ setActiveTab }) => {
  const { courses, students, grades } = useSchoolData();
  const { currentUser } = useAuth();

  // Marcus Vance's assigned course: AP Physics C (crs_phys11)
  const myCourse = courses.find(c => c.id === 'crs_phys11') || courses[0];
  const myStudents = students.filter(s => s.grade === '11');
  const recentGrades = grades.filter(g => g.courseId === myCourse?.id);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-600 uppercase tracking-wider">
              Faculty Workspace
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">Department of Physics & Applied Sciences</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Marcus Vance, M.Ed. (AP Physics Lead)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active session: AP Physics C (Classical Mechanics) · Room: Sci-Lab 304
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('attendance')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Open Attendance Register</span>
          </button>
          <button
            onClick={() => setActiveTab('academics')}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
          >
            Input Grades
          </button>
        </div>
      </div>

      {/* Class Schedule & Quick Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Class Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Current Active Subject
              </h2>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 font-semibold">
              In Session
            </span>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900">{myCourse?.name}</div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">{myCourse?.code} · {myCourse?.schedule}</div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <div className="text-slate-500">Enrolled Scholars</div>
              <div className="font-bold text-slate-900 text-base font-mono mt-0.5">{myStudents.length}</div>
            </div>
            <div>
              <div className="text-slate-500">Class Average</div>
              <div className="font-bold text-indigo-600 text-base font-mono mt-0.5">{myCourse?.averageGrade}</div>
            </div>
          </div>

          {/* Privacy Note for Educators */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[11px]">
              <Lock className="w-3.5 h-3.5 text-amber-700" />
              <span>FERPA Field Protection Active</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800">
              Sensitive student medical histories are sealed under AES-256. For classroom health emergencies, contact Campus Clinic ext. 409.
            </p>
          </div>
        </div>

        {/* Grade 11 Class Roster Snapshot */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                AP Physics C Scholar Roster ({myStudents.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>View Full SIS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {myStudents.slice(0, 4).map(s => (
              <div key={s.id} className="py-2.5 flex items-center justify-between hover:bg-slate-50 px-2 rounded transition-colors text-xs">
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs ${s.avatarBg}`}>
                    {s.avatarInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{s.firstName} {s.lastName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{s.admissionNo} · Grade {s.grade}-{s.section}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] text-slate-400">Cumulative GPA</div>
                    <div className="font-mono font-bold text-slate-900 tabular-nums">{s.gpa.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Attendance</div>
                    <div className="font-mono font-bold text-emerald-700 tabular-nums">{s.attendanceRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Gradebook Activity */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Recently Recorded Assessments for Physics C
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('academics')}
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            Open Grade Spreadsheet
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentGrades.slice(0, 3).map(g => (
            <div key={g.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 truncate">{g.studentName}</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">{g.letterGrade}</span>
              </div>
              <div className="text-slate-600 text-[11px] truncate">{g.title}</div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1">
                <span>Score: {g.score}/{g.maxScore}</span>
                <span>Date: {g.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
