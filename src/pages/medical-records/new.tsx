import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Plus,
  X,
  Heart,
  Activity,
  Thermometer,
  Weight,
  Ruler,
  Waves,
  Wind,
} from "lucide-react";
import { motion } from "framer-motion";

type RecordType =
  | "consultation"
  | "admission"
  | "discharge_summary"
  | "surgery"
  | "followup"
  | "lab_report"
  | "imaging_report";

const recordTypeOptions: { value: RecordType; label: string }[] = [
  { value: "consultation", label: "Consultation" },
  { value: "admission", label: "Admission Note" },
  { value: "discharge_summary", label: "Discharge Summary" },
  { value: "surgery", label: "Surgery Report" },
  { value: "followup", label: "Follow-up" },
  { value: "lab_report", label: "Lab Report" },
  { value: "imaging_report", label: "Imaging Report" },
];

interface VitalSigns {
  bloodPressure?: string;
  heartRate?: number;
  temperature?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weight?: number;
  height?: number;
}

export default function NewMedicalRecordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPatient = searchParams.get("patientId");

  // Data
  const patients = useQuery(api.patients.queries.listPatients, { status: "active" });
  const doctors = useQuery(api.users.queries.listUsersByRole, { role: "doctor" });
  const appointments = useQuery(api.appointments.queries.listAppointmentsByPatient, {
    patientId: preselectedPatient as any,
  });

  const createRecord = useMutation(api.medical_records.mutations.createMedicalRecord);

  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient ?? "");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [recordType, setRecordType] = useState<RecordType>("consultation");
  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [notes, setNotes] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);
  const [showVitals, setShowVitals] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(
      (a) => a.status === "completed" || a.status === "in_progress"
    );
  }, [appointments]);

  const handleAddSymptom = () => {
    const trimmed = symptomInput.trim();
    if (trimmed && !symptoms.includes(trimmed)) {
      setSymptoms([...symptoms, trimmed]);
      setSymptomInput("");
    }
  };

  const handleRemoveSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedPatientId) { setError("Please select a patient"); return; }
    if (!selectedDoctorId) { setError("Please select a doctor"); return; }
    if (!notes.trim()) { setError("Notes are required"); return; }

    setIsSubmitting(true);
    try {
      await createRecord({
        patientId: selectedPatientId as any,
        doctorId: selectedDoctorId as any,
        appointmentId: appointmentId ? (appointmentId as any) : undefined,
        recordType,
        diagnosis: diagnosis.trim() || undefined,
        symptoms,
        vitalSigns: showVitals && Object.keys(vitals).length > 0 ? vitals : undefined,
        treatmentPlan: treatmentPlan.trim() || undefined,
        notes: notes.trim(),
        attachments: [],
        isConfidential,
      });
      navigate("/medical-records");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedAppointments = preselectedPatient === selectedPatientId ? filteredAppointments : [];

  return (
    <PageContainer>
      <button
        onClick={() => navigate("/medical-records")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Medical Records
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle>Create Medical Record</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient & Doctor Selection */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select
                    value={selectedPatientId}
                    onValueChange={(val) => {
                      setSelectedPatientId(val);
                      setAppointmentId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Search & select patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients?.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.firstName} {p.lastName} ({p.medicalRecordNumber})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor *</Label>
                  <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors?.map((d) => (
                        <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Record Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Record Type</Label>
                <Select value={recordType} onValueChange={(val) => setRecordType(val as RecordType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recordTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Appointment link */}
              {selectedAppointments.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="appointment">Linked Appointment (optional)</Label>
                  <Select value={appointmentId} onValueChange={setAppointmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Link to an appointment..." />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedAppointments.map((a) => (
                        <SelectItem key={a._id} value={a._id}>
                          {a.appointmentType} — {new Date(a.scheduledDate).toLocaleDateString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Symptoms */}
              <div className="space-y-2">
                <Label>Symptoms</Label>
                <div className="flex gap-2">
                  <Input
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSymptom(); } }}
                    placeholder="Type a symptom and press Enter..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="icon" onClick={handleAddSymptom}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {symptoms.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      >
                        {s}
                        <button type="button" onClick={() => handleRemoveSymptom(s)} className="hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Diagnosis */}
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Primary diagnosis..."
                />
              </div>

              {/* Vital Signs Toggle */}
              <div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVitals(!showVitals)}
                  className="mb-2"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {showVitals ? "Hide Vital Signs" : "Add Vital Signs"}
                </Button>

                {showVitals && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4"
                  >
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Activity className="h-3 w-3" /> Blood Pressure
                      </Label>
                      <Input
                        placeholder="e.g. 120/80"
                        value={vitals.bloodPressure ?? ""}
                        onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value || undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Heart className="h-3 w-3" /> Heart Rate (bpm)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 72"
                        value={vitals.heartRate ?? ""}
                        onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Thermometer className="h-3 w-3" /> Temperature (°C)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 36.6"
                        value={vitals.temperature ?? ""}
                        onChange={(e) => setVitals({ ...vitals, temperature: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Wind className="h-3 w-3" /> Resp. Rate (/min)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 16"
                        value={vitals.respiratoryRate ?? ""}
                        onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Waves className="h-3 w-3" /> O2 Sat (%)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 98"
                        value={vitals.oxygenSaturation ?? ""}
                        onChange={(e) => setVitals({ ...vitals, oxygenSaturation: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Weight className="h-3 w-3" /> Weight (kg)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="e.g. 70"
                        value={vitals.weight ?? ""}
                        onChange={(e) => setVitals({ ...vitals, weight: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="flex items-center gap-1 text-xs">
                        <Ruler className="h-3 w-3" /> Height (cm)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 170"
                        value={vitals.height ?? ""}
                        onChange={(e) => setVitals({ ...vitals, height: e.target.value ? Number(e.target.value) : undefined })}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Treatment Plan */}
              <div className="space-y-2">
                <Label htmlFor="treatmentPlan">Treatment Plan</Label>
                <Textarea
                  id="treatmentPlan"
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Describe the treatment plan..."
                  rows={3}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes *</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="SOAP notes, observations, and clinical findings..."
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              {/* Confidential */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded border-border"
                />
                Mark as confidential (restricted access)
              </label>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Record"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/medical-records")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
