import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export interface ComparisonAnalysis {
  designComparison: string[];
  strengthsWeaknesses: {
    yourDesign: {
      strengths: string[];
      weaknesses: string[];
    };
    competitorDesign: {
      strengths: string[];
      weaknesses: string[];
    };
  };
  abTestSuggestions: {
    designer: string[];
    productManager: string[];
  };
  recommendations: string[];
}

export async function compareDesigns(
  yourDesignBase64: string,
  competitorDesignBase64: string,
): Promise<ComparisonAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `As an expert UI/UX designer and Product Strategy consultant, analyze these two designs (first is client's, second is competitor's) and provide a detailed comparison following exactly this structure:

DESIGN COMPARISON
- Compare overall layouts and visual hierarchies
- Analyze user flows and interaction patterns
- Evaluate content organization and readability
- Compare visual elements (typography, colors, spacing)
- Assess responsive design considerations

YOUR DESIGN STRENGTHS
- List key effective elements
- Note successful implementations
- Highlight competitive advantages
- Identify user experience wins

YOUR DESIGN WEAKNESSES
- Identify improvement areas
- Note usability concerns
- List missing features
- Point out potential friction points

COMPETITOR DESIGN STRENGTHS
- List effective patterns
- Note successful approaches
- Identify innovative features
- Highlight user experience advantages

COMPETITOR DESIGN WEAKNESSES
- Identify usability issues
- Note design inconsistencies
- List missing opportunities
- Point out areas for improvement

DESIGNER A/B TEST SUGGESTIONS
- Suggest specific UI elements to test
- Propose layout variations
- List interaction pattern experiments
- Include clear test hypotheses

PRODUCT MANAGER A/B TEST SUGGESTIONS
- Suggest feature experiments
- Propose flow optimizations
- List conversion tests
- Include business impact hypotheses

RECOMMENDATIONS
- Provide specific improvements
- Suggest priority changes
- List actionable steps
- Include implementation considerations

Please maintain these exact section headers and provide detailed, specific feedback based on the actual designs shown.`;

    console.log("Sending request to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: yourDesignBase64 },
            },
            {
              type: "image_url",
              image_url: { url: competitorDesignBase64 },
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("No content in OpenAI response");
    }

    console.log("Received response from OpenAI");
    return parseComparisonResponse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error in design comparison:", error);
    throw error;
  }
}

function parseComparisonResponse(content: string): ComparisonAnalysis {
  console.log("Raw content to parse:", content);
  console.log("Starting to parse response");

  const analysis: ComparisonAnalysis = {
    designComparison: [],
    strengthsWeaknesses: {
      yourDesign: {
        strengths: [],
        weaknesses: [],
      },
      competitorDesign: {
        strengths: [],
        weaknesses: [],
      },
    },
    abTestSuggestions: {
      designer: [],
      productManager: [],
    },
    recommendations: [],
  };

  try {
    // Split content into sections using a more flexible pattern
    const sections = content.split(
      /(?=DESIGN COMPARISON|YOUR DESIGN STRENGTHS|YOUR DESIGN WEAKNESSES|COMPETITOR DESIGN STRENGTHS|COMPETITOR DESIGN WEAKNESSES|DESIGNER A\/B TEST|PRODUCT MANAGER A\/B TEST|RECOMMENDATIONS)/i,
    );

    sections.forEach((section) => {
      const cleanSection = section.trim();
      if (!cleanSection) return;

      const lines = cleanSection
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      const sectionHeader = lines[0].toUpperCase();
      const points = lines
        .slice(1)
        .map((line) => cleanText(line))
        .filter((line) => line.length > 0);

      console.log("Processing section:", sectionHeader);
      console.log("Found points:", points);

      if (sectionHeader.includes("DESIGN COMPARISON")) {
        analysis.designComparison = points;
      } else if (sectionHeader.includes("YOUR DESIGN STRENGTHS")) {
        analysis.strengthsWeaknesses.yourDesign.strengths = points;
      } else if (sectionHeader.includes("YOUR DESIGN WEAKNESSES")) {
        analysis.strengthsWeaknesses.yourDesign.weaknesses = points;
      } else if (sectionHeader.includes("COMPETITOR DESIGN STRENGTHS")) {
        analysis.strengthsWeaknesses.competitorDesign.strengths = points;
      } else if (sectionHeader.includes("COMPETITOR DESIGN WEAKNESSES")) {
        analysis.strengthsWeaknesses.competitorDesign.weaknesses = points;
      } else if (sectionHeader.includes("DESIGNER A/B TEST")) {
        analysis.abTestSuggestions.designer = points;
      } else if (sectionHeader.includes("PRODUCT MANAGER A/B TEST")) {
        analysis.abTestSuggestions.productManager = points;
      } else if (sectionHeader.includes("RECOMMENDATIONS")) {
        analysis.recommendations = points;
      }
    });

    console.log("Final parsed analysis:", JSON.stringify(analysis, null, 2));
    return analysis;
  } catch (error) {
    console.error("Error parsing comparison response:", error);
    console.error("Content that failed:", content);
    throw error;
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
