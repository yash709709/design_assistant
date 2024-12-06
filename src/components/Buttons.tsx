interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium disabled:opacity-50
        ${
          variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
}
