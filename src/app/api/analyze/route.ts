import { NextResponse } from "next/server";
import { analyzeDesign } from "@/lib/api/openai";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("API Route: Started processing request");

  try {
    const body = await request.json();

    if (!body.image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const analysis = await analyzeDesign(body.image);
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in analysis route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze design",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
