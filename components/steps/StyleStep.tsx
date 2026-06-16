"use client";

import StepHeader from "@/components/ui/StepHeader";
import SelectableCard from "@/components/ui/SelectableCard";
import { TravelPurpose } from "@/lib/types";

const PURPOSE_OPTIONS: { value: TravelPurpose; label: string }[] = [
  { value: "tourism", label: "일반 관광" },
  { value: "backpacking", label: "배낭여행" },
  { value: "business", label: "출장" },
  { value: "family", label: "가족여행" },
  { value: "longStay", label: "장기 체류" },
  { value: "medicalVolunteer", label: "의료봉사/선교/봉사활동" },
];

interface StyleStepProps {
  purposes: TravelPurpose[];
  animalContact: boolean;
  onChange: (data: { purposes?: TravelPurpose[]; animalContact?: boolean }) => void;
}

export default function StyleStep({ purposes, animalContact, onChange }: StyleStepProps) {
  function togglePurpose(p: TravelPurpose) {
    const next = purposes.includes(p) ? purposes.filter((v) => v !== p) : [...purposes, p];
    onChange({ purposes: next });
  }

  return (
    <div className="flex-1 px-4 pt-4">
      <StepHeader title="여행 목적을 선택해주세요" subtitle="복수 선택 가능" step={3} totalSteps={5} />
      <div className="space-y-2">
        {PURPOSE_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            label={opt.label}
            selected={purposes.includes(opt.value)}
            onClick={() => togglePurpose(opt.value)}
          />
        ))}
      </div>

      <h2 className="mb-2 mt-6 text-sm font-semibold text-gray-700">동물 접촉 가능성이 있나요?</h2>
      <SelectableCard
        label="사파리, 농촌 동물, 야생동물 등과 접촉 가능성 있음"
        selected={animalContact}
        onClick={() => onChange({ animalContact: !animalContact })}
      />
    </div>
  );
}
