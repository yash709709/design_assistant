"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface FlowInputProps {
  mode: "text" | "image";
  onTextSubmit: (text: string) => void;
  onImageSubmit: (file: File) => void;
  isAnalyzing: boolean;
}

export default function FlowInput({
  mode,
  onTextSubmit,
  onImageSubmit,
  isAnalyzing,
}: FlowInputProps) {
  const [flowText, setFlowText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setPreview(URL.createObjectURL(file));
        onImageSubmit(file);
      }
    },
  });

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flowText.trim()) {
      onTextSubmit(flowText.trim());
    }
  };

  if (mode === "image") {
    return (
      <div>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
            ${isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <div className="relative w-full h-48">
              <img
                src={preview}
                alt="Flow preview"
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                {isDragActive
                  ? "Drop the screenshots here"
                  : "Drag and drop competitor flow screenshots, or click to select"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports PNG, JPG, JPEG
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleTextSubmit}>
      <div className="space-y-4">
        <textarea
          value={flowText}
          onChange={(e) => setFlowText(e.target.value)}
          placeholder="Describe your user flow step by step..."
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isAnalyzing}
        />
        <button
          type="submit"
          disabled={isAnalyzing || !flowText.trim()}
          className={`w-full px-4 py-2 text-white rounded-md transition-colors
            ${
              isAnalyzing || !flowText.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Flow"}
        </button>
      </div>
    </form>
  );
}
