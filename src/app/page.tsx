"use client";
import { useState } from "react";
import FileUpload from "@/components/ui/FileUpload";
import AnalysisResult from "@/components/design-review/AnalysisResult";
import type { DesignAnalysis } from "@/lib/api/openai";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DesignAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setIsAnalyzing(true);
      setError(null);

      // Convert file to base64
      const base64 = await fileToBase64(file);

      console.log("Sending request to API...");

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
          }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        const data = await response.json();

        if (!data.analysis) {
          throw new Error("No analysis data received");
        }

        setAnalysis(data.analysis);
      } catch (fetchError) {
        if (
          fetchError instanceof TypeError &&
          fetchError.message === "Failed to fetch"
        ) {
          throw new Error(
            "Network error: Could not connect to the server. Please try again.",
          );
        }
        throw fetchError;
      }
    } catch (err) {
      console.error("Error during analysis:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to analyze design. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Design Review Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Upload your design files to get AI-powered feedback on
            accessibility, color contrast, and design principles.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={isAnalyzing}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
        </div>

        <AnalysisResult analysis={analysis} isLoading={isAnalyzing} />
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
