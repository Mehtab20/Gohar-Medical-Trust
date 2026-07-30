import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/data/empty-state";
import { SearchInput } from "@/components/data/search-input";
import {
  ClipboardList,
  Plus,
  FileText,
  User,
  AlertCircle,
  Activity,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const recordTypeColors: Record<string, string> = {
  consultation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  admission: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  discharge_summary: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  surgery: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  followup: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  lab_report: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  imaging_report: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const recordTypeLabels: Record<string, string> = {
  consultation: "Consultation",
  admission: "Admission Note",
  discharge_summary: "Discharge Summary",
  surgery: "Surgery Report",
  followup: "Follow-up",
  lab_report: "Lab Report",
  imaging_report: "Imaging Report",
};

export default function MedicalRecordsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientFilter = searchParams.get("patientId");

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const recentRecords = useQuery(api.medical_records.queries.listRecentRecords, { limit: 50 });
  const patients = useQuery(api.patients.queries.listPatients, {});

  const patientMap = useMemo(() => {
    if (!patients) return {};
    return Object.fromEntries(patients.map((p) => [p._id, p]));
  }, [patients]);

  const filteredRecords = useMemo(() => {
    if (!recentRecords) return [];

    let records = recentRecords;

    // Filter by patient if specified
    if (patientFilter) {
      records = records.filter((r) => r.patientId === patientFilter);
    }

    // Filter by type
    if (typeFilter) {
      records = records.filter((r) => r.recordType === typeFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      records = records.filter((r) => {
        const patient = patientMap[r.patientId];
        const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : "";
        const diagnosisMatch = r.diagnosis?.toLowerCase().includes(query);
        const notesMatch = r.notes.toLowerCase().includes(query);
        const typeMatch = recordTypeLabels[r.recordType]?.toLowerCase().includes(query);
        return patientName.includes(query) || diagnosisMatch || notesMatch || typeMatch;
      });
    }

    return records;
  }, [recentRecords, patientFilter, typeFilter, searchQuery, patientMap]);

  const recordTypes = Object.keys(recordTypeLabels);

  return (
    <PageContainer>
      <PageHeader
        title="Medical Records"
        description="View and manage patient medical records (EHR)"
      />
      {/* Header actions */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by patient, diagnosis, or notes..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-md"
        />
        <Button onClick={() => navigate("/medical-records/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Record
        </Button>
      </div>

      {/* Type filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter(null)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            typeFilter === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All
        </button>
        {recordTypes.map((type) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              typeFilter === type
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {recordTypeLabels[type]}
          </button>
        ))}
      </div>

      {/* Records list */}
      {!recentRecords ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filteredRecords.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-12 w-12" />}
          title="No medical records found"
          description={
            searchQuery || typeFilter || patientFilter
              ? "Try adjusting your search or filters"
              : "Start by creating the first medical record for a patient"
          }
          action={
            <Button onClick={() => navigate("/medical-records/new")}>
              <Plus className="mr-2 h-4 w-4" /> Create Record
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((record, index) => {
            const patient = patientMap[record.patientId];
            const typeColor = recordTypeColors[record.recordType] ?? "bg-gray-100 text-gray-800";

            return (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <button
                  onClick={() => navigate(`/medical-records/${record._id}`)}
                  className="w-full text-left"
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColor}`}>
                                {recordTypeLabels[record.recordType]}
                              </span>
                              {record.isConfidential && (
                                <Badge variant="warning" className="text-[10px]">
                                  Confidential
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(record.createdAt)}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-col gap-1.5">
                            {patient && (
                              <p className="flex items-center gap-1.5 text-sm font-medium">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                {patient.firstName} {patient.lastName}
                              </p>
                            )}
                            {record.diagnosis && (
                              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-1">{record.diagnosis}</span>
                              </p>
                            )}
                            {record.symptoms.length > 0 && (
                              <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                                <span className="line-clamp-1">{record.symptoms.join(", ")}</span>
                              </p>
                            )}
                          </div>
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
    </PageContainer>
  );
}
