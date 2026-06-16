export type VaccineCategory =
  | "required"
  | "entry_requirement_or_recommended"
  | "recommended"
  | "routine"
  | "consult";

export interface VaccineInfo {
  name: string;
  category: VaccineCategory;
  reason: string;
  timing: string;
  certificateRequired?: boolean;
  consultRequired?: boolean;
  notes?: string;
}

export interface MalariaInfo {
  risk: boolean;
  description: string;
  requiresPrescription: boolean;
}

export interface CountryData {
  countryCode: string;
  countryNameKo: string;
  countryNameEn: string;
  region: string;
  vaccines: VaccineInfo[];
  malaria: MalariaInfo;
  yellowFeverEndemic: boolean;
  generalAdvice: string[];
  sources: string[];
  lastUpdated: string;
}

export type VisitArea = "city" | "rural" | "remote" | "safari" | "highAltitude";

export type TravelPurpose =
  | "tourism"
  | "business"
  | "medicalVolunteer"
  | "longStay"
  | "backpacking"
  | "family";

export interface TravelerInfo {
  age: number | null;
  isPregnant: boolean;
  isImmunocompromised: boolean;
  hasChronicDisease: boolean;
  vaccineHistory: string[];
  allergies: string;
  currentMedications: string;
}

export interface UserTrip {
  tripId: string;
  countryCodes: string[];
  transitCountryCodes: string[];
  departureDate: string;
  returnDate: string;
  visitAreas: VisitArea[];
  purposes: TravelPurpose[];
  animalContact: boolean;
  traveler: TravelerInfo;
}

export interface VaccineResultItem {
  name: string;
  reason: string;
  timing?: string;
  certificateRequired?: boolean;
  consultRequired?: boolean;
  notes?: string;
  sourceCountries: string[];
}

export interface MalariaResultItem {
  countryNameKo: string;
  description: string;
  requiresPrescription: boolean;
}

export interface TimelineItem {
  label: string;
  date: string | null;
  status: "overdue" | "upcoming" | "ok";
}

export interface RecommendationResult {
  requiredOrCertificateCheck: VaccineResultItem[];
  recommendedVaccines: VaccineResultItem[];
  malariaPrevention: MalariaResultItem[];
  medicalConsultItems: VaccineResultItem[];
  consultWarnings: string[];
  generalAdvice: string[];
  preparationTimeline: TimelineItem[];
  sources: string[];
}

export interface ChecklistState {
  [itemId: string]: boolean;
}
