"use client";
import { ComparisonAnalysis, ABTest } from "@/types/comparison";
import {
  ChartBarIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  ChartPieIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ComparisonResultProps {
  analysis: ComparisonAnalysis | null;
  isLoading: boolean;
}

const PriorityBadge = ({
  priority,
}: {
  priority: "High" | "Medium" | "Low";
}) => {
  const colors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority]}`}
    >
      {priority}
    </span>
  );
};

const ComplexityBadge = ({
  complexity,
}: {
  complexity: "High" | "Medium" | "Low";
}) => {
  const colors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[complexity]}`}
    >
      Complexity: {complexity}
    </span>
  );
};

function ABTestCard({ test }: { test: ABTest }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-lg font-semibold text-gray-900">
          {cleanText(test.name)}
        </h4>
        <PriorityBadge priority={test.priority} />
      </div>
      <p className="text-gray-600 mb-3">{cleanText(test.hypothesis)}</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <ChartPieIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Success Metrics:</span>
        </div>
        <ul className="list-disc list-inside text-sm text-gray-600 ml-6">
          {test.metrics.map((metric, index) => (
            <li key={index}>{cleanText(metric)}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <ComplexityBadge complexity={test.complexity} />
        <span
          className={classNames("text-xs font-medium px-2 py-1 rounded", {
            "bg-green-100 text-green-800": test.impact === "High",
            "bg-yellow-100 text-yellow-800": test.impact === "Medium",
            "bg-gray-100 text-gray-800": test.impact === "Low",
          })}
        >
          Impact: {test.impact}
        </span>
      </div>
    </div>
  );
}

function cleanText(text: string): string {
  return text
    .replace(/\*\*/g, "") // Remove ** markdown
    .replace(/^\s*[-•]\s*/, "") // Remove bullet points
    .replace(/^[-–—]\s*/, "") // Remove different types of dashes
    .replace(/\\n/g, " ") // Remove explicit newline characters
    .replace(/^#{1,6}\s*/, "") // Remove markdown headers (###)
    .replace(/###/g, "") // Remove any remaining ###
    .trim();
}
function formatDesignComparisonText(text: string): {
  title: boolean;
  content: string;
} {
  // List of titles we want to make bold
  const mainTitles = [
    "Visual Hierarchy and Layout Structure",
    "User Flows and Interaction Patterns",
    "Content Structure and Readability",
    "Visual Elements",
    "Responsive Design Considerations",
    "Key UI Patterns and Components",
  ];
  // Clean the text by removing ** and bullet points
  const cleanedText = cleanText(text);
  // Check if the current text is a main title
  const isTitle = mainTitles.some((title) =>
    cleanedText.toLowerCase().includes(title.toLowerCase()),
  );

  return {
    title: isTitle,
    content: cleanedText,
  };
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
        <div className="space-y-6">
          {analysis.designComparison.map((point, index) => {
            const { title, content } = formatDesignComparisonText(point);

            return title ? (
              // Render title with different styling
              <h3
                key={index}
                className="text-lg font-semibold text-gray-900 mt-4 mb-2"
              >
                {content}
              </h3>
            ) : (
              // Render regular point
              <div key={index} className="flex items-start gap-3 ml-4">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-gray-700 leading-relaxed">{content}</span>
              </div>
            );
          })}
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Your Design */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Your Design</h3>
            <div className="space-y-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-700 font-medium mb-4">Strengths</h4>
                <ul className="space-y-3">
                  {analysis.strengthsWeaknesses.yourDesign.strengths.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {cleanText(strength)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              {/* Weaknesses */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-red-700 font-medium mb-4">Weaknesses</h4>
                <ul className="space-y-3">
                  {analysis.strengthsWeaknesses.yourDesign.weaknesses.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {cleanText(weakness)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Competitor's Design */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Competitor&apos;s Design
            </h3>
            <div className="space-y-6">
              {/* Strengths */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-green-700 font-medium mb-4">Strengths</h4>
                <ul className="space-y-3">
                  {analysis.strengthsWeaknesses.yourDesign.strengths.map(
                    (strength, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {cleanText(strength)}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              {/* Weaknesses */}
              <div className="bg-red-50 rounded-lg p-4">
                <h4 className="text-red-700 font-medium mb-4">Weaknesses</h4>
                <ul className="space-y-3">
                  {analysis.strengthsWeaknesses.yourDesign.weaknesses.map(
                    (weakness, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                        <span className="text-gray-700 leading-relaxed">
                          {cleanText(weakness)}
                        </span>
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Designer&apos;s Perspective
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.abTestSuggestions.designer.map((test, index) => (
                <ABTestCard key={index} test={test} />
              ))}
            </div>
          </div>
          {/* Product Manager's Perspective */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Product Manager&apos;s Perspective
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.abTestSuggestions.productManager.map((test, index) => (
                <ABTestCard key={index} test={test} />
              ))}
            </div>
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
        <div className="space-y-8">
          {/* Design Improvements */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Design Improvements
            </h3>
            <div className="space-y-4">
              {analysis.recommendations.design.map((rec, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <PriorityBadge priority={rec.priority} />
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {rec.timeline}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {rec.improvements.map((improvement, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                        <span>{cleanText(improvement)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Product Strategy
            </h3>
            <div className="space-y-4">
              {analysis.recommendations.strategy.map((strat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      Impact: {strat.impact}
                    </span>
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                      Effort: {strat.effort}
                    </span>
                  </div>
                  <ul className="space-y-3">
                    {strat.suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-gray-600"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                        <span>{cleanText(suggestion)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Implementation Roadmap
            </h3>
            <div className="space-y-6">
              {analysis.recommendations.implementation.map((impl, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <span className="text-lg font-medium text-blue-600">
                      {impl.phase}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-700 font-medium mb-3">Steps:</h4>
                      <ul className="space-y-3">
                        {impl.steps.map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-gray-600"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                            <span>{cleanText(step)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-gray-700 font-medium mb-3">
                        Required Resources:
                      </h4>
                      <ul className="space-y-2 pl-4">
                        {impl.resources.map((resource, i) => (
                          <li key={i} className="text-gray-600 list-disc">
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
