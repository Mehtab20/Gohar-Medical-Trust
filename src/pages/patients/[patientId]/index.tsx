import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/data/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Heart,
  AlertTriangle,
  User,
  Activity,
  Clock,
  UserCircle,
  ShieldAlert,
  DoorOpen,
  Bed,
  FileText,
  Stethoscope,
} from "lucide-react";
import { formatDate, formatPhone } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Doc } from "@convex/_generated/dataModel";

type Tab = "overview" | "medical" | "appointments" | "billing" | "adt";

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "adt", label: "Admission" },
  { key: "medical", label: "Medical History" },
  { key: "appointments", label: "Appointments" },
  { key: "billing", label: "Billing" },
];

const recordTypeLabels: Record<string, string> = {
  consultation: "Consultation",
  admission: "Admission Note",
  discharge_summary: "Discharge Summary",
  surgery: "Surgery Report",
  followup: "Follow-up",
  lab_report: "Lab Report",
  imaging_report: "Imaging Report",
};

const recordTypeColors: Record<string, string> = {
  consultation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  admission: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  discharge_summary: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  surgery: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  followup: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  lab_report: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  imaging_report: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
};

export default function PatientDetailPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const patient = useQuery(api.patients.queries.getPatient, {
    patientId: patientId as any,
  });

  if (!patientId) {
    navigate("/patients");
    return null;
  }

  if (patient === undefined) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (patient === null) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <ShieldAlert className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold">Patient Not Found</h2>
          <p className="text-sm text-muted-foreground">This patient record doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/patients")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Patients
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Back navigation */}
      <button
        onClick={() => navigate("/patients")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Patients
      </button>

      {/* Patient header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <UserCircle className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">
                      {patient.firstName} {patient.lastName}
                    </h1>
                    <StatusBadge status={patient.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    MRN: <span className="font-mono font-medium text-primary">{patient.medicalRecordNumber}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      {patient.gender === "male" ? "Male" : patient.gender === "female" ? "Female" : "Other"}
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      DOB: {patient.dateOfBirth}
                    </span>
                    {patient.bloodGroup && (
                      <Badge variant="outline" className="gap-1">
                        <Heart className="h-3 w-3 text-red-500" />
                        {patient.bloodGroup}
                      </Badge>
                    )}
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      Registered {formatDate(patient.registrationDate)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/patients/${patientId}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
              </div>
            </div>

            {/* Quick contact info */}
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {formatPhone(patient.phone)}
              </span>
              {patient.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {patient.email}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                {patient.address.city}, {patient.address.state}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-sm font-medium transition-colors relative ${
              activeTab === tab.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <motion.div
                layoutId="activePatientTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab patient={patient} />}
      {activeTab === "adt" && <AdmissionTab patientId={patientId!} />}
      {activeTab === "medical" && <MedicalTab patientId={patientId!} />}
      {activeTab === "appointments" && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Appointments</h3>
            <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      )}
      {activeTab === "billing" && (
        <Card>
          <CardContent className="py-12 text-center">
            <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">Billing History</h3>
            <p className="mt-2 text-sm text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>
      )}
    </PageContainer>
  );
}

// ── Medical History Tab ──────────────────────────────────
function MedicalTab({ patientId }: { patientId: string }) {
  const navigate = useNavigate();
  const records = useQuery(api.medical_records.queries.listRecordsByPatient, {
    patientId: patientId as any,
  });

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {records ? `${records.length} record(s)` : ""}
        </p>
        <Button
          size="sm"
          onClick={() => navigate(`/medical-records/new?patientId=${patientId}`)}
        >
          <FileText className="mr-2 h-4 w-4" /> New Record
        </Button>
      </div>

      {!records ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Medical Records</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No records have been created for this patient yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const color = recordTypeColors[record.recordType] ?? "bg-gray-100 text-gray-800";
            const label = recordTypeLabels[record.recordType] ?? record.recordType;
            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => navigate(`/medical-records/${record._id}`)}
                  className="w-full text-left"
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Stethoscope className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
                              {label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(record.createdAt)}
                            </span>
                          </div>
                          {record.diagnosis && (
                            <p className="mt-1 text-sm font-medium line-clamp-1">{record.diagnosis}</p>
                          )}
                          {record.symptoms.length > 0 && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {record.symptoms.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Admission Tab ──────────────────────────────────
function AdmissionTab({ patientId }: { patientId: string }) {
  const nav = useNavigate();
  const activeAdmission = useQuery(api.adt.queries.getActiveAdmission, { patientId: patientId as any });
  const admissionHistory = useQuery(api.adt.queries.getPatientAdmissions, { patientId: patientId as any });

  return (
    <div className="space-y-6">
      {activeAdmission ? (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base text-green-700"><DoorOpen className="h-5 w-5" /> Currently Admitted</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Admitted:</span> {formatDate(activeAdmission.admissionDate)}</p>
            {activeAdmission.diagnosis && <p><span className="text-muted-foreground">Diagnosis:</span> {activeAdmission.diagnosis}</p>}
            {activeAdmission.expectedDischargeDate && <p><span className="text-muted-foreground">Expected Discharge:</span> {formatDate(activeAdmission.expectedDischargeDate)}</p>}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center">
            <Bed className="h-10 w-10 text-muted-foreground/50" />
            <h3 className="mt-3 text-lg font-semibold">Not Currently Admitted</h3>
            <p className="mt-1 text-sm text-muted-foreground">This patient is not admitted to the hospital.</p>
            <Button className="mt-4" size="sm" onClick={() => nav(`/patients/admit?patientId=${patientId}`)}>
              <Bed className="mr-2 h-4 w-4" /> Admit Patient
            </Button>
          </CardContent>
        </Card>
      )}

      {admissionHistory && admissionHistory.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Admission History</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {admissionHistory.map(({ assignment }) => (
              <div key={assignment._id} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                <div className={`h-2 w-2 rounded-full ${assignment.status === "active" ? "bg-green-500" : assignment.status === "discharged" ? "bg-gray-400" : "bg-blue-500"}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{assignment.status}</span>
                    <StatusBadge status={assignment.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Admitted {formatDate(assignment.admissionDate)}
                    {assignment.actualDischargeDate && ` · Discharged ${formatDate(assignment.actualDischargeDate)}`}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────
function OverviewTab({ patient }: { patient: Doc<"patients"> }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{patient.address.street}</p>
          <p>{patient.address.city}, {patient.address.state} {patient.address.zipCode}</p>
          <p>{patient.address.country}</p>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p className="font-medium">{patient.emergencyContact.name}</p>
          <p className="text-muted-foreground">{patient.emergencyContact.relationship}</p>
          <p className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            {formatPhone(patient.emergencyContact.phone)}
          </p>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy) => (
                <Badge key={allergy} variant="warning">
                  {allergy}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No known allergies</p>
          )}
        </CardContent>
      </Card>

      {/* Chronic Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Chronic Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.chronicConditions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.map((condition) => (
                <Badge key={condition} variant="destructive">
                  {condition}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No chronic conditions recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Insurance */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            Insurance Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patient.insuranceProvider ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Provider</p>
                <p className="text-sm font-medium">{patient.insuranceProvider}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Policy Number</p>
                <p className="text-sm font-medium">{patient.insurancePolicyNumber ?? "—"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No insurance information on file</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
