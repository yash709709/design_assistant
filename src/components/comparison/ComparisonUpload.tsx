"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface ComparisonUploadProps {
  onUpload: (yourDesign: File, competitorDesign: File) => void;
  isUploading: boolean;
}

interface DesignUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  label: string;
  isUploading: boolean;
}

// Separate component for individual design upload
function DesignUploader({ onDrop, label, isUploading }: DesignUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled: isUploading,
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
            "cursor-pointer": !isUploading,
            "cursor-not-allowed opacity-75": isUploading,
          },
        )}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm text-center text-gray-600">
            Drop the file here...
          </p>
        ) : (
          <p className="text-sm text-center text-gray-600">
            Drag and drop, or click to select
          </p>
        )}
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

  const handleSubmit = () => {
    if (!yourDesign || !competitorDesign) {
      setError("Please upload both designs");
      return;
    }
    onUpload(yourDesign.file, competitorDesign.file);
  };

  const handleYourDesignDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setYourDesign({
      file,
      preview: URL.createObjectURL(file),
    });
    setError(null);
  }, []);

  const handleCompetitorDesignDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setCompetitorDesign({
      file,
      preview: URL.createObjectURL(file),
    });
    setError(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <DesignUploader
            onDrop={handleYourDesignDrop}
            label="Your Design"
            isUploading={isUploading}
          />
          {yourDesign && (
            <div className="mt-4 relative">
              <Image
                src={yourDesign.preview}
                alt="Your design preview"
                width={300}
                height={200}
                className="rounded-lg object-contain"
                objectFit="cover"
              />
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
          <DesignUploader
            onDrop={handleCompetitorDesignDrop}
            label="Competitor's Design"
            isUploading={isUploading}
          />
          {competitorDesign && (
            <div className="mt-4 relative">
              <Image
                src={competitorDesign.preview}
                alt="Competitor design preview"
                width={300}
                height={200}
                className="rounded-lg object-contain"
                objectFit="cover"
              />
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
