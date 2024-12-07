"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ComparisonUploadProps {
  onUpload: (yourDesign: File, competitorDesign: File) => void;
  isUploading: boolean;
}

// Create a separate component for the dropzone
function DesignDropzone({
  onFileDrop,
  label,
  isDisabled,
}: {
  onFileDrop: (file: File) => void;
  label: string;
  isDisabled: boolean;
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
      <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div
        {...getRootProps()}
        className={classNames(
          "relative border-2 border-dashed rounded-lg p-4 transition-colors",
          {
            "border-blue-400 bg-blue-50": isDragActive,
            "border-gray-300 hover:border-gray-400": !isDragActive,
            "cursor-pointer": !isDisabled,
            "cursor-not-allowed opacity-75": isDisabled,
          },
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="text-sm text-gray-600">Drop the file here...</p>
          ) : (
            <p className="text-sm text-gray-600">
              Drag and drop, or click to select
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ComparisonUpload({
  onUpload,
  isUploading,
}: ComparisonUploadProps) {
  const [yourDesign, setYourDesign] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [competitorDesign, setCompetitorDesign] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (setter: typeof setYourDesign) => (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    setter({
      file,
      preview: URL.createObjectURL(file),
    });
    setError(null);
  };

  const handleSubmit = () => {
    if (!yourDesign || !competitorDesign) {
      setError("Please upload both designs");
      return;
    }
    onUpload(yourDesign.file, competitorDesign.file);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DesignDropzone
            onFileDrop={handleFileDrop(setYourDesign)}
            label="Your Design"
            isDisabled={isUploading}
          />
          {yourDesign && (
            <div className="mt-4 relative">
              <div className="relative w-full h-48">
                <Image
                  src={yourDesign.preview}
                  alt="Your design preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => setYourDesign(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div>
          <DesignDropzone
            onFileDrop={handleFileDrop(setCompetitorDesign)}
            label="Competitor's Design"
            isDisabled={isUploading}
          />
          {competitorDesign && (
            <div className="mt-4 relative">
              <div className="relative w-full h-48">
                <Image
                  src={competitorDesign.preview}
                  alt="Competitor design preview"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
              <button
                onClick={() => setCompetitorDesign(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={!yourDesign || !competitorDesign || isUploading}
          className={classNames(
            "px-6 py-2 rounded-md font-medium transition-colors",
            {
              "bg-blue-600 text-white hover:bg-blue-700":
                !isUploading && yourDesign && competitorDesign,
              "bg-gray-300 text-gray-500 cursor-not-allowed":
                !yourDesign || !competitorDesign || isUploading,
            },
          )}
        >
          {isUploading ? "Analyzing..." : "Compare Designs"}
        </button>
      </div>
    </div>
  );
}
