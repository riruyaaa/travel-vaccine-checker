import { ChecklistState, UserTrip } from "@/lib/types";

const TRIP_KEY = "travelVaccineChecker.trip";
const CHECKLIST_KEY = "travelVaccineChecker.checklist";

export function saveTrip(trip: UserTrip): void {
  localStorage.setItem(TRIP_KEY, JSON.stringify(trip));
}

export function loadTrip(): UserTrip | null {
  const raw = localStorage.getItem(TRIP_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserTrip;
  } catch {
    return null;
  }
}

export function saveChecklist(checklist: ChecklistState): void {
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checklist));
}

export function loadChecklist(): ChecklistState {
  const raw = localStorage.getItem(CHECKLIST_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as ChecklistState;
  } catch {
    return {};
  }
}

export function createEmptyTrip(): UserTrip {
  return {
    tripId: `trip_${Date.now()}`,
    countryCodes: [],
    transitCountryCodes: [],
    departureDate: "",
    returnDate: "",
    visitAreas: [],
    purposes: [],
    animalContact: false,
    traveler: {
      age: null,
      isPregnant: false,
      isImmunocompromised: false,
      hasChronicDisease: false,
      vaccineHistory: [],
      allergies: "",
      currentMedications: "",
    },
  };
}
