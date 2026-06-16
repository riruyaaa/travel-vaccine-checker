"use client";

import { useState } from "react";
import { countries } from "@/data/countries";
import SelectableCard from "@/components/ui/SelectableCard";
import StepHeader from "@/components/ui/StepHeader";

interface CountryStepProps {
  selectedCodes: string[];
  transitCodes: string[];
  onChange: (codes: string[], transitCodes: string[]) => void;
}

export default function CountryStep({ selectedCodes, transitCodes, onChange }: CountryStepProps) {
  const [query, setQuery] = useState("");

  const filtered = countries.filter(
    (c) =>
      c.countryNameKo.includes(query) ||
      c.countryNameEn.toLowerCase().includes(query.toLowerCase())
  );

  function toggleCountry(code: string) {
    const next = selectedCodes.includes(code)
      ? selectedCodes.filter((c) => c !== code)
      : [...selectedCodes, code];
    onChange(next, transitCodes.filter((c) => !next.includes(c)));
  }

  function toggleTransit(code: string) {
    const next = transitCodes.includes(code)
      ? transitCodes.filter((c) => c !== code)
      : [...transitCodes, code];
    onChange(selectedCodes, next);
  }

  return (
    <div className="flex-1 px-4 pt-4">
      <StepHeader title="어디로 여행하시나요?" subtitle="방문할 국가를 모두 선택해주세요." step={1} totalSteps={5} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="국가 검색 (예: 케냐, Kenya)"
        className="mb-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
      />
      <div className="space-y-2">
        {filtered.map((c) => (
          <SelectableCard
            key={c.countryCode}
            label={`${c.countryNameKo} (${c.countryNameEn})`}
            selected={selectedCodes.includes(c.countryCode)}
            onClick={() => toggleCountry(c.countryCode)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">검색 결과가 없습니다.</p>
        )}
      </div>

      {selectedCodes.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-gray-700">경유 국가가 있나요? (선택)</h2>
          <div className="space-y-2">
            {countries
              .filter((c) => !selectedCodes.includes(c.countryCode))
              .map((c) => (
                <SelectableCard
                  key={c.countryCode}
                  label={`${c.countryNameKo} (${c.countryNameEn})`}
                  selected={transitCodes.includes(c.countryCode)}
                  onClick={() => toggleTransit(c.countryCode)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
