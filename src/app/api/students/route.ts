import { NextRequest, NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const serviceRoleClient = getServiceRoleClient();

    if (id) {
      const { data, error } = await serviceRoleClient
        .from("students")
        .select(`
          *,
          profiles!students_user_id_fkey(full_name, email, role),
          departments(*),
          classes(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, data });
    }

    const { data, error } = await serviceRoleClient
      .from("students")
      .select(`
        *,
        profiles!students_user_id_fkey(full_name, email),
        departments(*),
        classes(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceRoleClient = getServiceRoleClient();
    const body = await request.json();

    const { data, error } = await serviceRoleClient
      .from("students")
      .insert([body])
      .select(`
        *,
        profiles!students_user_id_fkey(full_name, email),
        departments(*),
        classes(*)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const serviceRoleClient = getServiceRoleClient();
    const body = await request.json();
    const { id, ...updates } = body;

    const { data, error } = await serviceRoleClient
      .from("students")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        profiles!students_user_id_fkey(full_name, email),
        departments(*),
        classes(*)
      `)
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const serviceRoleClient = getServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Student ID required" },
        { status: 400 }
      );
    }

    const { error } = await serviceRoleClient
      .from("students")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true, message: "Student deleted" });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}