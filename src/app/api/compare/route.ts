import { NextResponse } from "next/server";
import { compareDesigns } from "@/lib/api/openai-compare";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    console.log("Received comparison request");

    const body = await request.json();
    console.log(
      "Request body contains images:",
      !!body.yourDesign,
      !!body.competitorDesign,
    );

    if (!body.yourDesign || !body.competitorDesign) {
      return NextResponse.json(
        { error: "Both designs are required for comparison" },
        { status: 400, headers },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500, headers },
      );
    }

    console.log("Calling compareDesigns...");
    const analysis = await compareDesigns(
      body.yourDesign,
      body.competitorDesign,
    );
    console.log("Analysis completed");

    return NextResponse.json(
      { analysis },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Error in comparison route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to compare designs",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500, headers },
    );
  }
}
