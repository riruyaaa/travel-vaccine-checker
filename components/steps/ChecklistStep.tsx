"use client";

import StepHeader from "@/components/ui/StepHeader";
import SelectableCard from "@/components/ui/SelectableCard";
import { ChecklistState } from "@/lib/types";

const CHECKLIST_ITEMS = [
  { id: "passbook", label: "예방접종 수첩 확인" },
  { id: "history", label: "기존 접종력 확인" },
  { id: "yellow_fever_center", label: "황열 국제공인 예방접종 지정기관 확인" },
  { id: "malaria_consult", label: "말라리아 예방약 상담" },
  { id: "mosquito_repellent", label: "모기기피제 준비" },
  { id: "diarrhea_meds", label: "여행자 설사 대비 약품 상담" },
  { id: "travel_insurance", label: "여행자보험 확인" },
  { id: "fever_guide", label: "귀국 후 발열 시 진료 안내 확인" },
];

interface ChecklistStepProps {
  checklist: ChecklistState;
  onToggle: (key: string) => void;
  onBackToResult: () => void;
}

export default function ChecklistStep({ checklist, onToggle, onBackToResult }: ChecklistStepProps) {
  return (
    <div className="flex-1 px-4 pt-4">
      <StepHeader title="출국 전 준비 체크리스트" subtitle="완료한 항목을 체크해주세요." />
      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => (
          <SelectableCard
            key={item.id}
            label={item.label}
            selected={!!checklist[`checklist_${item.id}`]}
            onClick={() => onToggle(`checklist_${item.id}`)}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={onBackToResult}
        className="mt-6 w-full text-center text-sm text-blue-600 underline"
      >
        결과 화면으로 돌아가기
      </button>
    </div>
  );
}
