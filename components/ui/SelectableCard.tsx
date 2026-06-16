interface SelectableCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectableCard({ label, description, selected, onClick }: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3 transition-colors ${
        selected ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-medium ${selected ? "text-blue-700" : "text-gray-800"}`}>{label}</span>
        {selected && <span className="text-blue-600 text-sm">✓</span>}
      </div>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </button>
  );
}
