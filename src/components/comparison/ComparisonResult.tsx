"use client";
import { ComparisonAnalysis } from "@/lib/api/openai-compare";
import {
  ChartBarIcon,
  BeakerIcon,
  CheckCircleIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ComparisonResultProps {
  analysis: ComparisonAnalysis | null;
  isLoading: boolean;
}

export default function ComparisonResult({
  analysis,
  isLoading,
}: ComparisonResultProps) {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-lg p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8">
      {/* Design Comparison Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Design Comparison
          </h2>
        </div>
        <div className="space-y-4">
          {analysis.designComparison?.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <span className="text-gray-700">{point}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Strengths & Weaknesses Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <BeakerIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Strengths & Weaknesses
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Design */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Your Design</h3>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-700 font-medium mb-2">Strengths</h4>
                <ul className="space-y-2">
                  {analysis.strengthsWeaknesses?.yourDesign?.strengths?.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-red-700 font-medium mb-2">Weaknesses</h4>
                <ul className="space-y-2">
                  {analysis.strengthsWeaknesses?.yourDesign?.weaknesses?.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Competitor's Design */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">
              Competitor&apos;s Design
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-700 font-medium mb-2">Strengths</h4>
                <ul className="space-y-2">
                  {analysis.strengthsWeaknesses?.competitorDesign?.strengths?.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                        <span className="text-gray-700">{strength}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-red-700 font-medium mb-2">Weaknesses</h4>
                <ul className="space-y-2">
                  {analysis.strengthsWeaknesses?.competitorDesign?.weaknesses?.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
                        <span className="text-gray-700">{weakness}</span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A/B Test Suggestions Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <LightBulbIcon className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            A/B Test Suggestions
          </h2>
        </div>
        <div className="space-y-8">
          {/* Designer's Perspective */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Designer&apos;s Perspective
            </h3>
            <ul className="space-y-3">
              {analysis.abTestSuggestions?.designer?.map(
                (suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
          {/* Product Manager's Perspective */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              Product Manager&apos;s Perspective
            </h3>
            <ul className="space-y-3">
              {analysis.abTestSuggestions?.productManager?.map(
                (suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Recommendations Section */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Recommendations
          </h2>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations?.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
