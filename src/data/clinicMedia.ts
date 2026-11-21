import heroClinicImg from '../assets/images/vet_hero_clinic_1795230551255.jpg';
import diagnosticsMriImg from '../assets/images/vet_diagnostics_mri_1795230551738.jpg';
import surgerySuiteImg from '../assets/images/vet_surgery_suite_1795230550852.jpg';
import patientDogImg from '../assets/images/vet_patient_dog_1795230550995.jpg';
import patientCatImg from '../assets/images/vet_patient_cat_1795230551419.jpg';
import specialistTeamImg from '../assets/images/vet_specialist_team_1795230550827.jpg';

export const CLINIC_IMAGES = {
  hero: heroClinicImg,
  diagnostics: diagnosticsMriImg,
  surgery: surgerySuiteImg,
  dog: patientDogImg,
  cat: patientCatImg,
  team: specialistTeamImg,
} as const;

export type ClinicImageKey = keyof typeof CLINIC_IMAGES;
