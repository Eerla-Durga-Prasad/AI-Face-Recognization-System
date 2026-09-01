import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const serviceRoleClient = getServiceRoleClient();
    const today = new Date().toISOString().split("T")[0];

    const { data: totalStudents } = await serviceRoleClient
      .from("students")
      .select("id");

    const { data: todayAttendance } = await serviceRoleClient
      .from("attendance")
      .select("status, student_id")
      .eq("date", today);

    const present =
      todayAttendance?.filter((a) => a.status === "present").length || 0;
    const absent =
      todayAttendance?.filter((a) => a.status === "absent").length || 0;
    const late =
      todayAttendance?.filter((a) => a.status === "late").length || 0;
    const totalCount = totalStudents?.length || 0;

    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const { data: dayData } = await serviceRoleClient
        .from("attendance")
        .select("status, student_id")
        .eq("date", dateStr);

      weeklyData.push({
        date: dateStr,
        present: dayData?.filter((a) => a.status === "present").length || 0,
        absent: dayData?.filter((a) => a.status === "absent").length || 0,
        late: dayData?.filter((a) => a.status === "late").length || 0,
      });
    }

    const { data: deptStatsRaw } = await serviceRoleClient
      .from("departments")
      .select("id, name, code");

    const deptStats = [];
    for (const dept of deptStatsRaw || []) {
      const { data: deptStudents } = await serviceRoleClient
        .from("students")
        .select("id")
        .eq("department_id", dept.id);

      const total = deptStudents?.length || 0;
      const present =
        todayAttendance?.filter(
          (a) =>
            a.student_id &&
            deptStudents?.some((s) => s.id === a.student_id) &&
            a.status === "present"
        ).length || 0;

      deptStats.push({
        department: dept.name,
        code: dept.code,
        total,
        present,
        percentage: total > 0 ? Math.round((present / total) * 100) : 0,
      });
    }

    const { data: recentLogs } = await serviceRoleClient
      .from("attendance")
      .select(`
        *,
        students!attendance_student_id_fkey(
          id,
          roll_number,
          profiles!students_user_id_fkey(full_name)
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      data: {
        totalStudents: totalCount,
        todayAttendance: todayAttendance?.length || 0,
        present,
        absent,
        late,
        attendancePercentage:
          totalCount > 0
            ? Math.round((present / totalCount) * 100)
            : 0,
        weeklyData,
        departmentStats: deptStats,
        recentLogs: recentLogs || [],
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}