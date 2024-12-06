"use client";
import type { DesignAnalysis } from "@/lib/api/openai";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface AnalysisResultProps {
  analysis: DesignAnalysis | null;
  isLoading: boolean;
}

export default function AnalysisResult({
  analysis,
  isLoading,
}: AnalysisResultProps) {
  if (isLoading) {
    return (
      <div className="mt-8 p-8 bg-white rounded-lg shadow text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Analyzing your design...</p>
      </div>
    );
  }

  // ... rest of your component remains the same
}
