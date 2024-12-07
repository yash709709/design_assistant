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
