import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Waves,
  Weight,
  Ruler,
  ShieldAlert,
  Clock,
  Stethoscope,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";


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
  admission: "bg-purple-100 text-purple-800",
  discharge_summary: "bg-green-100 text-green-800",
  surgery: "bg-red-100 text-red-800",
  followup: "bg-amber-100 text-amber-800",
  lab_report: "bg-cyan-100 text-cyan-800",
  imaging_report: "bg-indigo-100 text-indigo-800",
};

export default function MedicalRecordDetailPage() {
  const { recordId } = useParams<{ recordId: string }>();
  const navigate = useNavigate();

  const record = useQuery(api.medical_records.queries.getMedicalRecord, {
    recordId: recordId as any,
  });

  const patient = record
    ? useQuery(api.patients.queries.getPatient, { patientId: record.patientId })
    : undefined;

  const doctor = record
    ? useQuery(api.users.queries.getUser, { userId: record.doctorId })
    : undefined;

  if (!recordId) {
    navigate("/medical-records");
    return null;
  }

  if (record === undefined) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (record === null) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <ShieldAlert className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold">Record Not Found</h2>
          <p className="text-sm text-muted-foreground">This record doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate("/medical-records")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Records
          </Button>
        </div>
      </PageContainer>
    );
  }

  const vitals = record.vitalSigns;
  const typeLabel = recordTypeLabels[record.recordType] ?? record.recordType;
  const typeColor = recordTypeColors[record.recordType] ?? "bg-gray-100 text-gray-800";

  return (
    <PageContainer>
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${typeColor}`}>
                      {typeLabel}
                    </span>
                    {record.isConfidential && (
                      <Badge variant="warning">Confidential</Badge>
                    )}
                  </div>
                  <h1 className="mt-2 text-2xl font-bold">
                    {patient ? `${patient.firstName} ${patient.lastName}` : "Patient"}
                  </h1>
                  {record.diagnosis && (
                    <p className="mt-1 text-lg text-muted-foreground">{record.diagnosis}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {doctor && (
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5" />
                        {doctor.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(record.createdAt)}
                    </span>
                    {patient && (
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {patient.medicalRecordNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        {record.symptoms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-amber-500" />
                Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vital Signs */}
        {vitals && Object.keys(vitals).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Heart className="h-4 w-4 text-red-500" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {vitals.bloodPressure && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" /> Blood Pressure
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.bloodPressure}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                )}
                {vitals.heartRate && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" /> Heart Rate
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.heartRate}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                )}
                {vitals.temperature && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Thermometer className="h-3 w-3" /> Temperature
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.temperature}°C</p>
                  </div>
                )}
                {vitals.respiratoryRate && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Wind className="h-3 w-3" /> Respiratory Rate
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.respiratoryRate}</p>
                    <p className="text-xs text-muted-foreground">/min</p>
                  </div>
                )}
                {vitals.oxygenSaturation && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Waves className="h-3 w-3" /> O2 Saturation
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.oxygenSaturation}%</p>
                  </div>
                )}
                {vitals.weight && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Weight className="h-3 w-3" /> Weight
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.weight}</p>
                    <p className="text-xs text-muted-foreground">kg</p>
                  </div>
                )}
                {vitals.height && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Ruler className="h-3 w-3" /> Height
                    </p>
                    <p className="mt-1 text-lg font-semibold">{vitals.height}</p>
                    <p className="text-xs text-muted-foreground">cm</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treatment Plan */}
        {record.treatmentPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{record.treatmentPlan}</p>
            </CardContent>
          </Card>
        )}

        {/* Clinical Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Clinical Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{record.notes}</p>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Record Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p>{formatDate(record.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Record Type</p>
                <p>{typeLabel}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Confidential</p>
                <p>{record.isConfidential ? "Yes" : "No"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
