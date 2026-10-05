import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SensitiveStudentPII } from '../../types';
import { X, Lock, ShieldCheck, UserPlus, CheckCircle2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addNewStudent, isEncrypting } = useSchoolData();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [grade, setGrade] = useState('11');
  const [section, setSection] = useState('A');
  const [dateOfBirth, setDateOfBirth] = useState('2009-03-15');
  const [gender, setGender] = useState<'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say'>('Female');
  const [guardianName, setGuardianName] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  
  // Sensitive PII (To be AES-256 encrypted)
  const [nationalId, setNationalId] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Mother');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !guardianName) return;

    const admissionNo = `AET-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
    const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-violet-600', 'bg-rose-600', 'bg-amber-600'];
    const avatarBg = colors[Math.floor(Math.random() * colors.length)];

    const pii: SensitiveStudentPII = {
      nationalId: nationalId || '999-00-1234',
      medicalNotes: medicalNotes || 'No documented allergies or chronic conditions.',
      emergencyContact: {
        name: guardianName,
        relationship: emergencyRelation,
        phone: emergencyPhone || guardianPhone,
      },
      disciplinaryRecord: 'Clean conduct record at time of enrollment.',
    };

    await addNewStudent({
      admissionNo,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.27@aether.edu`,
      grade,
      section,
      status: 'active',
      gpa: 4.00,
      attendanceRate: 100.0,
      dateOfBirth,
      gender,
      enrolledDate: new Date().toISOString().split('T')[0],
      guardianName,
      guardianEmail,
      guardianPhone,
      avatarInitials: initials,
      avatarBg,
      pii,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                Enroll New Student (Encrypted Admission)
              </h2>
              <div className="text-xs text-slate-400">
                Sensitive medical & national ID fields are hardware encrypted before storage
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* General Demographics */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-xs border-b border-slate-200 pb-1">
              Student Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Maya"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Lin"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                >
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                >
                  <option value="A">Section A (STEM)</option>
                  <option value="B">Section B (Humanities)</option>
                  <option value="C">Section C (General)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Birth Date</label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Guardian Details */}
          <div className="space-y-3 pt-2">
            <h3 className="font-semibold text-slate-900 text-xs border-b border-slate-200 pb-1">
              Guardian & Emergency Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. David Lin"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder="parent@nexus.org"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Protected Encrypted Fields (Highlighted) */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-lg space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold text-xs">
              <Lock className="w-3.5 h-3.5 text-indigo-700" />
              <span>Protected Fields (Encrypted At-Rest with AES-GCM 256)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">National ID / SSN</label>
                <input
                  type="text"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="e.g. 984-22-6804"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Emergency Relation</label>
                <input
                  type="text"
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  placeholder="e.g. Mother / Father"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">
                Confidential Health, Allergy & Medication Notes
              </label>
              <textarea
                rows={2}
                value={medicalNotes}
                onChange={(e) => setMedicalNotes(e.target.value)}
                placeholder="Severe peanut allergy; carries inhaler, diabetic monitor..."
                className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isEncrypting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isEncrypting ? 'Encrypting with AES-256...' : 'Enroll & Encrypt Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
