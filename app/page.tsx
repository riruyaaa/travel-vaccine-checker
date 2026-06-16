"use client";

import { useEffect, useState } from "react";
import { UserTrip, ChecklistState } from "@/lib/types";
import { createEmptyTrip, loadChecklist, loadTrip, saveChecklist, saveTrip } from "@/lib/storage";
import { generateRecommendation } from "@/lib/recommendationEngine";
import { getCountryByCode } from "@/data/countries";
import Button from "@/components/ui/Button";
import BottomBar from "@/components/ui/BottomBar";
import HomeStep from "@/components/steps/HomeStep";
import CountryStep from "@/components/steps/CountryStep";
import TripInfoStep from "@/components/steps/TripInfoStep";
import StyleStep from "@/components/steps/StyleStep";
import TravelerStep from "@/components/steps/TravelerStep";
import ResultStep from "@/components/steps/ResultStep";
import ChecklistStep from "@/components/steps/ChecklistStep";

type Step = "home" | "country" | "trip" | "style" | "traveler" | "result" | "checklist";

export default function Home() {
  const [step, setStep] = useState<Step>("home");
  const [trip, setTrip] = useState<UserTrip>(createEmptyTrip());
  const [checklist, setChecklist] = useState<ChecklistState>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTrip = loadTrip();
    if (savedTrip) setTrip(savedTrip);
    setChecklist(loadChecklist());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveTrip(trip);
  }, [trip, hydrated]);

  useEffect(() => {
    if (hydrated) saveChecklist(checklist);
  }, [checklist, hydrated]);

  function updateTrip(data: Partial<UserTrip>) {
    setTrip((prev) => ({ ...prev, ...data }));
  }

  function updateTraveler(data: Partial<UserTrip["traveler"]>) {
    setTrip((prev) => ({ ...prev, traveler: { ...prev.traveler, ...data } }));
  }

  function toggleChecklistKey(key: string) {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const STEP_ORDER: Step[] = ["country", "trip", "style", "traveler", "result"];
  const currentIndex = STEP_ORDER.indexOf(step);

  function canProceed(): boolean {
    if (step === "country") return trip.countryCodes.length > 0;
    if (step === "trip") return trip.departureDate !== "" && trip.returnDate !== "";
    return true;
  }

  function goNext() {
    if (currentIndex >= 0 && currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      setStep(STEP_ORDER[currentIndex - 1]);
    } else {
      setStep("home");
    }
  }

  const countryNames = trip.countryCodes
    .map((code) => getCountryByCode(code)?.countryNameKo)
    .filter((n): n is string => Boolean(n));

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
      {step === "home" && <HomeStep onStart={() => setStep("country")} />}

      {step === "country" && (
        <>
          <CountryStep
            selectedCodes={trip.countryCodes}
            transitCodes={trip.transitCountryCodes}
            onChange={(codes, transitCodes) =>
              updateTrip({ countryCodes: codes, transitCountryCodes: transitCodes })
            }
          />
          <BottomBar>
            <Button variant="ghost" onClick={goPrev}>이전</Button>
            <Button onClick={goNext} disabled={!canProceed()}>다음</Button>
          </BottomBar>
        </>
      )}

      {step === "trip" && (
        <>
          <TripInfoStep
            departureDate={trip.departureDate}
            returnDate={trip.returnDate}
            visitAreas={trip.visitAreas}
            onChange={(data) => updateTrip(data)}
          />
          <BottomBar>
            <Button variant="ghost" onClick={goPrev}>이전</Button>
            <Button onClick={goNext} disabled={!canProceed()}>다음</Button>
          </BottomBar>
        </>
      )}

      {step === "style" && (
        <>
          <StyleStep
            purposes={trip.purposes}
            animalContact={trip.animalContact}
            onChange={(data) => updateTrip(data)}
          />
          <BottomBar>
            <Button variant="ghost" onClick={goPrev}>이전</Button>
            <Button onClick={goNext}>다음</Button>
          </BottomBar>
        </>
      )}

      {step === "traveler" && (
        <>
          <TravelerStep traveler={trip.traveler} onChange={updateTraveler} />
          <BottomBar>
            <Button variant="ghost" onClick={goPrev}>이전</Button>
            <Button onClick={goNext}>결과 확인하기</Button>
          </BottomBar>
        </>
      )}

      {step === "result" && (
        <ResultStep
          result={generateRecommendation(trip)}
          countryNames={countryNames}
          checklist={checklist}
          onToggleDone={toggleChecklistKey}
          onGoChecklist={() => setStep("checklist")}
        />
      )}

      {step === "checklist" && (
        <ChecklistStep
          checklist={checklist}
          onToggle={toggleChecklistKey}
          onBackToResult={() => setStep("result")}
        />
      )}
    </div>
  );
}
