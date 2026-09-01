export type UserRole = "admin" | "teacher" | "student";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head_of_department?: string;
  created_at: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department_id: string;
  credits: number;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  section: string;
  year: number;
  semester: number;
  department_id: string;
  teacher_id?: string;
  created_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  roll_number: string;
  department_id: string;
  class_id: string;
  year: number;
  semester: number;
  section: string;
  face_registered: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  departments?: Department;
  face_embedding?: number[];
}

export interface Teacher {
  id: string;
  user_id: string;
  department_id?: string;
  designation?: string;
  created_at: string;
  profiles?: Profile;
  departments?: Department;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  subject_id: string;
  teacher_id: string;
  class_id: string;
  date: string;
  time: string;
  status: "present" | "absent" | "late";
  confidence_score: number;
  marked_by: string;
  created_at: string;
  students?: Student;
  subjects?: Subject;
  teachers?: Teacher;
  classes?: Class;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalStudents: number;
  todayAttendance: number;
  present: number;
  absent: number;
  late: number;
  attendancePercentage: number;
}

export interface WeeklyAttendance {
  date: string;
  present: number;
  absent: number;
  late: number;
}

export interface MonthlyAttendance {
  month: string;
  present: number;
  absent: number;
  percentage: number;
}

export interface DepartmentStats {
  department: string;
  total: number;
  present: number;
  percentage: number;
}

export interface TopStudent {
  id: string;
  name: string;
  roll_number: string;
  attendance_percentage: number;
}

export interface LowAttendanceStudent {
  id: string;
  name: string;
  roll_number: string;
  attendance_percentage: number;
}
