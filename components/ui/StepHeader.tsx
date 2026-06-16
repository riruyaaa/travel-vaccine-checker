interface StepHeaderProps {
  title: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
}

export default function StepHeader({ title, subtitle, step, totalSteps }: StepHeaderProps) {
  return (
    <div className="mb-5">
      {step !== undefined && totalSteps !== undefined && (
        <div className="mb-3 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-1.5 rounded-full bg-blue-600 transition-all"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      )}
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
