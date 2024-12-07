import OpenAI from "openai";
import type { FlowAnalysis } from "@/types/flows";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export async function analyzeUserFlow(
  flowDescription: string,
): Promise<FlowAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `As a UX expert, analyze this user flow and provide detailed feedback and improvements. Consider user experience best practices, potential pain points, and optimization opportunities.

Flow Description:
${flowDescription}

Provide a structured analysis including:
1. Step-by-step analysis of the current flow
2. Suggested improvements for each step
3. An optimized version of the flow
4. General suggestions for improvement
5. Potential issues to address
6. Relevant best practices

Format the response to clearly separate each section.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return parseFlowAnalysis(response.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error in flow analysis:", error);
    throw error;
  }
}

export async function analyzeFlowFromImage(
  imageBase64: string,
): Promise<FlowAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `As a UX expert, analyze this user flow from the competitor's screenshots and provide detailed feedback and suggestions for improvement. Consider:
1. What works well in their flow
2. What could be improved
3. How we could create a better flow while maintaining the core functionality
4. Industry best practices
5. Potential optimizations

Focus on providing actionable insights and specific improvements.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: imageBase64 },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    return parseFlowAnalysis(response.choices[0]?.message?.content || "", true);
  } catch (error) {
    console.error("Error in flow image analysis:", error);
    throw error;
  }
}

function parseFlowAnalysis(
  content: string,
  isImageAnalysis = false,
): FlowAnalysis {
  // Initialize with empty arrays to handle cases where sections might be missing
  const analysis: FlowAnalysis = {
    currentFlow: [],
    improvedFlow: [],
    generalSuggestions: [],
    potentialIssues: [],
    bestPractices: [],
    competitorInsights: isImageAnalysis ? [] : undefined,
  };

  try {
    // Split content into sections based on common headers
    const sections = content.split(/\n(?=[A-Z][^a-z]*:)/);

    sections.forEach((section) => {
      const lines = section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      if (
        section.toLowerCase().includes("current flow") ||
        section.toLowerCase().includes("step-by-step analysis")
      ) {
        analysis.currentFlow = parseSteps(lines.slice(1));
      } else if (
        section.toLowerCase().includes("improved flow") ||
        section.toLowerCase().includes("optimized flow")
      ) {
        analysis.improvedFlow = parseSteps(lines.slice(1));
      } else if (
        section.toLowerCase().includes("general suggestions") ||
        section.toLowerCase().includes("recommendations")
      ) {
        analysis.generalSuggestions = parsePoints(lines.slice(1));
      } else if (
        section.toLowerCase().includes("potential issues") ||
        section.toLowerCase().includes("pain points")
      ) {
        analysis.potentialIssues = parsePoints(lines.slice(1));
      } else if (section.toLowerCase().includes("best practices")) {
        analysis.bestPractices = parsePoints(lines.slice(1));
      } else if (
        isImageAnalysis &&
        section.toLowerCase().includes("competitor")
      ) {
        analysis.competitorInsights = parsePoints(lines.slice(1));
      }
    });

    return analysis;
  } catch (error) {
    console.error("Error parsing flow analysis:", error);
    throw new Error("Failed to parse flow analysis");
  }
}

function parseSteps(
  lines: string[],
): { step: string; improvements?: string[]; rationale?: string }[] {
  const steps: { step: string; improvements?: string[]; rationale?: string }[] =
    [];
  let currentStep: {
    step: string;
    improvements?: string[];
    rationale?: string;
  } | null = null;

  lines.forEach((line) => {
    const cleanLine = line.replace(/^\d+\.\s*/, "").trim();

    if (line.match(/^\d+\./)) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = { step: cleanLine };
    } else if (currentStep) {
      if (line.toLowerCase().includes("improvement") || line.startsWith("-")) {
        if (!currentStep.improvements) {
          currentStep.improvements = [];
        }
        currentStep.improvements.push(cleanLine.replace(/^-\s*/, ""));
      } else {
        currentStep.rationale = cleanLine;
      }
    }
  });

  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
}

function parsePoints(lines: string[]): string[] {
  return lines
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter((line) => line.length > 0);
}
