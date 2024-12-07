"use client";
import { useState } from "react";
import FeatureToggle from "@/components/ui/FeatureToggle";
import FlowInput from "@/components/flows/FlowInput";
import FlowResult from "@/components/flows/FlowResult";
import type { FlowAnalysis } from "@/types/flows";

export default function FlowsPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FlowAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"text" | "image">("text");

  const handleTextFlowSubmit = async (flowDescription: string) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const response = await fetch("/api/analyze-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flowDescription,
          mode: "text",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze flow");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze flow");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageFlowSubmit = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      const base64 = await fileToBase64(file);

      const response = await fetch("/api/analyze-flow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          mode: "image",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze flow");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze flow");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            User Flow Analysis
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimize your user flows with AI-powered suggestions and insights.
          </p>
        </div>

        <FeatureToggle />

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Analyze User Flow
            </h2>
            <p className="text-gray-600 mb-4">
              Input your user flow or upload competitor flow screenshots for
              analysis and improvement suggestions.
            </p>

            {/* Mode Toggle */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={() => setInputMode("text")}
                className={`px-4 py-2 rounded-md ${
                  inputMode === "text"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Text Input
              </button>
              <button
                onClick={() => setInputMode("image")}
                className={`px-4 py-2 rounded-md ${
                  inputMode === "image"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Image Upload
              </button>
            </div>

            <FlowInput
              mode={inputMode}
              onTextSubmit={handleTextFlowSubmit}
              onImageSubmit={handleImageFlowSubmit}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <FlowResult analysis={analysis} isLoading={isAnalyzing} />
      </div>
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
