"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Plus, GraduationCap, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const DEPARTMENTS = [
  { name: "Computer Science", code: "CSE", head_of_department: "Dr. John Smith" },
  { name: "AI & Machine Learning", code: "AIML", head_of_department: "Dr. Lisa Chen" },
  { name: "Data Science", code: "DS", head_of_department: "Dr. James Wilson" },
  { name: "Electronics & Communication", code: "ECE", head_of_department: "Dr. Jane Doe" },
  { name: "Electrical Engineering", code: "EEE", head_of_department: "Dr. Michael Brown" },
  { name: "Mechanical Engineering", code: "Mechanical", head_of_department: "Dr. Robert Johnson" },
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setDepartments(DEPARTMENTS);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Departments</h1>
          <p className="text-gray-400 mt-1">Manage academic departments</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.03] rounded-2xl animate-pulse border border-white/5" />
          ))
        ) : departments.length === 0 ? (
          <Card className="col-span-full bg-white/[0.03] border-white/5">
            <p className="text-center text-gray-500 py-8">No departments found</p>
          </Card>
        ) : (
          departments.map((dept) => (
            <Card key={dept.id || dept.code} className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm hover:bg-white/[0.06] transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-violet-400" />
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">{dept.code}</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{dept.name}</h3>
              {dept.head_of_department && (
                <p className="text-sm text-gray-400 mb-2">HOD: {dept.head_of_department}</p>
              )}
              <p className="text-xs text-gray-600 mt-3">Status: Active</p>
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Edit className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}