import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      matched: false,
      student: null,
      confidence: 0,
      isBlurry: false,
      isMultiFace: false,
      isNoFace: true,
      isScreenReplayed: false,
      blinkDetected: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
