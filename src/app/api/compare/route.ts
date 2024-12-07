import { NextResponse } from "next/server";
import { analyzeDesign } from "@/lib/api/openai";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    // Skip API key check during build
    if (
      process.env.VERCEL_ENV === "production" &&
      !process.env.OPENAI_API_KEY
    ) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500, headers },
      );
    }

    const body = await request.json();

    if (!body.image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400, headers },
      );
    }

    const analysis = await analyzeDesign(body.image);
    return NextResponse.json({ analysis }, { status: 200, headers });
  } catch (error) {
    console.error("Error in analysis route:", error);
    return NextResponse.json(
      { error: "Failed to analyze design" },
      { status: 500, headers },
    );
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    },
  );
}
