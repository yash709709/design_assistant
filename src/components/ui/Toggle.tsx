interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

export default function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2
          border-transparent transition-colors duration-200 ease-in-out
          ${enabled ? "bg-blue-600" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out
            ${enabled ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}
