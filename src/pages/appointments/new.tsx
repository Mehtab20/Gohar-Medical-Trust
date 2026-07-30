import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/data/search-input";
import { Loader2, Calendar, Clock, User } from "lucide-react";
import { APPOINTMENT_TYPES } from "@/lib/constants";

export default function NewAppointmentPage() {
  const navigate = useNavigate();
  const createAppointment = useMutation(api.appointments.mutations.createAppointment);

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentType, setAppointmentType] = useState("checkup");
  const [priority, setPriority] = useState("routine");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const patients = useQuery(api.patients.queries.searchPatients, {
    searchTerm: patientSearch || " ",
  });
  const doctors = useQuery(api.users.queries.listUsers, { role: "doctor" });
  const departments = useQuery(api.departments.queries.listActiveDepartments);
  const selectedDateTs = selectedDate ? new Date(selectedDate).getTime() : undefined;
  const availableSlots = useQuery(
    api.appointments.queries.getAvailableSlots,
    selectedDoctorId && selectedDateTs
      ? { doctorId: selectedDoctorId as any, date: selectedDateTs }
      : "skip",
  );

  const canSubmit = selectedPatientId && selectedDoctorId && selectedSlot && reason;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !selectedDateTs) return;

    const [startTime, endTime] = selectedSlot.split("-");
    if (!startTime || !endTime) return;

    try {
      const patient = patients?.find((p) => p._id === selectedPatientId);
      const doctor = doctors?.find((d) => d._id === selectedDoctorId);

      const appointmentId = await createAppointment({
        patientId: selectedPatientId as any,
        doctorId: selectedDoctorId as any,
        departmentId: departments?.[0]?._id as any,
        appointmentType: appointmentType as any,
        scheduledDate: selectedDateTs,
        startTime,
        endTime,
        duration: 30,
        reason,
        notes: notes || undefined,
        priority: priority as any,
      });

      toast.success("Appointment booked", {
        description: `${patient?.firstName} ${patient?.lastName} with ${doctor?.name} at ${startTime}`,
      });
      navigate(`/appointments/${appointmentId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to book appointment";
      toast.error("Booking failed", { description: message });
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Book Appointment" description="Schedule a new patient appointment" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" /> Select Patient</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <SearchInput value={patientSearch} onChange={setPatientSearch} placeholder="Search patients by name, MRN, or phone..." />
            {patients && patients.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 max-h-48 overflow-y-auto">
                {patients.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    onClick={() => { setSelectedPatientId(p._id); setPatientSearch(`${p.firstName} ${p.lastName}`); }}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      selectedPatientId === p._id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-muted-foreground">{p.medicalRecordNumber} · {p.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : patientSearch ? (
              <p className="text-sm text-muted-foreground">No patients found. Register a new patient first.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Type to search for patients.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5" /> Doctor & Schedule</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Doctor *</Label>
              <select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} required
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="">Select doctor</option>
                {doctors?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date *</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                {APPOINTMENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t.replace(/\b\w/g, (c) => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                <option value="routine">Routine</option>
                <option value="urgent">Urgent</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Reason for visit *</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="e.g. Follow-up checkup, Persistent headache" />
            </div>
          </CardContent>
        </Card>

        {selectedDoctorId && selectedDate && (
          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Clock className="h-5 w-5" /> Available Time Slots</CardTitle></CardHeader>
            <CardContent>
              {availableSlots === undefined ? (
                <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-muted-foreground">No available slots for this date. Try another day.</p>
              ) : (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {availableSlots.map((slot) => {
                    const [start] = slot.split("-");
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-lg border p-2 text-center text-xs transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-primary-foreground"
                            : "hover:border-primary/50 hover:bg-muted"
                        }`}
                      >
                        <span className="font-medium">{start}</span>
                        <span className="block text-[10px] opacity-70">30 min</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-base">Notes (Optional)</CardTitle></CardHeader>
          <CardContent>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes or instructions"
              rows={3}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/appointments")}>Cancel</Button>
          <Button type="submit" disabled={!canSubmit}>Book Appointment</Button>
        </div>
      </form>
    </PageContainer>
  );
}
