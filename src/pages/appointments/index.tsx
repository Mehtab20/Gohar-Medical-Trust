import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/data/status-badge";
import { formatDate } from "@/lib/utils";
import { Plus, ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import type { Doc } from "@convex/_generated/dataModel";

type Appointment = Doc<"appointments">;

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(0);
  const weekDates = getWeekDates(currentDate);

  const selectedDate = weekDates[selectedDay];
  const dateTimestamp = selectedDate ? selectedDate.getTime() : Date.now();

  const appointments = useQuery(api.appointments.queries.listAppointmentsByDate, {
    date: dateTimestamp,
  });

  const patients = useQuery(api.patients.queries.listPatients, {});

  const patientMap = useMemo(() => {
    const map = new Map<string, Doc<"patients">>();
    if (patients) patients.forEach((p) => map.set(p._id, p));
    return map;
  }, [patients]);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday = (d: Date) =>
    d.getTime() === today.getTime();

  return (
    <PageContainer>
      <PageHeader
        title="Appointments"
        description="Schedule and manage patient appointments"
        actions={
          <Button onClick={() => navigate("/appointments/new")}>
            <Plus className="mr-2 h-4 w-4" /> Book Appointment
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="sm" onClick={prevWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="font-semibold">
              {formatDate(weekDates[0]!)} — {formatDate(weekDates[6]!)}
            </h3>
            <Button variant="outline" size="sm" onClick={nextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, i) => (
              <button
                key={i}
                onClick={() => setSelectedDay(i)}
                className={`rounded-lg p-2 text-center transition-all ${
                  selectedDay === i
                    ? "bg-primary text-primary-foreground"
                    : isToday(date)
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                }`}
              >
                <p className="text-xs font-medium">{DAYS_OF_WEEK[i]}</p>
                <p className={`text-lg font-bold ${selectedDay === i ? "text-white" : ""}`}>
                  {date.getDate()}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {appointments === undefined ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No appointments for this day</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Book appointments to see them here.
              </p>
              <Button className="mt-4" onClick={() => navigate("/appointments/new")}>
                <Plus className="mr-2 h-4 w-4" /> Book Appointment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {[...(appointments as Appointment[])]
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((apt, idx) => {
                  const patient = patientMap.get(apt.patientId);
                  return (
                    <motion.div
                      key={apt._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/appointments/${apt._id}`)}
                    >
                      <div className="w-20 shrink-0 text-center">
                        <p className="text-sm font-semibold">{apt.startTime}</p>
                        <p className="text-xs text-muted-foreground">{apt.endTime}</p>
                      </div>
                      <div className="flex flex-1 items-center gap-4">
                        <div className={`h-12 w-1 shrink-0 rounded-full ${
                          apt.priority === "emergency" ? "bg-red-500" :
                          apt.priority === "urgent" ? "bg-amber-500" : "bg-blue-500"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">
                              {patient ? `${patient.firstName} ${patient.lastName}` : "Unknown Patient"}
                            </p>
                            <StatusBadge status={apt.status} />
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {apt.appointmentType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            {apt.reason && ` · ${apt.reason}`}
                          </p>
                        </div>
                      </div>
                      <div className="hidden sm:block shrink-0">
                        <span className={`text-xs font-medium capitalize ${
                          apt.priority === "emergency" ? "text-red-600" :
                          apt.priority === "urgent" ? "text-amber-600" : "text-blue-600"
                        }`}>
                          {apt.priority}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {appointments && appointments.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          {appointments.length} appointment{appointments.length !== 1 ? "s" : ""} for {formatDate(dateTimestamp)}
        </p>
      )}
    </PageContainer>
  );
}
