import Card from "@/components/ui/Card";
import { VaccineResultItem } from "@/lib/types";

interface VaccineCardProps {
  item: VaccineResultItem;
  done: boolean;
  onToggleDone: () => void;
}

export default function VaccineCard({ item, done, onToggleDone }: VaccineCardProps) {
  return (
    <Card className={done ? "opacity-60" : ""}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{item.reason}</p>
          {item.timing && <p className="mt-1 text-xs text-gray-500">권장 시기: {item.timing}</p>}
          {item.notes && <p className="mt-1 text-xs text-amber-600">{item.notes}</p>}
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.certificateRequired && (
              <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                증명서 확인 필요
              </span>
            )}
            {item.consultRequired && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                상담 필요
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleDone}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
            done ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 text-gray-500"
          }`}
        >
          {done ? "완료" : "완료 체크"}
        </button>
      </div>
    </Card>
  );
}
