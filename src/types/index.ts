export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'dpo';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatarText: string;
  badge: string;
  departmentOrGrade?: string;
  associatedStudentId?: string; // For parents/students
  permissions: string[];
}

export interface EncryptedField {
  ciphertext: string;
  iv: string;
  tag: string;
  keyId: string;
  algorithm: 'AES-GCM-256';
  encryptedAt: string;
  plainLength?: number;
}

export interface SensitiveStudentPII {
  nationalId: string;
  medicalNotes: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    altPhone?: string;
    notes?: string;
  };
  disciplinaryRecord?: string;
  specialAccommodations?: string;
}

export interface Student {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  email: string;
  grade: string;
  section: string;
  status: 'active' | 'suspended' | 'transferred' | 'graduated';
  gpa: number;
  attendanceRate: number;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Non-Binary' | 'Prefer not to say';
  enrolledDate: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  avatarInitials: string;
  avatarBg: string;
  
  // Encrypted At-Rest Fields (AES-GCM-256)
  encNationalId: EncryptedField;
  encMedicalNotes: EncryptedField;
  encEmergencyContact: EncryptedField;
  encDisciplinaryRecord: EncryptedField;
  
  // Transient Decrypted Cache (accessible only if authorized)
  decryptedPII?: SensitiveStudentPII;
  isDecrypted?: boolean;
}

export interface FacultyMember {
  id: string;
  staffId: string;
  name: string;
  email: string;
  department: string;
  title: string;
  phone: string;
  assignedClasses: {
    grade: string;
    section: string;
    subject: string;
    room: string;
  }[];
  qualification: string;
  status: 'active' | 'on_leave';
  avatarInitials: string;
  avatarBg: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  grade: string;
  credits: number;
  instructorId: string;
  instructorName: string;
  schedule: string;
  room: string;
  enrolledCount: number;
  averageGrade: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  admissionNo: string;
  date: string;
  grade: string;
  section: string;
  subject?: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  recordedBy: string;
  recordedAt: string;
  reason?: string;
}

export interface GradeItem {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  category: 'Exam' | 'Quiz' | 'Lab' | 'Project' | 'Assignment';
  score: number;
  maxScore: number;
  letterGrade: string;
  date: string;
  feedback?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNo: string;
  studentId: string;
  studentName: string;
  grade: string;
  guardianName: string;
  term: string;
  academicYear: string;
  tuitionAmount: number;
  labTechnologyFee: number;
  sportsActivityFee: number;
  discountScholarship: number;
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paymentDate?: string;
  paymentMethod?: 'Stripe Cloud Pay' | 'ACH Wire' | 'Direct Debit' | 'Campus Card';
  transactionRef?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 
    | 'CRYPTOGRAPHIC_KEY_ROTATED'
    | 'STUDENT_PII_DECRYPTED'
    | 'STUDENT_RECORD_CREATED'
    | 'STUDENT_RECORD_UPDATED'
    | 'ATTENDANCE_REGISTERED'
    | 'GRADEBOOK_PUBLISHED'
    | 'FEE_PAYMENT_PROCESSED'
    | 'FERPA_COMPLIANCE_EXPORT'
    | 'ACCESS_DENIED_UNAUTHORIZED';
  targetResource: string;
  targetId: string;
  ipAddress: string;
  cryptographicSignature: string; // SHA-256 HMAC
  status: 'success' | 'flagged' | 'denied';
  details: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  targetAudience: 'all' | 'students' | 'parents' | 'teachers';
  priority: 'normal' | 'urgent';
  publishedAt: string;
  category: 'Academic' | 'Campus Life' | 'Security Alert' | 'Administrative';
}

export interface CryptographicKeyMeta {
  keyId: string;
  version: number;
  algorithm: 'AES-GCM-256';
  status: 'active' | 'retired' | 'revoked';
  createdDate: string;
  rotatedDate?: string;
  encryptedRecordsCount: number;
  keyFingerprint: string;
}
