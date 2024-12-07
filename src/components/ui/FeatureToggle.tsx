"use client";
import { usePathname, useRouter } from "next/navigation";

export default function FeatureToggle() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="bg-gray-100 p-1 rounded-lg flex">
        <button
          onClick={() => router.push("/")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === "/"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Single Analysis
        </button>
        <button
          onClick={() => router.push("/compare")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === "/compare"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          Compare Designs
        </button>
        <button
          onClick={() => router.push("/flows")}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            pathname === "/flows"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-700 hover:text-gray-900"
          }`}
        >
          User Flows
        </button>
      </div>
    </div>
  );
}
