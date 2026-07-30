import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/data/status-badge";
import {
  ArrowLeft, Calendar, Clock, User, AlertTriangle,
  Phone, Mail, Activity, CheckCircle, XCircle, Loader2,
} from "lucide-react";
import { formatDate, formatPhone } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Doc } from "@convex/_generated/dataModel";

type Appointment = Doc<"appointments">;

const STATUS_ACTIONS: { label: string; status: Appointment["status"]; icon: React.ReactNode; color: string }[] = [
  { label: "Confirm", status: "confirmed", icon: <CheckCircle className="h-4 w-4" />, color: "bg-blue-600" },
  { label: "Start", status: "in_progress", icon: <Activity className="h-4 w-4" />, color: "bg-amber-600" },
  { label: "Complete", status: "completed", icon: <CheckCircle className="h-4 w-4" />, color: "bg-green-600" },
  { label: "Cancel", status: "cancelled", icon: <XCircle className="h-4 w-4" />, color: "bg-red-600" },
  { label: "No Show", status: "no_show", icon: <AlertTriangle className="h-4 w-4" />, color: "bg-orange-600" },
];

export default function AppointmentDetailPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const appointment = useQuery(api.appointments.queries.getAppointment, {
    appointmentId: appointmentId as any,
  });
  const patient = useQuery(
    api.patients.queries.getPatient,
    appointment ? { patientId: appointment.patientId as any } : "skip",
  );
  const updateStatus = useMutation(api.appointments.mutations.updateAppointmentStatus);

  if (appointment === undefined) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageContainer>
    );
  }

  if (appointment === null) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <AlertTriangle className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold">Appointment Not Found</h2>
          <Button onClick={() => navigate("/appointments")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
      </PageContainer>
    );
  }

  const handleStatusChange = async (status: Appointment["status"]) => {
    try {
      await updateStatus({ appointmentId: appointmentId as any, status });
      toast.success(`Appointment ${status.replace(/_/g, " ")}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const statusActions = STATUS_ACTIONS.filter((a) => a.status !== appointment.status);
  const completedStatuses = ["completed", "cancelled", "no_show"];

  return (
    <PageContainer>
      <button onClick={() => navigate("/appointments")} className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Appointments
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className={`h-2 ${
            appointment.priority === "emergency" ? "bg-red-500" :
            appointment.priority === "urgent" ? "bg-amber-500" : "bg-blue-500"
          }`} />
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">Appointment</h1>
                  <StatusBadge status={appointment.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-4 w-4" /> {formatDate(appointment.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" /> {appointment.startTime} — {appointment.endTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className={`text-xs font-medium capitalize ${
                      appointment.priority === "emergency" ? "text-red-600" :
                      appointment.priority === "urgent" ? "text-amber-600" : "text-blue-600"
                    }`}>
                      {appointment.priority} priority
                    </span>
                  </span>
                </div>
              </div>

              {/* Status actions */}
              {!completedStatuses.includes(appointment.status) && (
                <div className="flex flex-wrap gap-2">
                  {statusActions.slice(0, 3).map((action) => (
                    <button
                      key={action.status}
                      onClick={() => handleStatusChange(action.status)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90 ${action.color}`}
                    >
                      {action.icon} {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Patient */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" /> Patient</CardTitle></CardHeader>
          <CardContent>
            {patient ? (
              <div className="space-y-2">
                <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                <p className="text-xs text-muted-foreground">MRN: {patient.medicalRecordNumber}</p>
                <div className="flex items-center gap-1.5 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {formatPhone(patient.phone)}
                </div>
                {patient.email && (
                  <div className="flex items-center gap-1.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {patient.email}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => navigate(`/patients/${patient._id}`)}
                >
                  View Patient
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Loading patient info...</p>
            )}
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" /> Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium capitalize">{appointment.appointmentType.replace(/_/g, " ")}</span></div>
            <div><span className="text-muted-foreground">Reason:</span> <span>{appointment.reason}</span></div>
            {appointment.notes && <div><span className="text-muted-foreground">Notes:</span> <span>{appointment.notes}</span></div>}
            <div><span className="text-muted-foreground">Duration:</span> <span>{appointment.duration} minutes</span></div>
            <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={appointment.status} /></div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
