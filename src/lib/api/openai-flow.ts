import OpenAI from "openai";

// Initialize OpenAI with fallback for build time
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export interface FlowStep {
  step: string;
  improvements?: string[];
  rationale?: string;
}

export interface FlowAnalysis {
  currentFlow: FlowStep[];
  improvedFlow: FlowStep[];
  generalSuggestions: string[];
  potentialIssues: string[];
  bestPractices: string[];
  competitorInsights?: string[];
}

export async function analyzeFlowFromImage(
  imageBase64: string,
): Promise<FlowAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `Analyze this user flow screenshot and provide a structured analysis using exactly these headers and format:

CURRENT FLOW ANALYSIS:
[List each step you observe in the flow]
- Step 1: [description]
- Step 2: [description]
[etc.]

IMPROVED FLOW SUGGESTIONS:
[List specific improvements]
- Improvement 1: [description]
- Improvement 2: [description]
[etc.]

GENERAL SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]
[etc.]

POTENTIAL ISSUES:
- [Issue 1]
- [Issue 2]
[etc.]

BEST PRACTICES:
- [Practice 1]
- [Practice 2]
[etc.]

COMPETITOR INSIGHTS:
- [Insight 1]
- [Insight 2]
[etc.]

Please maintain this exact structure and headers in your response. Be specific and detailed in your analysis.`;

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
      max_tokens: 3000,
      temperature: 0.7,
    });

    return parseImageFlowAnalysis(response.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error in flow image analysis:", error);
    throw error;
  }
}

function parseImageFlowAnalysis(content: string): FlowAnalysis {
  const analysis: FlowAnalysis = {
    currentFlow: [],
    improvedFlow: [],
    generalSuggestions: [],
    potentialIssues: [],
    bestPractices: [],
    competitorInsights: [],
  };

  try {
    // Split content by main sections
    const sections = content.split(/[A-Z\s]+:/);
    const sectionNames = content.match(/[A-Z\s]+:/g) || [];

    sectionNames.forEach((sectionName, index) => {
      const sectionContent = sections[index + 1]?.trim() || "";
      const points = sectionContent
        .split("\n")
        .map((line) => line.replace(/^[-•●]\s*/, "").trim())
        .filter((line) => line.length > 0);

      switch (sectionName.trim().replace(":", "").toLowerCase()) {
        case "current flow analysis":
          analysis.currentFlow = points.map((point) => ({ step: point }));
          break;
        case "improved flow suggestions":
          analysis.improvedFlow = points.map((point) => ({ step: point }));
          break;
        case "general suggestions":
          analysis.generalSuggestions = points;
          break;
        case "potential issues":
          analysis.potentialIssues = points;
          break;
        case "best practices":
          analysis.bestPractices = points;
          break;
        case "competitor insights":
          analysis.competitorInsights = points;
          break;
      }
    });

    return analysis;
  } catch (error) {
    console.error("Error parsing image flow analysis:", error);
    throw error;
  }
}

export async function analyzeUserFlow(
  flowDescription: string,
): Promise<FlowAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `Analyze this user flow and provide a structured analysis using exactly these headers and format:

CURRENT FLOW ANALYSIS:
[Analyze each step in the current flow]
- Step 1: [description]
- Step 2: [description]
[etc.]

IMPROVED FLOW SUGGESTIONS:
[Provide specific improvements]
- Step 1: [description]
- Step 2: [description]
[etc.]

GENERAL SUGGESTIONS:
- [Suggestion 1]
- [Suggestion 2]
[etc.]

POTENTIAL ISSUES:
- [Issue 1]
- [Issue 2]
[etc.]

BEST PRACTICES:
- [Practice 1]
- [Practice 2]
[etc.]

User Flow to Analyze:
${flowDescription}

Please maintain this exact structure and headers in your response. Be specific and detailed in your analysis.`;

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

    return parseTextFlowAnalysis(response.choices[0]?.message?.content || "");
  } catch (error) {
    console.error("Error in flow analysis:", error);
    throw error;
  }
}

function parseTextFlowAnalysis(content: string): FlowAnalysis {
  const analysis: FlowAnalysis = {
    currentFlow: [],
    improvedFlow: [],
    generalSuggestions: [],
    potentialIssues: [],
    bestPractices: [],
  };

  try {
    // Split content by main sections
    const sections = content.split(/[A-Z\s]+:/);
    const sectionNames = content.match(/[A-Z\s]+:/g) || [];

    sectionNames.forEach((sectionName, index) => {
      const sectionContent = sections[index + 1]?.trim() || "";
      const points = sectionContent
        .split("\n")
        .map((line) => line.replace(/^[-•●]\s*/, "").trim())
        .filter((line) => line.length > 0);

      switch (sectionName.trim().replace(":", "").toLowerCase()) {
        case "current flow analysis":
          analysis.currentFlow = points.map((point) => ({ step: point }));
          break;
        case "improved flow suggestions":
          analysis.improvedFlow = points.map((point) => ({ step: point }));
          break;
        case "general suggestions":
          analysis.generalSuggestions = points;
          break;
        case "potential issues":
          analysis.potentialIssues = points;
          break;
        case "best practices":
          analysis.bestPractices = points;
          break;
      }
    });

    return analysis;
  } catch (error) {
    console.error("Error parsing text flow analysis:", error);
    throw error;
  }
}

function parseFlowAnalysis(
  content: string,
  isImageAnalysis = false,
): FlowAnalysis {
  const analysis: FlowAnalysis = {
    currentFlow: [],
    improvedFlow: [],
    generalSuggestions: [],
    potentialIssues: [],
    bestPractices: [],
    competitorInsights: isImageAnalysis ? [] : undefined,
  };

  try {
    // Split content by main sections
    const sections = content.split(/[A-Z\s]+:/);
    const sectionNames = content.match(/[A-Z\s]+:/g) || [];

    sectionNames.forEach((sectionName, index) => {
      const sectionContent = sections[index + 1]?.trim() || "";
      const points = sectionContent
        .split("\n")
        .map((line) => line.replace(/^[-•●]\s*/, "").trim())
        .filter((line) => line.length > 0 && !line.toLowerCase().includes(":"));

      switch (sectionName.trim().replace(":", "").toLowerCase()) {
        case "current flow analysis":
          analysis.currentFlow = points.map((point) => ({
            step: cleanText(point),
          }));
          break;
        case "improved flow suggestions":
          analysis.improvedFlow = points.map((point) => ({
            step: cleanText(point),
          }));
          break;
        case "general suggestions":
          analysis.generalSuggestions = points.map(cleanText);
          break;
        case "potential issues":
          analysis.potentialIssues = points.map(cleanText);
          break;
        case "best practices":
          analysis.bestPractices = points.map(cleanText);
          break;
        case "competitor insights":
          if (isImageAnalysis) {
            analysis.competitorInsights = points.map(cleanText);
          }
          break;
      }
    });

    // Ensure sections have content
    if (analysis.currentFlow.length === 0) {
      analysis.currentFlow = [{ step: "Flow analysis not available" }];
    }
    if (analysis.improvedFlow.length === 0) {
      analysis.improvedFlow = [
        { step: "Improvement suggestions not available" },
      ];
    }
    if (analysis.generalSuggestions.length === 0) {
      analysis.generalSuggestions = ["No general suggestions available"];
    }
    if (analysis.potentialIssues.length === 0) {
      analysis.potentialIssues = ["No specific issues identified"];
    }
    if (analysis.bestPractices.length === 0) {
      analysis.bestPractices = ["Best practices analysis not available"];
    }
    if (
      isImageAnalysis &&
      (!analysis.competitorInsights || analysis.competitorInsights.length === 0)
    ) {
      analysis.competitorInsights = ["No competitor insights available"];
    }

    return analysis;
  } catch (error) {
    console.error("Error parsing flow analysis:", error);
    throw new Error("Failed to parse flow analysis");
  }
}

function cleanText(text: string): string {
  return text
    .replace(/^\d+\.\s*/, "") // Remove numbered lists
    .replace(/^[-•●]\s*/, "") // Remove bullet points
    .replace(/\*\*/g, "") // Remove markdown bold
    .replace(/\*/g, "") // Remove markdown italic
    .replace(/`/g, "") // Remove code blocks
    .replace(/###/g, "") // Remove markdown headers
    .replace(/\\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Normalize spaces
    .trim();
}
