"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  FileBarChart,
  FileSpreadsheet,
  FileDown,
  TrendingUp,
  Users,
  BarChart3,
  PieChart,
} from "lucide-react";
import { formatDate, downloadCSV } from "@/lib/utils";

const reportTypes = [
  { name: "Daily Report", icon: Calendar, description: "Attendance for a specific day", color: "from-violet-500 to-fuchsia-500" },
  { name: "Weekly Report", icon: FileBarChart, description: "Weekly attendance summary", color: "from-cyan-500 to-blue-500" },
  { name: "Monthly Report", icon: TrendingUp, description: "Monthly attendance trends", color: "from-emerald-500 to-teal-500" },
  { name: "Department Report", icon: Users, description: "Department-wise analysis", color: "from-amber-500 to-orange-500" },
  { name: "Student Report", icon: FileText, description: "Individual student history", color: "from-rose-500 to-pink-500" },
  { name: "Class Report", icon: BarChart3, description: "Class-wise performance", color: "from-indigo-500 to-violet-500" },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const mockReports = useMemo(
    () => [
      { id: "1", name: "Daily Attendance Report", date: new Date().toISOString().split("T")[0], type: "daily", records: 156 },
      { id: "2", name: "Weekly Summary", date: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0], type: "weekly", records: 42 },
      { id: "3", name: "Monthly Report - June 2024", date: "2024-06-01", type: "monthly", records: 890 },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reports</h1>
          <p className="text-gray-400 mt-1">Generate and download attendance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white" onClick={() => {
            const data = mockReports.map((r) => ({ name: r.name, date: r.date, type: r.type, records: r.records }));
            downloadCSV(data, "attendance-reports");
          }}>
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card
            key={report.name}
            className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm cursor-pointer hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group"
            onClick={() => setSelectedReport(report.name)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${report.color} text-white w-12 h-12 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <report.icon className="h-6 w-6" />
              </div>
              <Badge variant="default" className="bg-white/10 text-gray-300">PDF</Badge>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">{report.name}</h3>
            <p className="text-sm text-gray-500">{report.description}</p>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Reports</h2>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Report Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Records</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{report.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-400">{formatDate(report.date)}</td>
                  <td className="py-4 px-4"><Badge variant="info" className="bg-violet-500/10 text-violet-300 border-violet-500/20 capitalize">{report.type}</Badge></td>
                  <td className="py-4 px-4 text-sm text-gray-400">{report.records}</td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white"><FileDown className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}