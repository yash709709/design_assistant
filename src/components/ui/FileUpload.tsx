"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { CloudArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({
  onFileUpload,
  isUploading,
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);

      if (acceptedFiles.length === 0) {
        setError("Please upload a file");
        return;
      }

      const file = acceptedFiles[0];

      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      onFileUpload(file);

      return () => URL.revokeObjectURL(objectUrl);
    },
    [onFileUpload],
  );

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

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
      <div
        {...getRootProps()}
        className={classNames(
          "relative border-2 border-dashed rounded-lg p-8 transition-colors",
          {
            "border-blue-400 bg-blue-50": isDragActive,
            "border-gray-300 hover:border-gray-400": !isDragActive && !error,
            "border-red-500": error,
            "cursor-pointer": !isUploading,
            "cursor-not-allowed opacity-75": isUploading,
          },
        )}
      >
        <input {...getInputProps()} />

        {isUploading ? (
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-blue-500 transition ease-in-out duration-150 cursor-not-allowed">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing design...
            </div>
          </div>
        ) : preview ? (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              className="absolute top-0 right-0 -mt-4 -mr-4 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <div className="relative w-full h-48">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                <span>
                  {isDragActive ? "Drop the file here" : "Upload a file"}
                </span>
              </label>
              {!isDragActive && <p className="pl-1">or drag and drop</p>}
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, JPEG up to 10MB
            </p>
          </div>
        )}

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
}
