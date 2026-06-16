import { getCountryByCode } from "@/data/countries";
import {
  RecommendationResult,
  TimelineItem,
  UserTrip,
  VaccineResultItem,
} from "@/lib/types";

const RURAL_AREAS = ["rural", "remote", "safari"];
const LONG_EXPOSURE_PURPOSES = ["longStay", "medicalVolunteer", "backpacking"];
const STRENGTHEN_VACCINES = ["장티푸스", "A형간염", "광견병", "일본뇌염"];

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

function mergeVaccineItem(
  map: Map<string, VaccineResultItem>,
  name: string,
  reason: string,
  countryNameKo: string,
  options: {
    timing?: string;
    certificateRequired?: boolean;
    consultRequired?: boolean;
    notes?: string;
  } = {}
) {
  const existing = map.get(name);
  if (existing) {
    if (!existing.sourceCountries.includes(countryNameKo)) {
      existing.sourceCountries.push(countryNameKo);
    }
    existing.certificateRequired = existing.certificateRequired || options.certificateRequired;
    existing.consultRequired = existing.consultRequired || options.consultRequired;
    if (options.notes && !existing.notes?.includes(options.notes)) {
      existing.notes = existing.notes ? `${existing.notes} / ${options.notes}` : options.notes;
    }
    return;
  }
  map.set(name, {
    name,
    reason,
    timing: options.timing,
    certificateRequired: options.certificateRequired,
    consultRequired: options.consultRequired,
    notes: options.notes,
    sourceCountries: [countryNameKo],
  });
}

export function generateRecommendation(trip: UserTrip): RecommendationResult {
  const visitedCountries = trip.countryCodes
    .map(getCountryByCode)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const transitCountries = trip.transitCountryCodes
    .map(getCountryByCode)
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const certificateMap = new Map<string, VaccineResultItem>();
  const recommendedMap = new Map<string, VaccineResultItem>();
  const consultMap = new Map<string, VaccineResultItem>();
  const malariaPrevention: RecommendationResult["malariaPrevention"] = [];
  const consultWarnings: string[] = [];
  const generalAdviceSet = new Set<string>();
  const sourcesSet = new Set<string>();

  const isHighExposureTrip =
    trip.visitAreas.some((a) => RURAL_AREAS.includes(a)) ||
    trip.purposes.some((p) => LONG_EXPOSURE_PURPOSES.includes(p));

  for (const country of visitedCountries) {
    country.sources.forEach((s) => sourcesSet.add(s));
    country.generalAdvice.forEach((a) => generalAdviceSet.add(a));

    for (const vaccine of country.vaccines) {
      const baseOptions = {
        timing: vaccine.timing,
        certificateRequired: vaccine.certificateRequired,
        consultRequired: vaccine.consultRequired,
        notes: vaccine.notes,
      };

      if (vaccine.certificateRequired) {
        mergeVaccineItem(certificateMap, vaccine.name, vaccine.reason, country.countryNameKo, baseOptions);
      } else if (vaccine.category === "recommended" || vaccine.category === "routine") {
        mergeVaccineItem(recommendedMap, vaccine.name, vaccine.reason, country.countryNameKo, baseOptions);
      } else if (vaccine.category === "consult") {
        mergeVaccineItem(consultMap, vaccine.name, vaccine.reason, country.countryNameKo, baseOptions);
      }

      if (
        isHighExposureTrip &&
        STRENGTHEN_VACCINES.includes(vaccine.name) &&
        !certificateMap.has(vaccine.name)
      ) {
        mergeVaccineItem(consultMap, vaccine.name, "여행 지역·기간 특성상 감염 위험이 높아 상담을 강화합니다.", country.countryNameKo, {
          ...baseOptions,
          consultRequired: true,
        });
      }
    }

    if (country.malaria.risk) {
      malariaPrevention.push({
        countryNameKo: country.countryNameKo,
        description: country.malaria.description,
        requiresPrescription: country.malaria.requiresPrescription,
      });
    }
  }

  if (trip.animalContact) {
    const rabiesCountry = visitedCountries[0]?.countryNameKo ?? "방문국";
    mergeVaccineItem(
      consultMap,
      "광견병",
      "동물 접촉 가능성이 있다고 응답하여 노출 전 예방접종 상담을 권장합니다.",
      rabiesCountry,
      { consultRequired: true }
    );
  }

  const yellowFeverTransit = transitCountries.some((c) => c.yellowFeverEndemic);
  if (yellowFeverTransit) {
    consultWarnings.push(
      "황열 위험국가를 경유합니다. 경유 국가 기준 황열 예방접종 증명서 요구 여부를 출국 전 반드시 확인하세요."
    );
  }

  if (trip.traveler.isPregnant || trip.traveler.isImmunocompromised) {
    consultWarnings.push(
      "임신 또는 면역저하 상태에서는 황열, MMR, 수두 등 생백신 접종에 주의가 필요합니다. 접종 전 반드시 의료진과 상담하세요."
    );
  }

  if (trip.traveler.hasChronicDisease) {
    consultWarnings.push("기저질환이 있는 경우 백신 종류 및 접종 일정에 대해 의료진과 상담이 필요합니다.");
  }

  if (trip.traveler.age !== null) {
    if (trip.traveler.age < 1) {
      consultWarnings.push("영아의 경우 백신 종류와 접종 시기가 다르므로 소아과 상담이 필요합니다.");
    } else if (trip.traveler.age >= 60) {
      consultWarnings.push("고령 여행자는 면역 상태와 동반 질환에 따라 접종 권고가 달라질 수 있어 상담이 필요합니다.");
    }
  }

  for (const item of recommendedMap.values()) {
    if (trip.traveler.vaccineHistory.includes(item.name)) {
      item.notes = item.notes
        ? `${item.notes} / 기존 접종 기록 있음 - 추가 접종 필요 여부 상담 권장`
        : "기존 접종 기록 있음 - 추가 접종 필요 여부 상담 권장";
    }
  }

  consultWarnings.push("이 결과는 참고용이며, 실제 접종 여부는 출국 전 의료진 상담을 통해 결정해야 합니다.");

  const preparationTimeline = buildTimeline(trip);

  return {
    requiredOrCertificateCheck: Array.from(certificateMap.values()),
    recommendedVaccines: Array.from(recommendedMap.values()),
    malariaPrevention,
    medicalConsultItems: Array.from(consultMap.values()),
    consultWarnings,
    generalAdvice: Array.from(generalAdviceSet),
    preparationTimeline,
    sources: Array.from(sourcesSet),
  };
}

function buildTimeline(trip: UserTrip): TimelineItem[] {
  if (!trip.departureDate) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(trip.departureDate);
  const daysUntilDeparture = daysBetween(today, departure);

  const steps: { label: string; offsetDays: number }[] = [
    { label: "여행 계획 및 방문 지역 확정", offsetDays: 30 },
    { label: "예방접종 상담 예약 (보건소/여행클리닉)", offsetDays: 21 },
    { label: "황열 등 입국 필수 백신 접종 완료", offsetDays: 10 },
    { label: "권장 백신 접종 완료", offsetDays: 14 },
    { label: "말라리아 예방약 처방 상담", offsetDays: 7 },
    { label: "최종 점검 및 서류 준비", offsetDays: 2 },
  ];

  return steps.map((step) => {
    const targetDate = new Date(departure);
    targetDate.setDate(targetDate.getDate() - step.offsetDays);
    const daysFromToday = daysBetween(today, targetDate);

    let status: TimelineItem["status"] = "ok";
    if (daysFromToday < 0) status = "overdue";
    else if (daysFromToday <= 7) status = "upcoming";

    return {
      label: step.label,
      date: trip.departureDate ? targetDate.toISOString().slice(0, 10) : null,
      status: daysUntilDeparture < 0 ? "overdue" : status,
    };
  });
}
