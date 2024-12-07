export interface ABTest {
  name: string;
  hypothesis: string;
  metrics: string[];
  impact: "High" | "Medium" | "Low";
  complexity: "High" | "Medium" | "Low";
  priority: "High" | "Medium" | "Low";
}

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
