import { NextResponse } from "next/server";
import { analyzeDesign } from "@/lib/api/openai";

export const runtime = "edge"; // Use edge runtime
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Add CORS headers
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    const body = await request.json();

    if (!body.image) {
      return NextResponse.json(
        { error: "No image provided" },
        {
          status: 400,
          headers,
        },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing");
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        {
          status: 500,
          headers,
        },
      );
    }

    const analysis = await analyzeDesign(body.image);

    return NextResponse.json(
      { analysis },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Error in analysis route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze design",
        details: error instanceof Error ? error.stack : undefined,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

// Handle OPTIONS request for CORS
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
