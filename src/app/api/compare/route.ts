import { NextResponse } from "next/server";
import { compareDesigns } from "@/lib/api/openai-compare";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("Compare API: Starting request handling");

  try {
    const body = await request.json();

    console.log("Received request with body:", {
      hasYourDesign: !!body.yourDesign,
      hasCompetitorDesign: !!body.competitorDesign,
    });

    if (!body.yourDesign || !body.competitorDesign) {
      return NextResponse.json(
        { error: "Both designs are required for comparison" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing in environment");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 },
      );
    }

    const analysis = await compareDesigns(
      body.yourDesign,
      body.competitorDesign,
    );
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Error in comparison route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to compare designs",
      },
      { status: 500 },
    );
  }
}
