import React, { useState } from 'react';
import { 
  Database, 
  Server, 
  Layers, 
  Lock, 
  Code2, 
  Copy, 
  Check, 
  FileText, 
  Download,
  X,
  Cpu,
  Share2
} from 'lucide-react';

interface DjangoArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DjangoArchitectureModal: React.FC<DjangoArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'models' | 'serializers' | 'permissions' | 'encryption' | 'topology'>('topology');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, string> = {
    topology: `# Enterprise Scalable Education Management Cloud Topology
# High-Throughput Django + PostgreSQL + Redis + Celery + React Architecture

   [ React 19 Frontend SPA (Client AES-256 WebCrypto) ]
                           │
                 HTTPS / WSS (REST & WebSockets)
                           ▼
  [ Nginx / Cloudflare Edge (DDoS Guard, TLS 1.3, Rate Limiting) ]
                           │
       ┌───────────────────┴───────────────────┐
       ▼                                       ▼
[ Gunicorn / Uvicorn ]                  [ Gunicorn / Uvicorn ]
[ Django REST Framework (Node 1) ]      [ Django REST Framework (Node 2) ]
       │                                       │
       ├───────────────────┬───────────────────┤
       ▼                   ▼                   ▼
[ Redis Cluster ]    [ Celery Workers ]    [ HashiCorp Vault / AWS KMS ]
  - Token Blacklist    - Async Grades        - Master Envelope Keys (KEK)
  - Rate Limiting      - PDF Report Cards    - Zero-Knowledge Key Rotation
  - Realtime Attendance- Parent Alerts       - Hardware HSM Storage
       │
       ▼
[ PostgreSQL 16 Multi-Tenant Cluster (Primary + Read Replicas) ]
  - Schema-per-School (Tenant Isolation)
  - Field-Level Encryption via pgcrypto & AES-GCM
  - Row Level Security (RLS) policies
  - Append-Only Tamper-Evident Audit Partition Tables`,

    models: `# apps/students/models.py
from django.db import models
from django.core.exceptions import PermissionDenied
from apps.crypto.fields import EncryptedCharField, EncryptedJSONField
from apps.core.models import TenantTimeStampedModel

class Student(TenantTimeStampedModel):
    admission_no = models.CharField(max_length=32, unique=True, db_index=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    grade = models.CharField(max_length=16, db_index=True)
    section = models.CharField(max_length=8)
    status = models.CharField(
        max_length=16, 
        choices=[('active', 'Active'), ('suspended', 'Suspended'), ('graduated', 'Graduated')],
        default='active'
    )
    
    # ── Field-Level AES-GCM 256 Encrypted PII ────────────────────────
    enc_national_id = EncryptedCharField(
        max_length=512,
        help_text="AES-GCM-256 encrypted SSN / National Identification"
    )
    enc_medical_notes = EncryptedCharField(
        max_length=2048,
        help_text="HIPAA/FERPA restricted student medical allergies & medication"
    )
    enc_emergency_contacts = EncryptedJSONField(
        help_text="Encrypted guardian mobile numbers and relation hierarchy"
    )
    enc_disciplinary_record = EncryptedCharField(
        max_length=2048, 
        blank=True
    )
    
    cumulative_gpa = models.DecimalField(max_digits=4, decimal_places=2, default=4.00)
    attendance_rate = models.DecimalField(max_digits=5, decimal_places=2, default=100.0)

    class Meta:
        indexes = [
            models.Index(fields=['tenant', 'grade', 'section']),
        ]
        verbose_name = "Student Profile"

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.admission_no})"`,

    serializers: `# apps/students/serializers.py
from rest_framework import serializers
from .models import Student

class StudentSecureSerializer(serializers.ModelSerializer):
    """
    Role-Aware Serializer: Masks sensitive PII for unauthorized faculty/students
    while revealing decrypted payload for Principal, School Nurse, and Guardian.
    """
    decrypted_medical = serializers.SerializerMethodField()
    decrypted_national_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Student
        fields = [
            'id', 'admission_no', 'first_name', 'last_name',
            'grade', 'section', 'status', 'cumulative_gpa',
            'attendance_rate', 'decrypted_medical', 'decrypted_national_id'
        ]

    def get_decrypted_medical(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        
        # Only School Nurse, Super Admin, or Student's verified Guardian can decrypt
        if user and (user.role in ['admin', 'dpo', 'nurse'] or user.guardian_of(obj)):
            return obj.enc_medical_notes.decrypt()
        return "•••• PROTECTED BY AES-256 (FERPA CLEARANCE REQUIRED) ••••"

    def get_decrypted_national_id(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if user and user.role in ['admin', 'dpo']:
            return obj.enc_national_id.decrypt()
        return "XXX-XX-••••"`,

    permissions: `# apps/core/permissions.py
from rest_framework.permissions import BasePermission

class IsInstitutionAdminOrDPO(BasePermission):
    """Allows full administrative and cryptographic key rotation access."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ['admin', 'dpo'])

class IsAssignedFaculty(BasePermission):
    """Grants attendance marking and grade submission for assigned courses only."""
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True
        return obj.assigned_faculty_id == request.user.faculty_profile.id

class IsGuardianOrStudentSelf(BasePermission):
    """Strict FERPA isolation: Guardians and Students can only view their own records."""
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['admin', 'dpo']:
            return True
        if request.user.role == 'parent':
            return obj.id in request.user.guardian_student_ids
        if request.user.role == 'student':
            return obj.id == request.user.student_profile_id
        return False`,

    encryption: `# apps/crypto/vault_service.py
import base64
import os
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings

class EnterpriseVaultService:
    """
    Envelope Encryption Engine integrating with HashiCorp Vault / AWS KMS.
    Uses 256-bit Key Encryption Key (KEK) with unique Data Encryption Keys (DEKs).
    """
    
    @classmethod
    def encrypt_value(cls, plaintext: str) -> dict:
        key = settings.VAULT_ACTIVE_AES256_KEY # Derived from KMS / HSM
        aesgcm = AESGCM(key)
        # 96-bit (12-byte) cryptographically secure IV
        nonce = os.urandom(12)
        data = plaintext.encode('utf-8')
        
        # Ciphertext contains the 16-byte GCM authentication tag appended at the end
        ciphertext_with_tag = aesgcm.encrypt(nonce, data, None)
        
        return {
            'ciphertext': base64.b64encode(ciphertext_with_tag[:-16]).decode('ascii'),
            'tag': base64.b64encode(ciphertext_with_tag[-16:]).decode('ascii'),
            'iv': base64.b64encode(nonce).decode('ascii'),
            'algorithm': 'AES-GCM-256',
            'key_id': settings.VAULT_ACTIVE_KEY_ID
        }

    @classmethod
    def decrypt_value(cls, encrypted_dict: dict) -> str:
        key = settings.VAULT_ACTIVE_AES256_KEY
        aesgcm = AESGCM(key)
        nonce = base64.b64decode(encrypted_dict['iv'])
        raw_cipher = base64.b64decode(encrypted_dict['ciphertext'])
        tag = base64.b64decode(encrypted_dict['tag'])
        
        decrypted_bytes = aesgcm.decrypt(nonce, raw_cipher + tag, None)
        return decrypted_bytes.decode('utf-8')`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadBlueprint = () => {
    const fullBlueprint = `# AETHEREDU CLOUD - DJANGO + POSTGRESQL ENTERPRISE BLUEPRINT
=============================================================

### 1. TOPOLOGY OVERVIEW
${codeSnippets.topology}

### 2. DJANGO MODELS (models.py)
${codeSnippets.models}

### 3. REST FRAMEWORK SERIALIZERS (serializers.py)
${codeSnippets.serializers}

### 4. RBAC & FERPA PERMISSIONS (permissions.py)
${codeSnippets.permissions}

### 5. ENVELOPE ENCRYPTION SERVICE (vault_service.py)
${codeSnippets.encryption}
`;

    const blob = new Blob([fullBlueprint], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aetheredu-django-scalable-architecture.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-600 rounded">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold">
                Scalable Django + PostgreSQL Backend Architecture Blueprint
              </h2>
              <div className="text-xs text-slate-400">
                Multi-Tenant DRF, Celery Task Queues, HashiCorp Vault KMS & AES-256 Envelope Cryptography
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

        {/* Tab selection */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-medium">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCodeTab('topology')}
              className={`px-3 py-2 border-b-2 transition-colors ${
                activeCodeTab === 'topology'
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              System Topology & Scale
            </button>
            <button
              onClick={() => setActiveCodeTab('models')}
              className={`px-3 py-2 border-b-2 transition-colors ${
                activeCodeTab === 'models'
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              models.py (Encrypted SIS)
            </button>
            <button
              onClick={() => setActiveCodeTab('serializers')}
              className={`px-3 py-2 border-b-2 transition-colors ${
                activeCodeTab === 'serializers'
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              serializers.py (RBAC Masking)
            </button>
            <button
              onClick={() => setActiveCodeTab('permissions')}
              className={`px-3 py-2 border-b-2 transition-colors ${
                activeCodeTab === 'permissions'
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              permissions.py (FERPA Guard)
            </button>
            <button
              onClick={() => setActiveCodeTab('encryption')}
              className={`px-3 py-2 border-b-2 transition-colors ${
                activeCodeTab === 'encryption'
                  ? 'border-sky-600 text-sky-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              vault_service.py (KMS AES-256)
            </button>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={handleDownloadBlueprint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Blueprint</span>
            </button>
          </div>
        </div>

        {/* Code Content Area */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 font-mono text-xs text-slate-200">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            {codeSnippets[activeCodeTab]}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-800">
              <Cpu className="w-4 h-4 text-sky-600" />
              100K+ Student Scalability Blueprint
            </span>
            <span className="text-slate-400">·</span>
            <span>PostgreSQL 16 + Redis 7 + Celery 5 + DRF 3.15</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
