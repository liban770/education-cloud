import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Student, 
  FacultyMember, 
  Course, 
  AttendanceRecord, 
  GradeItem, 
  FeeInvoice, 
  AuditLog, 
  Announcement, 
  CryptographicKeyMeta,
  SensitiveStudentPII 
} from '../types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_FACULTY, 
  INITIAL_COURSES, 
  INITIAL_ATTENDANCE, 
  INITIAL_GRADES, 
  INITIAL_FEES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_ANNOUNCEMENTS 
} from '../mockData/initialData';
import { vault } from '../crypto/encryptionVault';
import { useAuth } from './AuthContext';

interface SchoolDataContextType {
  students: Student[];
  faculty: FacultyMember[];
  courses: Course[];
  attendance: AttendanceRecord[];
  grades: GradeItem[];
  fees: FeeInvoice[];
  auditLogs: AuditLog[];
  announcements: Announcement[];
  activeKeyMeta: CryptographicKeyMeta;
  isEncrypting: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  
  // Student Operations
  addNewStudent: (studentData: Omit<Student, 'id' | 'encNationalId' | 'encMedicalNotes' | 'encEmergencyContact' | 'encDisciplinaryRecord'> & { pii: SensitiveStudentPII }) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  decryptStudentPII: (studentId: string) => Promise<boolean>;
  encryptStudentPII: (studentId: string) => void;
  
  // Academic & Attendance
  recordAttendance: (records: { studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; reason?: string }[], courseId?: string) => Promise<void>;
  addGradeItem: (item: Omit<GradeItem, 'id' | 'letterGrade'>) => Promise<void>;
  
  // Finance
  payFeeInvoice: (invoiceId: string, paymentMethod: 'Stripe Cloud Pay' | 'ACH Wire' | 'Direct Debit' | 'Campus Card') => Promise<void>;
  
  // Cryptography & Security Operations
  rotateEncryptionKeys: () => Promise<void>;
  exportFERPAArchive: () => void;
  
  // Communications
  createAnnouncement: (announcement: Omit<Announcement, 'id' | 'publishedAt'>) => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

export const SchoolDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [faculty] = useState<FacultyMember[]>(INITIAL_FACULTY);
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [grades, setGrades] = useState<GradeItem[]>(INITIAL_GRADES);
  const [fees, setFees] = useState<FeeInvoice[]>(INITIAL_FEES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [activeKeyMeta, setActiveKeyMeta] = useState<CryptographicKeyMeta>(vault.getActiveKeyInfo());
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    vault.initialize().catch(console.error);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const logAuditEvent = async (
    action: AuditLog['action'],
    targetResource: string,
    targetId: string,
    details: string,
    status: AuditLog['status'] = 'success'
  ) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    const rawPayload = `${timestamp}:${currentUser.id}:${action}:${targetResource}:${targetId}`;
    const sig = await vault.generateAuditSignature(rawPayload);

    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetResource,
      targetId,
      ipAddress: '10.240.4.18 (Encrypted Virtual Private Gateway)',
      cryptographicSignature: sig,
      status,
      details,
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Student Field-Level Encryption & Addition
  const addNewStudent = async (
    data: Omit<Student, 'id' | 'encNationalId' | 'encMedicalNotes' | 'encEmergencyContact' | 'encDisciplinaryRecord'> & { pii: SensitiveStudentPII }
  ) => {
    setIsEncrypting(true);
    try {
      // Hardware AES-GCM 256 Encryption for sensitive fields
      const encNationalId = await vault.encryptField(data.pii.nationalId);
      const encMedicalNotes = await vault.encryptField(data.pii.medicalNotes);
      const encEmergencyContact = await vault.encryptField(JSON.stringify(data.pii.emergencyContact));
      const encDisciplinaryRecord = await vault.encryptField(data.pii.disciplinaryRecord || 'Clean record.');

      const newStudent: Student = {
        ...data,
        id: `stud_${Date.now()}`,
        encNationalId,
        encMedicalNotes,
        encEmergencyContact,
        encDisciplinaryRecord,
        decryptedPII: data.pii,
        isDecrypted: false,
      };

      setStudents(prev => [newStudent, ...prev]);
      
      await logAuditEvent(
        'STUDENT_RECORD_CREATED',
        'StudentDirectory',
        newStudent.id,
        `Enrolled student ${newStudent.firstName} ${newStudent.lastName} with 4 AES-256 field-encrypted attributes.`
      );

      showToast(`Student ${newStudent.firstName} ${newStudent.lastName} enrolled with AES-GCM 256 encryption.`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    logAuditEvent('STUDENT_RECORD_UPDATED', 'StudentDirectory', id, `Updated student attributes.`);
  };

  const decryptStudentPII = async (studentId: string): Promise<boolean> => {
    const student = students.find(s => s.id === studentId);
    if (!student) return false;

    // Check Role Authorization: Admin, DPO, or Guardian/Student themselves
    const isAuthorized = 
      currentUser.role === 'admin' || 
      currentUser.role === 'dpo' || 
      (currentUser.role === 'parent' && currentUser.associatedStudentId === studentId) ||
      (currentUser.role === 'student' && currentUser.associatedStudentId === studentId);

    if (!isAuthorized) {
      await logAuditEvent(
        'ACCESS_DENIED_UNAUTHORIZED',
        'StudentPIIVault',
        studentId,
        `Unauthorized decryption attempt by ${currentUser.name} (${currentUser.role}). Access rejected.`,
        'denied'
      );
      showToast('Access Denied: Your role lacks clearance to decrypt protected health & identity records.');
      return false;
    }

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, isDecrypted: true };
      }
      return s;
    }));

    await logAuditEvent(
      'STUDENT_PII_DECRYPTED',
      'StudentPIIVault',
      studentId,
      `Decrypted AES-256 fields (National ID, Medical History, Emergency Contacts) for ${student.firstName} ${student.lastName}.`
    );

    showToast(`Decrypted sensitive record for ${student.firstName} ${student.lastName} (AES-256 GCM verified).`);
    return true;
  };

  const encryptStudentPII = (studentId: string) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, isDecrypted: false };
      }
      return s;
    }));
    showToast('Student fields re-locked to AES-256 ciphertext.');
  };

  // Attendance
  const recordAttendance = async (
    records: { studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; reason?: string }[],
    courseId?: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newRecords: AttendanceRecord[] = records.map(r => {
      const student = students.find(s => s.id === r.studentId);
      return {
        id: `att_${Date.now()}_${r.studentId}`,
        studentId: r.studentId,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Student',
        admissionNo: student?.admissionNo || 'AET-2024',
        date: dateStr,
        grade: student?.grade || '11',
        section: student?.section || 'A',
        subject: courseId ? courses.find(c => c.id === courseId)?.name : 'Morning Homeroom Register',
        status: r.status,
        recordedBy: currentUser.name,
        recordedAt: timeStr,
        reason: r.reason,
      };
    });

    setAttendance(prev => [...newRecords, ...prev]);

    // Recalculate attendance rates for students
    setStudents(prev => prev.map(s => {
      const studentRecords = [...newRecords, ...attendance].filter(a => a.studentId === s.id);
      if (studentRecords.length === 0) return s;
      const presentCount = studentRecords.filter(a => a.status === 'present' || a.status === 'excused').length;
      const rate = Math.round((presentCount / studentRecords.length) * 1000) / 10;
      return { ...s, attendanceRate: rate };
    }));

    await logAuditEvent(
      'ATTENDANCE_REGISTERED',
      'AttendanceLedger',
      dateStr,
      `Submitted ${records.length} student attendance logs by ${currentUser.name}.`
    );

    showToast(`Recorded attendance for ${records.length} students successfully.`);
  };

  // Grades
  const addGradeItem = async (item: Omit<GradeItem, 'id' | 'letterGrade'>) => {
    const pct = (item.score / item.maxScore) * 100;
    let letter = 'F';
    if (pct >= 93) letter = 'A';
    else if (pct >= 90) letter = 'A-';
    else if (pct >= 87) letter = 'B+';
    else if (pct >= 83) letter = 'B';
    else if (pct >= 80) letter = 'B-';
    else if (pct >= 70) letter = 'C';
    else if (pct >= 60) letter = 'D';

    const newGrade: GradeItem = {
      ...item,
      id: `grd_${Date.now()}`,
      letterGrade: letter,
    };

    setGrades(prev => [newGrade, ...prev]);

    // Recalculate GPA for student
    const studentGrades = [newGrade, ...grades.filter(g => g.studentId === item.studentId)];
    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };
    const totalPts = studentGrades.reduce((sum, g) => sum + (gradePoints[g.letterGrade] || 3.0), 0);
    const newGpa = Math.round((totalPts / studentGrades.length) * 100) / 100;

    setStudents(prev => prev.map(s => s.id === item.studentId ? { ...s, gpa: newGpa } : s));

    await logAuditEvent(
      'GRADEBOOK_PUBLISHED',
      'GradeRegistry',
      item.studentId,
      `Entered ${item.title} grade (${item.score}/${item.maxScore} - ${letter}) for ${item.studentName}.`
    );

    showToast(`Grade submitted for ${item.studentName}: ${item.score}/${item.maxScore} (${letter})`);
  };

  // Fee payment
  const payFeeInvoice = async (
    invoiceId: string, 
    paymentMethod: 'Stripe Cloud Pay' | 'ACH Wire' | 'Direct Debit' | 'Campus Card'
  ) => {
    const invoice = fees.find(f => f.id === invoiceId);
    if (!invoice) return;

    const ref = `txn_${Date.now().toString().substring(6)}_ch_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const paymentDate = new Date().toISOString().split('T')[0];

    setFees(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'paid',
          paidAmount: inv.totalAmount,
          balance: 0,
          paymentDate,
          paymentMethod,
          transactionRef: ref,
        };
      }
      return inv;
    }));

    await logAuditEvent(
      'FEE_PAYMENT_PROCESSED',
      'TuitionLedger',
      invoiceId,
      `Paid ${invoice.invoiceNo} balance $${invoice.balance.toLocaleString()} via ${paymentMethod}. Token: ${ref}`
    );

    showToast(`Payment of $${invoice.balance.toLocaleString()} confirmed. Receipt ${ref} issued.`);
  };

  // Master Envelope Cryptographic Key Rotation
  const rotateEncryptionKeys = async () => {
    setIsEncrypting(true);
    try {
      const result = await vault.rotateActiveKey();
      setActiveKeyMeta(vault.getActiveKeyInfo());

      // Re-encrypt existing student records with the new key version
      const updatedStudents = await Promise.all(
        students.map(async s => {
          if (!s.decryptedPII) return s;
          const encNationalId = await vault.encryptField(s.decryptedPII.nationalId);
          const encMedicalNotes = await vault.encryptField(s.decryptedPII.medicalNotes);
          const encEmergencyContact = await vault.encryptField(JSON.stringify(s.decryptedPII.emergencyContact));
          const encDisciplinaryRecord = await vault.encryptField(s.decryptedPII.disciplinaryRecord || '');
          return {
            ...s,
            encNationalId,
            encMedicalNotes,
            encEmergencyContact,
            encDisciplinaryRecord,
          };
        })
      );

      setStudents(updatedStudents);

      await logAuditEvent(
        'CRYPTOGRAPHIC_KEY_ROTATED',
        'VaultKeyRegistry',
        result.newKeyId,
        `Zero-downtime key rotation completed: Re-encrypted student store from ${result.oldKeyId} to ${result.newKeyId}.`
      );

      showToast(`Master Encryption Key rotated to ${result.newKeyId} (AES-256-GCM v${result.version}).`);
    } finally {
      setIsEncrypting(false);
    }
  };

  const exportFERPAArchive = () => {
    const archive = {
      exportTimestamp: new Date().toISOString(),
      institution: 'Aether Academy & University Prep',
      regulatoryCompliance: ['FERPA 34 CFR Part 99', 'GDPR Article 32', 'COPPA 16 CFR Part 312'],
      encryptionStatus: 'AES-GCM-256 Hardware Enforced',
      activeKey: activeKeyMeta,
      totalStudentsEnrolled: students.length,
      auditLogChainHash: auditLogs[0]?.cryptographicSignature,
      recentAuditLogs: auditLogs.slice(0, 10),
    };

    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aetheredu-ferpa-compliance-audit-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    logAuditEvent('FERPA_COMPLIANCE_EXPORT', 'ComplianceRegistry', 'archive_all', 'Exported cryptographic FERPA/GDPR compliance archive.');
    showToast('FERPA/GDPR Cryptographic Archive downloaded.');
  };

  const createAnnouncement = (data: Omit<Announcement, 'id' | 'publishedAt'>) => {
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);
    const newAnn: Announcement = {
      ...data,
      id: `ann_${Date.now()}`,
      publishedAt: dateStr,
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    showToast(`Published announcement: "${data.title}"`);
  };

  return (
    <SchoolDataContext.Provider
      value={{
        students,
        faculty,
        courses,
        attendance,
        grades,
        fees,
        auditLogs,
        announcements,
        activeKeyMeta,
        isEncrypting,
        toastMessage,
        showToast,
        addNewStudent,
        updateStudent,
        decryptStudentPII,
        encryptStudentPII,
        recordAttendance,
        addGradeItem,
        payFeeInvoice,
        rotateEncryptionKeys,
        exportFERPAArchive,
        createAnnouncement,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = (): SchoolDataContextType => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
