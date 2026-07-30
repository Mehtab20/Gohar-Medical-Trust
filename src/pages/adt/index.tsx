import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/data/status-badge";
import { formatDate } from "@/lib/utils";
import {
  Loader2, Bed, User, Building2,
  Calendar, DoorOpen, ArrowUpRight, LogOut, AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function WardOverviewPage() {
  const navigate = useNavigate();
  const [showDischarge, setShowDischarge] = useState<string | null>(null);
  const [dischargeNotes, setDischargeNotes] = useState("");

  const wardStats = useQuery(api.adt.queries.getWardStats);
  const activeAdmissions = useQuery(api.adt.queries.listActiveAdmissions);
  const dischargePatient = useMutation(api.adt.mutations.dischargePatient);

  const handleDischarge = async (assignmentId: string) => {
    try {
      await dischargePatient({ assignmentId: assignmentId as any, dischargeNotes: dischargeNotes || undefined });
      toast.success("Patient discharged");
      setShowDischarge(null);
      setDischargeNotes("");
    } catch {
      toast.error("Failed to discharge patient");
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Ward Overview" description="Active admissions, bed occupancy, and patient management" />

      {wardStats && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-primary">{wardStats.occupancyRate}%</p><p className="text-xs text-muted-foreground">Occupancy Rate</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-green-600">{wardStats.availableBeds}</p><p className="text-xs text-muted-foreground">Available Beds</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-amber-600">{wardStats.occupiedBeds}</p><p className="text-xs text-muted-foreground">Occupied Beds</p></CardContent></Card>
          <Card><CardContent className="p-4 text-center"><p className="text-3xl font-bold text-blue-600">{wardStats.activeAdmissions}</p><p className="text-xs text-muted-foreground">Active Patients</p></CardContent></Card>
        </motion.div>
      )}

      {wardStats && wardStats.departments.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wardStats.departments.map((dept: any) => {
            const occupancyRate = dept.totalBeds > 0 ? Math.round((dept.occupiedBeds / dept.totalBeds) * 100) : 0;
            return (
              <Card key={dept.departmentId} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{dept.departmentName}</p>
                    <span className="text-xs text-muted-foreground">{dept.availableBeds} free / {dept.totalBeds}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyRate > 80 ? "bg-red-500" :
                        occupancyRate > 50 ? "bg-amber-500" : "bg-green-500"
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2"><DoorOpen className="h-5 w-5 text-primary" /> Currently Admitted</CardTitle>
          <Button size="sm" onClick={() => navigate("/patients/admit")}><Bed className="mr-2 h-4 w-4" /> Admit Patient</Button>
        </CardHeader>
        <CardContent className="p-0">
          {activeAdmissions === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : activeAdmissions.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Bed className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No active admissions</h3>
              <p className="mt-2 text-sm text-muted-foreground">No patients are currently admitted.</p>
              <Button className="mt-4" onClick={() => navigate("/patients/admit")}>Admit a Patient</Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {(activeAdmissions as any[]).map((item, idx) => {
                const { assignment, patient, room } = item;
                if (!patient || !room) return null;
                return (
                  <motion.div
                    key={assignment._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{patient.firstName} {patient.lastName}</p>
                            <StatusBadge status="active" />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {room.departmentName ?? "—"}</span>
                            <span className="flex items-center gap-1"><Bed className="h-3 w-3" /> {room.roomNumber}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Admitted {formatDate(assignment.admissionDate)}</span>
                          </div>
                          {assignment.diagnosis && (
                            <p className="mt-1 text-xs text-muted-foreground"><AlertTriangle className="inline h-3 w-3 mr-1" />{assignment.diagnosis}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/patients/${patient._id}`)}>
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setShowDischarge(assignment._id)}>
                          <LogOut className="mr-1 h-4 w-4" /> Discharge
                        </Button>
                      </div>
                    </div>

                    {showDischarge === assignment._id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 pl-14">
                        <textarea
                          value={dischargeNotes}
                          onChange={(e) => setDischargeNotes(e.target.value)}
                          placeholder="Discharge notes / summary (optional)"
                          rows={2}
                          className="w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => handleDischarge(assignment._id)}>
                            Confirm Discharge
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setShowDischarge(null)}>Cancel</Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
