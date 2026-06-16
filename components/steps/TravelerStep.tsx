"use client";

import StepHeader from "@/components/ui/StepHeader";
import SelectableCard from "@/components/ui/SelectableCard";
import { TravelerInfo } from "@/lib/types";

const HISTORY_OPTIONS = ["MMR", "Tdap", "B형간염", "A형간염", "장티푸스", "황열"];

interface TravelerStepProps {
  traveler: TravelerInfo;
  onChange: (data: Partial<TravelerInfo>) => void;
}

export default function TravelerStep({ traveler, onChange }: TravelerStepProps) {
  function toggleHistory(name: string) {
    const next = traveler.vaccineHistory.includes(name)
      ? traveler.vaccineHistory.filter((v) => v !== name)
      : [...traveler.vaccineHistory, name];
    onChange({ vaccineHistory: next });
  }

  return (
    <div className="flex-1 px-4 pt-4">
      <StepHeader title="여행자 정보를 알려주세요" step={4} totalSteps={5} />

      <label className="mb-1 block text-sm font-semibold text-gray-700">나이</label>
      <input
        type="number"
        min={0}
        max={120}
        value={traveler.age ?? ""}
        onChange={(e) => onChange({ age: e.target.value === "" ? null : Number(e.target.value) })}
        placeholder="나이를 입력해주세요"
        className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />

      <div className="mb-4 space-y-2">
        <SelectableCard
          label="임신 중입니다"
          selected={traveler.isPregnant}
          onClick={() => onChange({ isPregnant: !traveler.isPregnant })}
        />
        <SelectableCard
          label="면역저하 상태입니다"
          selected={traveler.isImmunocompromised}
          onClick={() => onChange({ isImmunocompromised: !traveler.isImmunocompromised })}
        />
        <SelectableCard
          label="기저질환이 있습니다"
          selected={traveler.hasChronicDisease}
          onClick={() => onChange({ hasChronicDisease: !traveler.hasChronicDisease })}
        />
      </div>

      <h2 className="mb-2 text-sm font-semibold text-gray-700">이전에 접종한 백신이 있나요?</h2>
      <div className="mb-4 grid grid-cols-2 gap-2">
        {HISTORY_OPTIONS.map((name) => (
          <SelectableCard
            key={name}
            label={name}
            selected={traveler.vaccineHistory.includes(name)}
            onClick={() => toggleHistory(name)}
          />
        ))}
      </div>

      <label className="mb-1 block text-sm font-semibold text-gray-700">알레르기 (선택)</label>
      <input
        value={traveler.allergies}
        onChange={(e) => onChange({ allergies: e.target.value })}
        placeholder="예: 계란 알레르기"
        className="mb-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />

      <label className="mb-1 block text-sm font-semibold text-gray-700">현재 복용 중인 약 (선택)</label>
      <input
        value={traveler.currentMedications}
        onChange={(e) => onChange({ currentMedications: e.target.value })}
        placeholder="예: 면역억제제"
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}
