"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/(dashboard)/dashboard-layout";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Award,
  AlertTriangle,
  PieChart,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";

const COLORS = ["#8b5cf6", "#d946ef", "#0ea5e9", "#10b981", "#f59e0b", "#3b82f6"];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const mockData = {
      weekly: [
        { day: "Mon", present: 120, absent: 15, late: 5 },
        { day: "Tue", present: 115, absent: 18, late: 3 },
        { day: "Wed", present: 125, absent: 10, late: 7 },
        { day: "Thu", present: 118, absent: 20, late: 4 },
        { day: "Fri", present: 122, absent: 12, late: 6 },
      ],
      monthly: [
        { week: "Week 1", present: 85, absent: 15 },
        { week: "Week 2", present: 88, absent: 12 },
        { week: "Week 3", present: 82, absent: 18 },
        { week: "Week 4", present: 90, absent: 10 },
      ],
      department: [
        { name: "CSE", value: 400, fill: "#8b5cf6" },
        { name: "ECE", value: 300, fill: "#d946ef" },
        { name: "ME", value: 250, fill: "#f59e0b" },
        { name: "CE", value: 200, fill: "#10b981" },
        { name: "EEE", value: 150, fill: "#ef4444" },
        { name: "AIML", value: 350, fill: "#3b82f6" },
        { name: "DS", value: 280, fill: "#ec4899" },
      ],
      hourly: [
        { time: "9:00", records: 45 },
        { time: "10:00", records: 78 },
        { time: "11:00", records: 92 },
        { time: "12:00", records: 65 },
        { time: "13:00", records: 30 },
      ],
    };
    setAnalytics(mockData);
  }, []);

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 mt-1">Deep insights into attendance patterns and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg Attendance</p>
              <p className="text-2xl font-bold text-white">87.5%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Peak Hour</p>
              <p className="text-2xl font-bold text-white">11:00 AM</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Records</p>
              <p className="text-2xl font-bold text-white">12,458</p>
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Dept</p>
              <p className="text-2xl font-bold text-white">CSE / AIML / DS</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" className="text-xs text-gray-500" />
              <YAxis className="text-xs text-gray-500" />
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <Area type="monotone" dataKey="present" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" className="text-xs text-gray-500" />
              <YAxis className="text-xs text-gray-500" />
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <Bar dataKey="present" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Department Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie data={analytics.department} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }: any) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} />
              {analytics.department.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-4">Peak Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.hourly}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" className="text-xs text-gray-500" />
              <YAxis className="text-xs text-gray-500" />
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <Bar dataKey="records" fill="#d946ef" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}