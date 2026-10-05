import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GradeItem } from '../../types';
import { 
  GraduationCap, 
  PlusCircle, 
  Award, 
  TrendingUp, 
  Filter, 
  FileSpreadsheet,
  CheckCircle2,
  X
} from 'lucide-react';

export const GradebookView: React.FC = () => {
  const { students, courses, grades, addGradeItem } = useSchoolData();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs_phys11');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Exam' | 'Quiz' | 'Lab' | 'Project' | 'Assignment'>('Exam');
  const [score, setScore] = useState(90);
  const [maxScore, setMaxScore] = useState(100);
  const [feedback, setFeedback] = useState('');

  const selectedCourse = courses.find(c => c.id === selectedCourseId);
  const courseGrades = grades.filter(g => g.courseId === selectedCourseId);

  const handleCreateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetStudentId || !selectedCourse) return;

    const student = students.find(s => s.id === targetStudentId);
    if (!student) return;

    await addGradeItem({
      studentId: targetStudentId,
      studentName: `${student.firstName} ${student.lastName}`,
      courseId: selectedCourse.id,
      courseCode: selectedCourse.code,
      courseName: selectedCourse.name,
      title,
      category,
      score: Number(score),
      maxScore: Number(maxScore),
      date: new Date().toISOString().split('T')[0],
      feedback,
    });

    setTitle('');
    setFeedback('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Academic Gradebook & Curriculum Ledger
          </h1>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <span>Dynamic Weighted GPA Engine</span>
            <span aria-hidden="true">·</span>
            <span>Real-time Grade Calculation</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Synced with Transcripts</span>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors whitespace-nowrap shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record New Grade</span>
        </button>
      </div>

      {/* Course Bar & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 bg-white p-4 border border-slate-200 rounded-lg">
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Subject / Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full text-xs border border-slate-300 rounded px-2.5 py-2 bg-white font-medium"
          >
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code}: {c.name} · {c.credits} Credits · Instructor: {c.instructorName}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase">
              Class Grade Average
            </div>
            <div className="text-2xl font-bold text-indigo-600 font-mono mt-0.5">
              {selectedCourse?.averageGrade || 'A-'}
            </div>
          </div>
          <div className="text-right text-xs text-slate-500 font-mono">
            <div>Credits: {selectedCourse?.credits}.0</div>
            <div>Enrolled: {selectedCourse?.enrolledCount}</div>
          </div>
        </div>

        <div className="bg-white p-4 border border-slate-200 rounded-lg flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Award className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-semibold text-slate-900">Standard Grading Curve</div>
            <div className="text-slate-500">A+ (97%), A (93%), B (83%)</div>
          </div>
        </div>
      </div>

      {/* Grade Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
            <span>Assessments & Grade Entries for {selectedCourse?.name}</span>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {courseGrades.length} Grade Submissions
          </div>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Scholar</th>
              <th className="py-3 px-4">Assessment Title</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Exam Date</th>
              <th className="py-3 px-4 text-right">Score Earned</th>
              <th className="py-3 px-4 text-right">Letter Grade</th>
              <th className="py-3 px-4">Feedback / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courseGrades.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No grade items recorded for this course yet. Click "Record New Grade" above to submit.
                </td>
              </tr>
            ) : (
              courseGrades.map((g) => {
                const student = students.find(s => s.id === g.studentId);
                return (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs ${student?.avatarBg || 'bg-slate-700'}`}>
                          {student?.avatarInitials || 'ST'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{g.studentName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{student?.admissionNo}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">
                      {g.title}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {g.category}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {g.date}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {g.score} / {g.maxScore}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-indigo-600 text-sm tabular-nums">
                      {g.letterGrade}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate text-[11px]">
                      {g.feedback || '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Grade Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Publish Student Grade Assessment</span>
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGrade} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Select Student *</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.admissionNo}) - Grade {s.grade}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit 3 Exam: Thermodynamics & Heat Engines"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 bg-white font-medium"
                  >
                    <option value="Exam">Exam</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Lab">Lab</option>
                    <option value="Project">Project</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Score Earned</label>
                  <input
                    type="number"
                    min="0"
                    max={maxScore}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Max Score</label>
                  <input
                    type="number"
                    min="1"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Educator Feedback (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Commendations, areas for mastery..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Submit & Recalculate GPA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
