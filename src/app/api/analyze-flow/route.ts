import { NextResponse } from "next/server";
import { analyzeUserFlow, analyzeFlowFromImage } from "@/lib/api/openai-flow";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500, headers },
      );
    }

    const body = await request.json();
    let analysis;

    if (body.mode === "text" && body.flowDescription) {
      // Handle text-based flow analysis
      console.log("Processing text-based flow analysis");
      analysis = await analyzeUserFlow(body.flowDescription);
    } else if (body.mode === "image" && body.image) {
      // Handle image-based flow analysis
      console.log("Processing image-based flow analysis");
      analysis = await analyzeFlowFromImage(body.image);
    } else {
      return NextResponse.json(
        {
          error:
            "Invalid request format. Please provide either flowDescription or image.",
        },
        { status: 400, headers },
      );
    }

    return NextResponse.json(
      { analysis },
      {
        status: 200,
        headers,
      },
    );
  } catch (error) {
    console.error("Error in flow analysis route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to analyze flow",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500, headers },
    );
  }
}

// Handle OPTIONS requests for CORS
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
