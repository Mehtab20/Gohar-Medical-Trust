import { v } from "convex/values";

export const COMMON_LAB_TESTS = [
  { name: "Complete Blood Count (CBC)", code: "CBC", sampleType: "blood", turnaround: "2 hours" },
  { name: "Hemoglobin (Hb)", code: "HB", sampleType: "blood", turnaround: "1 hour" },
  { name: "Blood Sugar (Fasting)", code: "BSF", sampleType: "blood", turnaround: "1 hour" },
  { name: "Blood Sugar (Random)", code: "BSR", sampleType: "blood", turnaround: "1 hour" },
  { name: "HbA1c", code: "HBA1C", sampleType: "blood", turnaround: "4 hours" },
  { name: "Lipid Profile", code: "LIPID", sampleType: "blood", turnaround: "4 hours" },
  { name: "Liver Function Test (LFT)", code: "LFT", sampleType: "blood", turnaround: "4 hours" },
  { name: "Renal Function Test (RFT)", code: "RFT", sampleType: "blood", turnaround: "4 hours" },
  { name: "Serum Electrolytes", code: "ELYTE", sampleType: "blood", turnaround: "2 hours" },
  { name: "Thyroid Function Test (TFT)", code: "TFT", sampleType: "blood", turnaround: "6 hours" },
  { name: "Urine Routine Examination (URE)", code: "URE", sampleType: "urine", turnaround: "2 hours" },
  { name: "Urine Culture & Sensitivity", code: "UCS", sampleType: "urine", turnaround: "48 hours" },
  { name: "Stool Routine Examination", code: "SRE", sampleType: "stool", turnaround: "2 hours" },
  { name: "Malaria Parasite (MP)", code: "MP", sampleType: "blood", turnaround: "1 hour" },
  { name: "Dengue NS1/IgM/IgG", code: "DENGUE", sampleType: "blood", turnaround: "4 hours" },
  { name: "Hepatitis B Surface Antigen (HBsAg)", code: "HBSAG", sampleType: "blood", turnaround: "4 hours" },
  { name: "Hepatitis C Virus (HCV)", code: "HCV", sampleType: "blood", turnaround: "4 hours" },
  { name: "Widal Test (Typhoid)", code: "WIDAL", sampleType: "blood", turnaround: "4 hours" },
  { name: "CRP (C-Reactive Protein)", code: "CRP", sampleType: "blood", turnaround: "2 hours" },
  { name: "ESR", code: "ESR", sampleType: "blood", turnaround: "2 hours" },
  { name: "Blood Grouping & Rh Type", code: "BGRP", sampleType: "blood", turnaround: "1 hour" },
  { name: "Coagulation Profile (PT/APTT)", code: "COAG", sampleType: "blood", turnaround: "2 hours" },
  { name: "Sputum AFB (TB)", code: "AFB", sampleType: "sputum", turnaround: "24 hours" },
  { name: "X-ray Report", code: "XRAY", sampleType: "imaging", turnaround: "2 hours" },
  { name: "ECG", code: "ECG", sampleType: "other", turnaround: "1 hour" },
] as const;

export const labOrderFields = {
  patientId: v.id("patients"),
  doctorId: v.id("users"),
  testType: v.string(),
  testCode: v.string(),
  priority: v.union(v.literal("routine"), v.literal("urgent"), v.literal("stat")),
  notes: v.optional(v.string()),
  clinicalHistory: v.optional(v.string()),
};
