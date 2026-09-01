import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { studentId, subjectId, classId, date, time, status, confidence, deviceInfo, browserInfo } =
      await request.json();

    if (!studentId || !date) {
      return NextResponse.json(
        { error: "studentId and date are required" },
        { status: 400 }
      );
    }

    const serviceRoleClient = getServiceRoleClient();
    const today = date || new Date().toISOString().split("T")[0];
    const currentTime = time || new Date().toTimeString().split(" ")[0];

    const cookieStore = await cookies();
    const session = cookieStore.get("sb-access-token")?.value;
    let markedBy = null;

    if (session) {
      const { data: { user } } = await serviceRoleClient.auth.getUser(session);
      if (user) markedBy = user.id;
    }

    const { data: existing } = await serviceRoleClient
      .from("attendance")
      .select("id")
      .eq("student_id", studentId)
      .eq("date", today)
      .single();

    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Attendance already marked for today",
        duplicate: true,
      });
    }

    const { error: insertError } = await serviceRoleClient
      .from("attendance")
      .insert([
        {
          student_id: studentId,
          subject_id: subjectId || null,
          teacher_id: markedBy,
          class_id: classId || null,
          date: today,
          time: currentTime,
          status: status || "present",
          confidence_score: confidence || null,
          marked_by: markedBy,
          device_info: deviceInfo || "unknown",
          browser_info: browserInfo || "unknown",
        },
      ]);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const date = searchParams.get("date");

    const today = date || new Date().toISOString().split("T")[0];
    const serviceRoleClient = getServiceRoleClient();

    let query = serviceRoleClient
      .from("attendance")
      .select(`
        id,
        student_id,
        date,
        time,
        status,
        confidence_score,
        students!attendance_student_id_fkey(
          id,
          roll_number,
          profiles!students_user_id_fkey(full_name, email)
        )
      `)
      .eq("date", today)
      .order("time", { ascending: false });

    if (studentId) {
      query = query.eq("student_id", studentId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}