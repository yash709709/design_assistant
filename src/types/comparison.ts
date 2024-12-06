export interface ABTest {
  name: string;
  hypothesis: string;
  metrics: string[];
  impact: "High" | "Medium" | "Low";
  complexity: "High" | "Medium" | "Low";
  priority: "High" | "Medium" | "Low";
}

export interface ComparisonAnalysis {
  designComparison: string[]; // Changed to simple string array
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
