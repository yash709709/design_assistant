"use client";
import { FlowAnalysis } from "@/types/flows";
import {
  ArrowPathIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

interface FlowResultProps {
  analysis: FlowAnalysis | null;
  isLoading: boolean;
}

export default function FlowResult({ analysis, isLoading }: FlowResultProps) {
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
      {/* Current Flow Analysis */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <ChartBarIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Current Flow Analysis
          </h2>
        </div>
        <div className="space-y-4">
          {analysis.currentFlow.map((step, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4">
              <p className="font-medium text-gray-900 mb-2">
                Step {index + 1}: {step.step}
              </p>
              {step.improvements && step.improvements.length > 0 && (
                <div className="ml-4 mt-2">
                  <p className="text-sm text-gray-600 mb-1">
                    Potential Improvements:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {step.improvements.map((improvement, i) => (
                      <li key={i} className="text-gray-600 text-sm">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {step.rationale && (
                <p className="text-sm text-gray-500 mt-1">{step.rationale}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Improved Flow */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <ArrowPathIcon className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Improved Flow
          </h2>
        </div>
        <div className="space-y-4">
          {analysis.improvedFlow.map((step, index) => (
            <div key={index} className="border-l-4 border-green-200 pl-4">
              <p className="font-medium text-gray-900">{step.step}</p>
              {step.rationale && (
                <p className="text-sm text-gray-500 mt-1">{step.rationale}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* General Suggestions */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <LightBulbIcon className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            General Suggestions
          </h2>
        </div>
        <ul className="space-y-3">
          {analysis.generalSuggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0" />
              <span className="text-gray-700">{suggestion}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Potential Issues */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Potential Issues
          </h2>
        </div>
        <ul className="space-y-3">
          {analysis.potentialIssues.map((issue, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
              <span className="text-gray-700">{issue}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Best Practices */}
      <section className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircleIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Best Practices
          </h2>
        </div>
        <ul className="space-y-3">
          {analysis.bestPractices.map((practice, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
              <span className="text-gray-700">{practice}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Competitor Insights (only for image analysis) */}
      {analysis.competitorInsights && (
        <section className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <ChartBarIcon className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Competitor Insights
            </h2>
          </div>
          <ul className="space-y-3">
            {analysis.competitorInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
