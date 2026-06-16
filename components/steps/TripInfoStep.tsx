"use client";

import StepHeader from "@/components/ui/StepHeader";
import SelectableCard from "@/components/ui/SelectableCard";
import { VisitArea } from "@/lib/types";

const AREA_OPTIONS: { value: VisitArea; label: string }[] = [
  { value: "city", label: "대도시" },
  { value: "rural", label: "시골" },
  { value: "remote", label: "오지" },
  { value: "safari", label: "사파리" },
  { value: "highAltitude", label: "고산지역" },
];

interface TripInfoStepProps {
  departureDate: string;
  returnDate: string;
  visitAreas: VisitArea[];
  onChange: (data: { departureDate?: string; returnDate?: string; visitAreas?: VisitArea[] }) => void;
}

export default function TripInfoStep({ departureDate, returnDate, visitAreas, onChange }: TripInfoStepProps) {
  function toggleArea(area: VisitArea) {
    const next = visitAreas.includes(area)
      ? visitAreas.filter((a) => a !== area)
      : [...visitAreas, area];
    onChange({ visitAreas: next });
  }

  return (
    <div className="flex-1 px-4 pt-4">
      <StepHeader title="여행 일정을 알려주세요" step={2} totalSteps={5} />

      <label className="mb-1 block text-sm font-semibold text-gray-700">출국일</label>
      <input
        type="date"
        value={departureDate}
        onChange={(e) => onChange({ departureDate: e.target.value })}
        className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />

      <label className="mb-1 block text-sm font-semibold text-gray-700">귀국일</label>
      <input
        type="date"
        value={returnDate}
        onChange={(e) => onChange({ returnDate: e.target.value })}
        className="mb-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />

      <h2 className="mb-2 text-sm font-semibold text-gray-700">방문 지역 유형을 선택해주세요 (복수 선택 가능)</h2>
      <div className="space-y-2">
        {AREA_OPTIONS.map((opt) => (
          <SelectableCard
            key={opt.value}
            label={opt.label}
            selected={visitAreas.includes(opt.value)}
            onClick={() => toggleArea(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
