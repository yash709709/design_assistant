"use client";
import { useState } from "react";
import ComparisonUpload from "@/components/comparison/ComparisonUpload";
import ComparisonResult from "@/components/comparison/ComparisonResult";
import FeatureToggle from "@/components/ui/FeatureToggle";
import type { ComparisonAnalysis } from "@/types/comparison";

export default function ComparePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ComparisonAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleComparisonUpload = async (
    yourDesign: File,
    competitorDesign: File,
  ) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      console.log("Starting comparison upload...");

      // Convert files to base64
      const yourDesignBase64 = await fileToBase64(yourDesign);
      const competitorDesignBase64 = await fileToBase64(competitorDesign);

      console.log("Files converted to base64, sending to API...");

      try {
        const response = await fetch("/api/compare", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            yourDesign: yourDesignBase64,
            competitorDesign: competitorDesignBase64,
          }),
        });

        console.log("Response status:", response.status);

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Server returned non-JSON response");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to analyze designs");
        }

        console.log("Analysis data received");

        if (!data.analysis) {
          throw new Error("No analysis data received");
        }

        setAnalysis(data.analysis);
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        if (
          fetchError instanceof TypeError &&
          fetchError.message === "Failed to fetch"
        ) {
          throw new Error("Network error: Could not connect to the server");
        }
        throw fetchError;
      }
    } catch (err) {
      console.error("Error during comparison:", err);
      setError(
        err instanceof Error ? err.message : "Failed to analyze designs",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design Review Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare your design with a competitor's design to get detailed
            insights and improvement suggestions.
          </p>
        </div>

        <FeatureToggle />

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Design Comparison Analysis
            </h2>
            <p className="text-gray-600">
              Upload your design and a competitor's design to get a detailed
              comparison and A/B testing suggestions.
            </p>
          </div>

          <ComparisonUpload
            onUpload={handleComparisonUpload}
            isUploading={isAnalyzing}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <ComparisonResult analysis={analysis} isLoading={isAnalyzing} />
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
