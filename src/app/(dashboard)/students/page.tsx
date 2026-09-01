"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Avatar } from "@/components/ui";
import { EmptyState } from "@/components/ui";
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  UserPlus,
  Camera,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const DEPARTMENTS = ["CSE", "AIML", "Data Science", "ECE", "EEE", "Mechanical"];

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/students");
      const json = await res.json();
      if (json.success) {
        setStudents(json.data || []);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((student) => {
    const name = student.profiles?.full_name || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.roll_number || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      !departmentFilter || student.department?.code === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch("/api/students", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading students...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Students</h1>
          <p className="text-gray-400 mt-1">
            Manage your students and their face registration
          </p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2 shadow-lg shadow-violet-500/25">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card className="p-4 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center gap-2 border-white/10 text-gray-300 hover:text-white">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden bg-white/[0.03] border-white/5 backdrop-blur-sm">
        {filteredStudents.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No students found"
            description="Start by adding your first student to the system"
            action={<Button onClick={() => setShowModal(true)}><Plus className="h-4 w-4 mr-2" />Add Student</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/[0.05]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Year/Sem</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Face Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.profiles?.full_name || "Unknown"} size="md" />
                        <div>
                          <p className="font-medium text-white">{student.profiles?.full_name || "Unknown"}</p>
                          <p className="text-sm text-gray-500">{student.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="font-mono text-sm text-gray-300">{student.roll_number}</span></td>
                    <td className="px-6 py-4 text-sm text-gray-300">{student.department?.name || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">Year {student.year} / Sem {student.semester}</td>
                    <td className="px-6 py-4">
                      {student.face_registered ? (
                        <Badge variant="success">Registered</Badge>
                      ) : (
                        <Badge variant="warning">Pending</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)}><Trash2 className="h-4 w-4 text-red-400" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showModal && (
        <StudentModal onClose={() => setShowModal(false)} onSuccess={fetchStudents} />
      )}
    </div>
  );
}

function StudentModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    rollNumber: "",
    department: "",
    year: 1,
    semester: 1,
    section: "A",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          face_registered: false,
        }),
      });
      if (res.ok) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating student:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#111122] border border-white/10 rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Student</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />
          <input
            type="text"
            placeholder="Roll Number"
            value={formData.rollNumber}
            onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          />
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            required
          >
            <option value="">Select Department</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="grid grid-cols-3 gap-4">
            <input type="number" placeholder="Year" value={formData.year} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" min={1} max={4} required />
            <input type="number" placeholder="Sem" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" min={1} max={8} required />
            <input type="text" placeholder="Section" value={formData.section} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/30" required />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 border-white/10 text-gray-300" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" loading={loading}>Add Student</Button>
          </div>
        </form>
      </div>
    </div>
  );
}