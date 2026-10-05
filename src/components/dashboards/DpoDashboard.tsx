import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { 
  ShieldCheck, 
  Key, 
  RotateCw, 
  Lock, 
  FileCheck, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  Database,
  ArrowRight
} from 'lucide-react';

interface DpoDashboardProps {
  onOpenVault: () => void;
  onOpenDjangoArch: () => void;
}

export const DpoDashboard: React.FC<DpoDashboardProps> = ({ onOpenVault, onOpenDjangoArch }) => {
  const { 
    activeKeyMeta, 
    rotateEncryptionKeys, 
    students, 
    auditLogs, 
    exportFERPAArchive, 
    isEncrypting 
  } = useSchoolData();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-violet-700 uppercase tracking-wider">
              Privacy, Compliance & Cryptographic Operations
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-mono">DPO Officer: Elena Rostova, CIPP/E</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            Data Protection Officer (DPO) & Registrar Security Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic governance enforcing FERPA 34 CFR Part 99, GDPR Article 32, and FIPS 140-3 zero-knowledge storage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportFERPAArchive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Compliance Proof</span>
          </button>
          <button
            onClick={onOpenVault}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inspect Raw Keys & Ciphertext</span>
          </button>
        </div>
      </div>

      {/* Compliance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Master KEK</span>
            <Key className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-2 truncate">
            {activeKeyMeta.keyId}
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Algorithm: AES-GCM 256-bit
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Encrypted Records</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {students.length * 4} Fields
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Zero plaintext at-rest
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Signed Audit Logs</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono mt-2 tabular-nums">
            {auditLogs.length} Entries
          </div>
          <div className="text-xs text-slate-500 mt-1">
            HMAC-SHA256 verified
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">FERPA & GDPR Status</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono mt-2">
            100% Pass
          </div>
          <div className="text-xs text-emerald-700 font-medium mt-1">
            Zero reported breaches
          </div>
        </div>
      </div>

      {/* Security Actions & Key Rotation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Cryptographic Key Lifecycle & Envelope Rotation
              </h2>
            </div>
            <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-semibold border border-emerald-200">
              Key Version v{activeKeyMeta.version}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            AetherEdu employs envelope encryption. Master Key Encryption Keys (KEKs) protect individual field-level Data Encryption Keys (DEKs). Rotating the master key re-encrypts all student record envelopes without downtime.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded font-mono text-xs space-y-1">
            <div><span className="text-slate-500">Key Fingerprint:</span> <span className="text-slate-800 text-[11px] truncate block">{activeKeyMeta.keyFingerprint}</span></div>
            <div><span className="text-slate-500">Initialization Vector:</span> 12-byte cryptographically secure CSPRNG nonce</div>
            <div><span className="text-slate-500">Authentication Tag:</span> 128-bit integrity tag appended</div>
          </div>

          <button
            onClick={rotateEncryptionKeys}
            disabled={isEncrypting}
            className="w-full inline-flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isEncrypting ? 'animate-spin' : ''}`} />
            <span>{isEncrypting ? 'Executing Re-encryption Pipeline...' : 'Execute Key Rotation (Zero Downtime)'}</span>
          </button>
        </div>

        {/* Audit Log Ledger Snippet */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                Tamper-Evident Access Log (Immutable)
              </h2>
            </div>
            <button
              onClick={onOpenVault}
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>Audit Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{log.actorName} ({log.actorRole})</span>
                  <span className="font-mono text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <div className="text-[11px] text-slate-600 truncate">{log.details}</div>
                <div className="text-[10px] font-mono text-emerald-700">Signature: {log.cryptographicSignature.substring(0, 16)}...</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
