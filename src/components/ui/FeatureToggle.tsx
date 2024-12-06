"use client";
import { usePathname, useRouter } from "next/navigation";

export default function FeatureToggle() {
  const router = useRouter();
  const pathname = usePathname();

  const isComparePage = pathname === "/compare";

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <button
          onClick={() => router.push("/")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            !isComparePage
              ? "bg-white text-gray-900 shadow"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Single Design Analysis
        </button>
        <button
          onClick={() => router.push("/compare")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            isComparePage
              ? "bg-white text-gray-900 shadow"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Design Comparison
        </button>
      </div>
    </div>
  );
}
