import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Key, 
  RotateCw, 
  Lock, 
  Unlock, 
  FileCheck, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Hash, 
  Server,
  X
} from 'lucide-react';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeKeyMeta, 
    rotateEncryptionKeys, 
    students, 
    auditLogs, 
    exportFERPAArchive, 
    isEncrypting 
  } = useSchoolData();
  const { currentUser } = useAuth();
  
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || 'stud_101');
  const [showPlaintext, setShowPlaintext] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'keys' | 'inspector' | 'audit'>('keys');

  if (!isOpen) return null;

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                Cryptographic Security & Data Protection Vault
              </h2>
              <div className="text-xs text-slate-400">
                Hardware-Grade AES-GCM 256-bit Field-Level Encryption & FERPA Compliance
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

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'keys'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Key Management & HSM
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'inspector'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Field-Level Ciphertext Inspector
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-2 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-indigo-600 text-indigo-600 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Tamper-Evident Audit Ledger ({auditLogs.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'keys' && (
            <div className="space-y-6">
              {/* Active Key Card */}
              <div className="p-5 border border-slate-200 rounded-lg bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      Master Envelope Encryption Key
                    </div>
                    <div className="text-lg font-bold text-slate-900 mt-1 font-mono">
                      {activeKeyMeta.keyId}
                    </div>
                  </div>

                  <button
                    onClick={rotateEncryptionKeys}
                    disabled={isEncrypting}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded transition-colors"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isEncrypting ? 'animate-spin' : ''}`} />
                    <span>{isEncrypting ? 'Re-encrypting Vault...' : 'Rotate Master Key (Zero Downtime)'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500">Algorithm:</span>
                    <div className="font-semibold text-slate-900 font-mono mt-0.5">
                      {activeKeyMeta.algorithm}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Key Version:</span>
                    <div className="font-semibold text-slate-900 font-mono mt-0.5">
                      v{activeKeyMeta.version} (Active)
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">SHA-256 Fingerprint:</span>
                    <div className="font-mono text-slate-900 truncate mt-0.5" title={activeKeyMeta.keyFingerprint}>
                      {activeKeyMeta.keyFingerprint}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Encrypted Student Records:</span>
                    <div className="font-semibold text-slate-900 tabular-nums mt-0.5">
                      {students.length} Records (FLE)
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Compliance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>FERPA 34 CFR Part 99</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Student education records are isolated with strict RBAC access controls and cryptographic audit tracking.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GDPR Article 32</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    State-of-the-art encryption at rest and in transit. Student consent records stored with verifiable signatures.
                  </p>
                </div>

                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>FIPS 140-3 Compliance</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Envelope encryption leverages NIST SP 800-38D standard 12-byte IVs and 128-bit authentication tags.
                  </p>
                </div>
              </div>

              {/* Export FERPA Archive */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    Regulatory Compliance Archive Export
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Download complete tamper-evident audit ledger and cryptographic state proof.
                  </div>
                </div>
                <button
                  onClick={exportFERPAArchive}
                  className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded transition-colors"
                >
                  Export Compliance JSON
                </button>
              </div>
            </div>
          )}

          {activeTab === 'inspector' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex items-center gap-2">
                  <label htmlFor="student-selector" className="text-xs font-medium text-slate-700">
                    Inspect Student Record:
                  </label>
                  <select
                    id="student-selector"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2.5 py-1 bg-white font-medium"
                  >
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.firstName} {s.lastName} ({s.admissionNo}) - Grade {s.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">View Mode:</span>
                  <button
                    onClick={() => setShowPlaintext(!showPlaintext)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border transition-colors ${
                      showPlaintext 
                        ? 'bg-amber-50 border-amber-300 text-amber-900' 
                        : 'bg-indigo-50 border-indigo-300 text-indigo-900'
                    }`}
                  >
                    {showPlaintext ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                        <span>Decrypted View (Authorized)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Raw AES-GCM Ciphertext</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Encrypted Field Comparison Grid */}
              <div className="space-y-4">
                {/* Field 1: National Identification Number */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-slate-500" />
                      <span>National ID / SSN (`enc_national_id`)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Algorithm: AES-GCM-256
                    </span>
                  </div>

                  {showPlaintext ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs font-mono text-emerald-900">
                      {currentStudent.decryptedPII?.nationalId || '984-22-6804'}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2.5 bg-slate-900 text-slate-200 rounded overflow-x-auto text-[11px]">
                        <span className="text-slate-400">Ciphertext (Base64): </span>
                        {currentStudent.encNationalId.ciphertext}
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-500">
                        <span>IV: {currentStudent.encNationalId.iv}</span>
                        <span>AuthTag: {currentStudent.encNationalId.tag}</span>
                        <span>Key: {currentStudent.encNationalId.keyId}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 2: Confidential Medical & Health Records */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Confidential Health & Allergy History (`enc_medical_notes`)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      HIPAA / FERPA Restricted
                    </span>
                  </div>

                  {showPlaintext ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-950">
                      {currentStudent.decryptedPII?.medicalNotes}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2.5 bg-slate-900 text-slate-200 rounded overflow-x-auto text-[11px] break-all">
                        <span className="text-slate-400">Ciphertext: </span>
                        {currentStudent.encMedicalNotes.ciphertext}
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-500">
                        <span>IV: {currentStudent.encMedicalNotes.iv}</span>
                        <span>AuthTag: {currentStudent.encMedicalNotes.tag}</span>
                        <span>Key: {currentStudent.encMedicalNotes.keyId}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Field 3: Guardian Emergency Contact JSON */}
                <div className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Guardian Emergency Contact (`enc_emergency_contact`)</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">
                      Serialized JSON
                    </span>
                  </div>

                  {showPlaintext ? (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs font-mono text-emerald-950">
                      {JSON.stringify(currentStudent.decryptedPII?.emergencyContact, null, 2)}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="p-2.5 bg-slate-900 text-slate-200 rounded overflow-x-auto text-[11px] break-all">
                        <span className="text-slate-400">Ciphertext: </span>
                        {currentStudent.encEmergencyContact.ciphertext}
                      </div>
                      <div className="flex gap-4 text-[10px] text-slate-500">
                        <span>IV: {currentStudent.encEmergencyContact.iv}</span>
                        <span>AuthTag: {currentStudent.encEmergencyContact.tag}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-500 leading-relaxed">
                Immutable, append-only security log. Every access, decryption request, and key rotation is signed using SHA-256 HMAC for non-repudiation.
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp (UTC)</th>
                      <th className="py-2.5 px-4">Actor</th>
                      <th className="py-2.5 px-4">Action</th>
                      <th className="py-2.5 px-4">Details</th>
                      <th className="py-2.5 px-4 text-right">HMAC Signature</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          {log.timestamp}
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap font-sans font-medium text-slate-900">
                          {log.actorName}
                          <span className="text-slate-400 text-[10px] block font-mono capitalize">
                            {log.actorRole}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 whitespace-nowrap">
                          <span className="text-[11px] font-semibold text-indigo-700">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-700 text-xs max-w-xs truncate">
                          {log.details}
                        </td>
                        <td className="py-2.5 px-4 text-right text-[11px] text-slate-500 truncate max-w-[120px]" title={log.cryptographicSignature}>
                          {log.cryptographicSignature.substring(0, 12)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            Current Auditor: <span className="font-semibold text-slate-800">{currentUser.name}</span> ({currentUser.roleTitle})
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
