"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface FlowInputProps {
  mode: "text" | "image";
  onTextSubmit: (text: string) => void;
  onImageSubmit: (file: File) => void;
  isAnalyzing: boolean;
}

function ImageDropzone({
  onFileDrop,
  isDisabled,
  preview,
  onRemove,
}: {
  onFileDrop: (file: File) => void;
  isDisabled: boolean;
  preview: string | null;
  onRemove: () => void;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0]);
      }
    },
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: isDisabled,
  });

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full h-64">
          <Image
            src={preview}
            alt="Flow preview"
            fill
            className="object-contain rounded-lg"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={classNames(
            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
            {
              "border-blue-400 bg-blue-50": isDragActive,
              "border-gray-300 hover:border-gray-400": !isDragActive,
              "cursor-pointer": !isDisabled,
              "cursor-not-allowed opacity-75": isDisabled,
            },
          )}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <p className="text-gray-600">
              {isDragActive
                ? "Drop the screenshots here"
                : "Drag and drop flow screenshots, or click to select"}
            </p>
            <p className="text-sm text-gray-500">Supports PNG, JPG, JPEG</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FlowInput({
  mode,
  onTextSubmit,
  onImageSubmit,
  isAnalyzing,
}: FlowInputProps) {
  const [flowText, setFlowText] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (flowText.trim()) {
      onTextSubmit(flowText.trim());
    }
  };

  const handleImageSubmit = () => {
    if (selectedFile) {
      onImageSubmit(selectedFile);
    }
  };

  if (mode === "text") {
    return (
      <form onSubmit={handleTextSubmit} className="space-y-4">
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
          className={classNames(
            "w-full px-4 py-2 rounded-md font-medium transition-colors",
            {
              "bg-blue-600 text-white hover:bg-blue-700":
                !isAnalyzing && flowText.trim(),
              "bg-gray-300 text-gray-500 cursor-not-allowed":
                isAnalyzing || !flowText.trim(),
            },
          )}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Flow"}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      <ImageDropzone
        onFileDrop={handleFileDrop}
        isDisabled={isAnalyzing}
        preview={preview}
        onRemove={handleRemoveFile}
      />

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <button
        onClick={handleImageSubmit}
        disabled={isAnalyzing || !selectedFile}
        className={classNames(
          "w-full px-4 py-2 rounded-md font-medium transition-colors",
          {
            "bg-blue-600 text-white hover:bg-blue-700":
              !isAnalyzing && selectedFile,
            "bg-gray-300 text-gray-500 cursor-not-allowed":
              isAnalyzing || !selectedFile,
          },
        )}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Flow"}
      </button>
    </div>
  );
}
