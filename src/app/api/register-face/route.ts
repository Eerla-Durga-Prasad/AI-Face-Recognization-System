import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { studentId, image } = await request.json();

    if (!studentId || !image) {
      return NextResponse.json(
        { error: "Missing studentId or image" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Face registration placeholder",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
