import OpenAI from "openai";

interface ImplementationPhase {
  phase: "Phase 1" | "Phase 2" | "Phase 3";
  steps: string[];
  resources: string[];
}
// Define the types here instead of importing to avoid conflicts
interface ABTest {
  name: string;
  hypothesis: string;
  metrics: string[];
  impact: "High" | "Medium" | "Low";
  complexity: "High" | "Medium" | "Low";
  priority: "High" | "Medium" | "Low";
}

interface ComparisonAnalysis {
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
    designer: ABTest[];
    productManager: ABTest[];
  };
  recommendations: {
    design: Array<{
      improvements: string[];
      priority: "High" | "Medium" | "Low";
      timeline: "Short-term" | "Medium-term" | "Long-term";
    }>;
    strategy: Array<{
      suggestions: string[];
      impact: "High" | "Medium" | "Low";
      effort: "High" | "Medium" | "Low";
    }>;
    implementation: Array<{
      steps: string[];
      phase: "Phase 1" | "Phase 2" | "Phase 3";
      resources: string[];
    }>;
  };
}

if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function compareDesigns(
  yourDesignBase64: string,
  competitorDesignBase64: string,
): Promise<ComparisonAnalysis> {
  console.log("compareDesigns: Starting analysis");

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured");
  }

  try {
    const prompt = `As an expert UI/UX designer and Product Strategy consultant, analyze these two designs (first is client's, second is competitor's) and provide a detailed comparison focusing on both design excellence and business impact. Structure your analysis exactly as follows:

1. Design Comparison
- Analyze overall visual hierarchy and layout structure
- Compare user flows and interaction patterns
- Evaluate content structure and readability
- Assess visual elements (typography, colors, spacing)
- Note responsive design considerations
- Analyze key UI patterns and components

2. Strengths & Weaknesses Analysis

Your Design Strengths:
- List key effective design elements
- Note successful implementations
- Highlight competitive advantages

Your Design Weaknesses:
- Identify improvement areas
- Note usability concerns
- List missing key features

Competitor Design Strengths:
- List effective design patterns
- Note successful implementations
- Highlight notable features

Competitor Design Weaknesses:
- Identify usability issues
- Note design inconsistencies
- List potential improvements

3. A/B Test Suggestions

From Designer's Perspective:
[For each test, provide the following structure]
Test Name: [Name]
Hypothesis: [Clear hypothesis statement]
Metrics:
- Key metric 1
- Key metric 2
Impact: [High/Medium/Low]
Complexity: [High/Medium/Low]
Priority: [High/Medium/Low]

From Product Manager's Perspective:
[Follow same structure as designer's tests]

4. Recommendations

Design Improvements:
[For each recommendation]:
- Specific improvement details
- Priority: [High/Medium/Low]
- Timeline: [Short-term/Medium-term/Long-term]

Strategy:
[For each strategy]:
- Detailed suggestion
- Impact: [High/Medium/Low]
- Effort: [High/Medium/Low]

Implementation:
[For each phase]:
- Phase: [Phase 1/Phase 2/Phase 3]
- Implementation steps
- Required resources

Please provide clear, actionable insights without any special formatting or markdown.`;

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
      max_tokens: 4000,
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
    recommendations: {
      design: [],
      strategy: [],
      implementation: [],
    },
  };

  try {
    const sections = content.split(/\d\.\s+/);

    if (sections.length > 1) {
      // Parse Design Comparison
      analysis.designComparison = sections[1]
        .split("\n")
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter((line) => line.length > 0);

      // Parse Strengths & Weaknesses
      const strengthsWeaknessesSection = sections[2];

      const parsePoints = (text: string): string[] => {
        return text
          .split("\n")
          .map((line) => line.replace(/^-\s*/, "").trim())
          .filter((line) => line.length > 0);
      };

      // Extract Your Design sections
      const yourStrengths = strengthsWeaknessesSection.match(
        /Your Design Strengths?:?([\s\S]*?)(?=Your Design Weaknesses?:|$)/i,
      )?.[1];
      const yourWeaknesses = strengthsWeaknessesSection.match(
        /Your Design Weaknesses?:?([\s\S]*?)(?=Competitor Design Strengths?:|$)/i,
      )?.[1];

      // Extract Competitor Design sections
      const competitorStrengths = strengthsWeaknessesSection.match(
        /Competitor Design Strengths?:?([\s\S]*?)(?=Competitor Design Weaknesses?:|$)/i,
      )?.[1];
      const competitorWeaknesses = strengthsWeaknessesSection.match(
        /Competitor Design Weaknesses?:?([\s\S]*?)(?=\d\.|$)/i,
      )?.[1];

      analysis.strengthsWeaknesses = {
        yourDesign: {
          strengths: parsePoints(yourStrengths || ""),
          weaknesses: parsePoints(yourWeaknesses || ""),
        },
        competitorDesign: {
          strengths: parsePoints(competitorStrengths || ""),
          weaknesses: parsePoints(competitorWeaknesses || ""),
        },
      };

      // Parse A/B Test Suggestions
      const abTestSection = sections[3];

      const parseABTests = (text: string): ABTest[] => {
        const tests: ABTest[] = [];
        const testMatches =
          text.match(/Test Name:[\s\S]*?(?=Test Name:|$)/g) || [];

        testMatches.forEach((testMatch) => {
          const name =
            testMatch.match(/Test Name:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || "";
          const hypothesis =
            testMatch
              .match(/Hypothesis:\s*(.*?)(?=\n|Metrics:)/s)?.[1]
              ?.trim() || "";
          const metricsText =
            testMatch.match(/Metrics:([\s\S]*?)(?=Impact:|$)/)?.[1] || "";
          const impact = (testMatch.match(
            /Impact:\s*(High|Medium|Low)/i,
          )?.[1] || "Medium") as "High" | "Medium" | "Low";
          const complexity = (testMatch.match(
            /Complexity:\s*(High|Medium|Low)/i,
          )?.[1] || "Medium") as "High" | "Medium" | "Low";
          const priority = (testMatch.match(
            /Priority:\s*(High|Medium|Low)/i,
          )?.[1] || "Medium") as "High" | "Medium" | "Low";

          const metrics = metricsText
            .split("\n")
            .map((line) => line.replace(/^-\s*/, "").trim())
            .filter((line) => line.length > 0);

          if (name) {
            tests.push({
              name,
              hypothesis,
              metrics,
              impact,
              complexity,
              priority,
            });
          }
        });

        return tests;
      };

      const designerSection =
        abTestSection.match(
          /From Designer's Perspective:([\s\S]*?)(?=From Product Manager's Perspective:|$)/i,
        )?.[1] || "";
      const pmSection =
        abTestSection.match(
          /From Product Manager's Perspective:([\s\S]*?)(?=\d\.|$)/i,
        )?.[1] || "";

      analysis.abTestSuggestions = {
        designer: parseABTests(designerSection),
        productManager: parseABTests(pmSection),
      };

      // Parse Recommendations
      const recommendationsSection = sections[4];

      // Parse Design Improvements
      const designSection =
        recommendationsSection.match(
          /Design Improvements:([\s\S]*?)(?=Strategy:|$)/i,
        )?.[1] || "";
      analysis.recommendations.design = parseRecommendations(designSection);

      // Parse Strategy
      const strategySection =
        recommendationsSection.match(
          /Strategy:([\s\S]*?)(?=Implementation:|$)/i,
        )?.[1] || "";
      analysis.recommendations.strategy = parseStrategy(strategySection);

      // Parse Implementation
      const implementationSection =
        recommendationsSection.match(
          /Implementation:([\s\S]*?)(?=\d\.|$)/i,
        )?.[1] || "";
      analysis.recommendations.implementation = parseImplementation(
        implementationSection,
      );
    }

    return analysis;
  } catch (error) {
    console.error("Error parsing comparison response:", error);
    throw new Error("Failed to parse comparison response");
  }
}

function parseRecommendations(section: string) {
  const recommendations = [];
  const blocks = section.split(/(?=Priority:|Timeline:)/);

  for (let i = 0; i < blocks.length; i += 3) {
    const improvements = blocks[i]
      .split("\n")
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter((line) => line.length > 0);

    const priority = (blocks[i + 1]?.match(
      /Priority:\s*(High|Medium|Low)/i,
    )?.[1] || "Medium") as "High" | "Medium" | "Low";
    const timeline = (blocks[i + 2]?.match(
      /Timeline:\s*(Short-term|Medium-term|Long-term)/i,
    )?.[1] || "Medium-term") as "Short-term" | "Medium-term" | "Long-term";

    if (improvements.length > 0) {
      recommendations.push({
        improvements,
        priority,
        timeline,
      });
    }
  }

  return recommendations;
}

function parseStrategy(section: string) {
  const strategies = [];
  const blocks = section.split(/(?=Impact:|Effort:)/);

  for (let i = 0; i < blocks.length; i += 3) {
    const suggestions = blocks[i]
      .split("\n")
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter((line) => line.length > 0);

    const impact = (blocks[i + 1]?.match(/Impact:\s*(High|Medium|Low)/i)?.[1] ||
      "Medium") as "High" | "Medium" | "Low";
    const effort = (blocks[i + 2]?.match(/Effort:\s*(High|Medium|Low)/i)?.[1] ||
      "Medium") as "High" | "Medium" | "Low";

    if (suggestions.length > 0) {
      strategies.push({
        suggestions,
        impact,
        effort,
      });
    }
  }

  return strategies;
}

function parseImplementation(section: string): ImplementationPhase[] {
  const implementation: ImplementationPhase[] = [];
  const phases = section.split(/Phase \d+:/);

  phases.slice(1).forEach((phase, index) => {
    const steps = phase
      .split("\n")
      .map((line) => line.replace(/^-\s*/, "").trim())
      .filter((line) => line.length > 0);

    const resources =
      phase
        .match(/Required resources:([\s\S]*?)(?=Phase \d+:|$)/i)?.[1]
        ?.split("\n")
        .map((line) => line.replace(/^-\s*/, "").trim())
        .filter((line) => line.length > 0) || [];

    if (steps.length > 0) {
      implementation.push({
        phase: `Phase ${index + 1}` as "Phase 1" | "Phase 2" | "Phase 3",
        steps,
        resources,
      });
    }
  });

  return implementation;
}

export type { ComparisonAnalysis, ABTest, ImplementationPhase };
