import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  console.error("OpenAI API Key is missing in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface DesignAnalysis {
  accessibility: string[];
  colorContrast: string[];
  designPrinciples: string[];
  recommendations: string[];
}

export async function analyzeDesign(
  imageBase64: string,
  isConcise: boolean = false,
) {
  console.log("analyzeDesign: Starting analysis", { isConcise });

  if (!process.env.OPENAI_API_KEY) {
    console.error("OpenAI API key missing in analyzeDesign");
    throw new Error("OpenAI API key is not configured");
  }

  try {
    // Enhanced detailed prompt with more context and specific requirements
    const detailedPrompt = `As an expert UI/UX designer, thoroughly analyze this design image and provide detailed, contextual feedback. Focus on specific elements in the image and provide actionable insights in exactly this format:

1. Accessibility
- Evaluate specific text elements, their sizes, and readability in the context shown
- Analyze the interactive elements and their accessibility considerations
- Assess the information hierarchy and how it affects different user groups
- Comment on spacing and layout from an accessibility perspective
- Examine any patterns or repetitive elements that might affect usability

2. Color Contrast
- Analyze specific color combinations present in the design
- Evaluate contrast ratios between text and background elements
- Assess the effectiveness of color usage for different visual elements
- Identify any potential color accessibility issues
- Comment on the color hierarchy and its impact on usability

3. Design Principles
- Evaluate the layout structure and how it guides user attention
- Analyze the visual hierarchy of specific elements
- Assess the consistency of design elements and patterns
- Comment on the use of whitespace and its effectiveness
- Evaluate the balance and alignment of elements shown

4. Recommendations
- Provide specific, actionable improvements for the identified issues
- Suggest alternative approaches for problematic design elements
- Recommend specific color adjustments where needed
- Propose layout modifications that could enhance usability
- Suggest specific accessibility improvements based on the analysis`;

    // Enhanced concise prompt that still maintains context
    const concisePrompt = `As an expert UI/UX designer, provide brief but specific feedback about this design image in exactly this format:

1. Accessibility
- Provide one critical observation about the accessibility of specific elements shown

2. Color Contrast
- Highlight the most important color contrast consideration in this specific design

3. Design Principles
- Identify the most significant design principle impact in this layout

4. Recommendations
- Give one specific, contextual improvement suggestion based on the most critical issue`;

    console.log("Sending request to OpenAI...");

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: isConcise ? concisePrompt : detailedPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
              },
            },
          ],
        },
      ],
      max_tokens: isConcise ? 500 : 1500,
      temperature: 0.7,
    });

    console.log("Received response from OpenAI");

    if (!response.choices[0]?.message?.content) {
      throw new Error("No content in OpenAI response");
    }

    console.log("Raw OpenAI response:", response.choices[0].message.content);

    const analysis = parseAnalysisResponse(response.choices[0].message.content);
    console.log("Parsed analysis:", analysis);

    return analysis;
  } catch (error) {
    console.error("Error in OpenAI analysis:", error);
    throw error;
  }
}

function parseAnalysisResponse(content: string): DesignAnalysis {
  console.log("Starting to parse response:", content);

  const analysis: DesignAnalysis = {
    accessibility: [],
    colorContrast: [],
    designPrinciples: [],
    recommendations: [],
  };

  try {
    // Split content by numbered sections
    const sections = content.split(/\d\.\s+/);
    console.log("Split sections:", sections);

    if (sections.length > 1) {
      const processSection = (text: string): string[] => {
        // Split by newlines and process each line
        const lines = text
          .split("\n")
          .map((line) =>
            line
              .trim()
              // Remove all markdown formatting
              .replace(/\*\*/g, "") // Remove bold
              .replace(/\*/g, "") // Remove italics
              .replace(/`/g, "") // Remove code blocks
              .replace(/#{1,6}\s/g, "") // Remove headers
              .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links but keep text
              .replace(/^[-•●]\s*/, "") // Remove different types of bullet points
              .replace(/\\n/g, "") // Remove literal newline characters
              .trim(),
          )
          .filter((line) => {
            // Keep lines that have content and aren't section headers
            return (
              line.length > 0 &&
              !line.match(
                /^(Accessibility|Color Contrast|Design Principles|Recommendations):?$/i,
              ) &&
              !line.match(/^[\d.]+\s*$/)
            ); // Remove standalone numbers
          });

        return lines;
      };

      // Process each section
      analysis.accessibility = processSection(sections[1]);
      analysis.colorContrast = processSection(sections[2]);
      analysis.designPrinciples = processSection(sections[3]);
      analysis.recommendations = processSection(sections[4]);

      // Additional cleanup pass to catch any remaining formatting
      const cleanupText = (items: string[]) => {
        return items
          .map((item) =>
            item
              .replace(/^\s*[-•●]\s*/, "") // Remove any remaining bullet points
              .replace(/\*\*/g, "") // Remove any remaining bold
              .replace(/\s+/g, " ") // Normalize spaces
              .trim(),
          )
          .filter((item) => item.length > 0);
      };

      analysis.accessibility = cleanupText(analysis.accessibility);
      analysis.colorContrast = cleanupText(analysis.colorContrast);
      analysis.designPrinciples = cleanupText(analysis.designPrinciples);
      analysis.recommendations = cleanupText(analysis.recommendations);

      console.log("Processed analysis:", analysis);
    }

    // Ensure each section has at least one item with more specific default messages
    if (analysis.accessibility.length === 0) {
      analysis.accessibility = [
        "Unable to analyze accessibility features in the provided design",
      ];
    }
    if (analysis.colorContrast.length === 0) {
      analysis.colorContrast = [
        "Unable to analyze color contrast in the provided design",
      ];
    }
    if (analysis.designPrinciples.length === 0) {
      analysis.designPrinciples = [
        "Unable to analyze design principles in the provided design",
      ];
    }
    if (analysis.recommendations.length === 0) {
      analysis.recommendations = [
        "Unable to generate specific recommendations for the provided design",
      ];
    }

    return analysis;
  } catch (error) {
    console.error("Error parsing response:", error);
    console.error("Content that failed to parse:", content);
    throw new Error("Failed to parse analysis response");
  }
}
