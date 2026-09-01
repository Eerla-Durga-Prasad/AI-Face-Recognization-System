"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui";
import { StatCard } from "@/components/ui";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Avatar } from "@/components/ui";
import {
  Users,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  Award,
  AlertTriangle,
  BarChart3,
  Activity,
  Plus,
  Video,
  FileText,
  Download,
  Filter,
  Bell,
  ChevronRight,
  Settings,
  UserCog,
  Calendar,
  RefreshCw,
  Eye,
  GraduationCap,
} from "lucide-react";
import { formatDate, getGreeting } from "@/lib/utils";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#8b5cf6", "#d946ef", "#0ea5e9", "#10b981", "#f59e0b"];

export default function DashboardPage() {
  const { profile, faceVerified } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    present: 0,
    absent: 0,
    late: 0,
    attendancePercentage: 0,
  });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (json.success && json.data) {
        setStats({
          totalStudents: json.data.totalStudents,
          todayAttendance: json.data.todayAttendance,
          present: json.data.present,
          absent: json.data.absent,
          late: json.data.late,
          attendancePercentage: json.data.attendancePercentage,
        });
        setWeeklyData(json.data.weeklyData || []);
        setDepartmentData(json.data.departmentStats || []);
        setRecentLogs(json.data.recentLogs || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const greeting = useMemo(() => getGreeting(), []);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const isToday = d === today;
      const hasAttendance = weeklyData.some(
        (w) =>
          new Date(w.date).getDate() === d &&
          w.present > 0
      );
      days.push({ day: d, isToday, hasAttendance, date: date.toISOString().split("T")[0] });
    }
    return days;
  }, [currentMonth, weeklyData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            {greeting}, {profile?.full_name?.split(" ")[0] || "Admin"}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Here&apos;s your attendance overview for today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="border-white/10 text-gray-300 hover:text-white"
            onClick={fetchDashboardData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Link href="/attendance">
            <Button variant="primary" size="sm" className="shadow-lg shadow-violet-500/25">
              <Video className="h-4 w-4 mr-2" />
              Start Scanner
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users className="h-5 w-5" />} color="blue" />
        <StatCard title="Today&apos;s Scan" value={`${Math.round((stats.todayAttendance / Math.max(stats.totalStudents, 1)) * 100)}%`} icon={<CalendarCheck className="h-5 w-5" />} color="green" />
        <StatCard title="Present" value={stats.present} icon={<UserCheck className="h-5 w-5" />} color="green" />
        <StatCard title="Absent" value={stats.absent} icon={<UserX className="h-5 w-5" />} color="red" />
        <StatCard title="Late" value={stats.late} icon={<Clock className="h-5 w-5" />} color="orange" />
        <StatCard title="Attendance %" value={`${stats.attendancePercentage}%`} icon={<TrendingUp className="h-5 w-5" />} color="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Attendance Trend</h3>
              <p className="text-sm text-gray-500">This week&apos;s attendance data</p>
            </div>
            <BarChart3 className="h-5 w-5 text-gray-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" className="text-xs text-gray-500" />
              <YAxis className="text-xs text-gray-500" />
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <Area type="monotone" dataKey="present" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Area type="monotone" dataKey="late" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Area type="monotone" dataKey="absent" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Department Stats</h3>
              <p className="text-sm text-gray-500">Attendance by department</p>
            </div>
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="department" className="text-xs text-gray-500" />
              <YAxis className="text-xs text-gray-500" />
              <Tooltip contentStyle={{ background: "rgba(13,13,26,0.95)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
              <Bar dataKey="present" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Recent Attendance Logs</h3>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">View All</Button>
          </div>
          <div className="space-y-3">
            {recentLogs.length > 0 ? (
              recentLogs.map((log, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {log.students?.profiles?.full_name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">{log.students?.roll_number} • {log.time}</p>
                  </div>
                  <Badge variant={log.status === "present" ? "success" : log.status === "absent" ? "error" : "warning"}>
                    {log.status}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No attendance records yet</p>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-400" />
              Calendar
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-400 rotate-180" />
              </button>
              <span className="text-sm font-medium text-white min-w-[100px] text-center">{currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
              <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <button key={i} onClick={() => day && setSelectedDate(day.date)} className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${!day ? "bg-transparent" : day?.isToday ? "bg-violet-500/20 text-violet-300 font-bold" : day?.hasAttendance && !day?.isToday ? "text-gray-300 hover:bg-white/5" : !day?.isToday && !day?.hasAttendance ? "text-gray-600 hover:bg-white/5" : ""}`}>{day?.day}</button>
            ))}
          </div>
          {selectedDate && (
            <div className="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm">
              <p className="text-violet-300 font-medium">{formatDate(new Date(selectedDate))}</p>
              <p className="text-gray-400 mt-1">{weeklyData.find((w) => w.date === selectedDate)?.present || 0} students present</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-6 bg-white/[0.03] border-white/5 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/students">
            <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><UserCog className="h-5 w-5 text-violet-400" /></div>
              <p className="text-sm font-medium text-white">Add Student</p>
              <p className="text-xs text-gray-500 mt-1">Register new student</p>
            </div>
          </Link>
          <Link href="/attendance">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><Video className="h-5 w-5 text-emerald-400" /></div>
              <p className="text-sm font-medium text-white">Scan Attendance</p>
              <p className="text-xs text-gray-500 mt-1">Start face scanner</p>
            </div>
          </Link>
          <Link href="/reports">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><FileText className="h-5 w-5 text-amber-400" /></div>
              <p className="text-sm font-medium text-white">Generate Report</p>
              <p className="text-xs text-gray-500 mt-1">View reports</p>
            </div>
          </Link>
          <Link href="/departments">
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"><GraduationCap className="h-5 w-5 text-cyan-400" /></div>
              <p className="text-sm font-medium text-white">Manage Departments</p>
              <p className="text-xs text-gray-500 mt-1">View departments</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}