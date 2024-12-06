"use client";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  LightBulbIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import type { DesignAnalysis } from "@/lib/api/openai";
import classNames from "classnames";

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
      <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded-full w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                <div className="h-3 bg-gray-200 rounded-full w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const sections = [
    {
      title: "Accessibility",
      icon: CheckCircleIcon,
      items: analysis.accessibility,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Color Contrast",
      icon: SwatchIcon,
      items: analysis.colorContrast,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Design Principles",
      icon: ExclamationCircleIcon,
      items: analysis.designPrinciples,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Recommendations",
      icon: LightBulbIcon,
      items: analysis.recommendations,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
  ];

  return (
    <div className="mt-8 space-y-6 w-full max-w-4xl">
      {sections.map((section) => (
        <div
          key={section.title}
          className={classNames(
            "p-6 rounded-lg border",
            section.bgColor,
            section.borderColor,
          )}
        >
          <div className="flex items-center gap-2 mb-4">
            <section.icon className={classNames("w-6 h-6", section.color)} />
            <h2 className={classNames("text-xl font-semibold", section.color)}>
              {section.title}
            </h2>
          </div>
          <ul className="space-y-3">
            {section.items.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
