"use client";

import { RecommendationResult, ChecklistState } from "@/lib/types";
import Card from "@/components/ui/Card";
import VaccineCard from "@/components/VaccineCard";
import Button from "@/components/ui/Button";

const STATUS_LABEL: Record<string, string> = {
  overdue: "기한 지남 · 즉시 상담 필요",
  upcoming: "임박",
  ok: "예정",
};

const STATUS_COLOR: Record<string, string> = {
  overdue: "text-red-600",
  upcoming: "text-amber-600",
  ok: "text-gray-500",
};

interface ResultStepProps {
  result: RecommendationResult;
  countryNames: string[];
  checklist: ChecklistState;
  onToggleDone: (key: string) => void;
  onGoChecklist: () => void;
}

export default function ResultStep({ result, countryNames, checklist, onToggleDone, onGoChecklist }: ResultStepProps) {
  return (
    <div className="flex-1 px-4 pt-4 pb-4">
      <h1 className="mb-1 text-xl font-bold text-gray-900">
        {countryNames.join(", ")} 여행 전 확인할 예방접종
      </h1>
      <p className="mb-5 text-sm text-gray-500">아래 결과는 참고용입니다. 출국 전 의료기관 상담을 받으세요.</p>

      <Section title="① 입국 또는 증명서 확인 필요">
        {result.requiredOrCertificateCheck.length === 0 ? (
          <EmptyNote text="해당 사항이 없습니다." />
        ) : (
          result.requiredOrCertificateCheck.map((item) => (
            <VaccineCard
              key={item.name}
              item={item}
              done={!!checklist[`vaccine_${item.name}`]}
              onToggleDone={() => onToggleDone(`vaccine_${item.name}`)}
            />
          ))
        )}
      </Section>

      <Section title="② 권장 예방접종">
        {result.recommendedVaccines.length === 0 ? (
          <EmptyNote text="해당 사항이 없습니다." />
        ) : (
          result.recommendedVaccines.map((item) => (
            <VaccineCard
              key={item.name}
              item={item}
              done={!!checklist[`vaccine_${item.name}`]}
              onToggleDone={() => onToggleDone(`vaccine_${item.name}`)}
            />
          ))
        )}
      </Section>

      <Section title="③ 예방약 및 비백신 예방">
        {result.malariaPrevention.map((m, idx) => (
          <Card key={idx}>
            <h3 className="font-semibold text-gray-900">말라리아 예방약 ({m.countryNameKo})</h3>
            <p className="mt-1 text-sm text-gray-600">{m.description}</p>
            {m.requiresPrescription && (
              <p className="mt-1 text-xs text-amber-600">전문의 상담 후 처방받아야 합니다.</p>
            )}
          </Card>
        ))}
        {result.generalAdvice.map((advice, idx) => (
          <Card key={`advice_${idx}`}>
            <p className="text-sm text-gray-700">{advice}</p>
          </Card>
        ))}
      </Section>

      <Section title="④ 의료진 상담 필요">
        {result.medicalConsultItems.map((item) => (
          <VaccineCard
            key={item.name}
            item={item}
            done={!!checklist[`vaccine_${item.name}`]}
            onToggleDone={() => onToggleDone(`vaccine_${item.name}`)}
          />
        ))}
        {result.consultWarnings.map((w, idx) => (
          <Card key={idx}>
            <p className="text-sm text-gray-700">{w}</p>
          </Card>
        ))}
      </Section>

      <Section title="⑤ 출국 전 준비 일정">
        <div className="space-y-2">
          {result.preparationTimeline.map((t, idx) => (
            <div key={idx} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{t.label}</p>
                {t.date && <p className="text-xs text-gray-500">{t.date}</p>}
              </div>
              <span className={`text-xs font-semibold ${STATUS_COLOR[t.status]}`}>{STATUS_LABEL[t.status]}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="⑥ 참고 자료 및 주의 문구">
        <Card>
          <ul className="list-disc space-y-1 pl-4 text-xs text-gray-500">
            {result.sources.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-gray-500">
            이 앱은 여행 전 예방접종 확인을 돕기 위한 참고용 도구입니다. 국가별 입국 요건, 감염병 유행 상황,
            개인 건강 상태에 따라 필요한 접종은 달라질 수 있습니다. 출국 전 의료기관 또는 여행의학 클리닉에서
            최종 상담을 받으세요.
          </p>
        </Card>
      </Section>

      <Button variant="secondary" onClick={onGoChecklist} className="mt-2">
        출국 전 준비 체크리스트 보기
      </Button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-bold text-blue-700">{title}</h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return <p className="py-2 text-sm text-gray-400">{text}</p>;
}
