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
import { Loader2, Bed, User, Building2 } from "lucide-react";

export default function AdmitPatientPage() {
  const navigate = useNavigate();
  const admitPatient = useMutation(api.adt.mutations.admitPatient);

  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [expectedStay, setExpectedStay] = useState("3");

  const patients = useQuery(api.patients.queries.searchPatients, {
    searchTerm: patientSearch || " ",
  });
  const departments = useQuery(api.departments.queries.listActiveDepartments);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");

  const availableBeds = useQuery(
    api.adt.queries.getAvailableBeds,
    selectedDepartmentId
      ? { departmentId: selectedDepartmentId as any }
      : {},
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedRoomId) {
      toast.error("Please select both a patient and a bed");
      return;
    }

    try {
      const days = parseInt(expectedStay) || 3;
      const expectedDischargeDate = Date.now() + days * 24 * 60 * 60 * 1000;

      await admitPatient({
        patientId: selectedPatientId as any,
        roomId: selectedRoomId as any,
        diagnosis: diagnosis || undefined,
        expectedDischargeDate,
      });

      const patient = patients?.find((p) => p._id === selectedPatientId);
      toast.success("Patient admitted", {
        description: `${patient?.firstName} ${patient?.lastName} has been admitted.`,
      });
      navigate("/adt");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to admit patient";
      toast.error("Admission failed", { description: message });
    }
  };

  const canSubmit = selectedPatientId && selectedRoomId;

  return (
    <PageContainer>
      <PageHeader title="Admit Patient" description="Assign a bed and admit a patient" />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Patient */}
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{p.firstName} {p.lastName}</p>
                      <p className="text-xs text-muted-foreground truncate">{p.medicalRecordNumber} · {p.phone}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : patientSearch ? (
              <p className="text-sm text-muted-foreground">No patients found. Register first.</p>
            ) : (
              <p className="text-sm text-muted-foreground">Type to search for patients.</p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Admission Details */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" /> Admission Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Department</Label>
              <select
                value={selectedDepartmentId}
                onChange={(e) => { setSelectedDepartmentId(e.target.value); setSelectedRoomId(""); }}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">All departments</option>
                {departments?.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Diagnosis / Reason for Admission</Label>
              <Input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Pneumonia, Fractured leg" />
            </div>
            <div className="space-y-2">
              <Label>Expected Stay (days)</Label>
              <Input type="number" value={expectedStay} onChange={(e) => setExpectedStay(e.target.value)} min={1} max={90} />
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Bed Selection */}
        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Bed className="h-5 w-5" /> Select Bed</CardTitle></CardHeader>
          <CardContent>
            {availableBeds === undefined ? (
              <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : availableBeds.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No available beds. All rooms are at capacity or under maintenance.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {availableBeds.map((room: any) => (
                  <button
                    key={room._id}
                    type="button"
                    onClick={() => setSelectedRoomId(room._id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      selectedRoomId === room._id
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "hover:border-primary/50 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{room.roomNumber}</p>
                      <span className="text-xs text-muted-foreground capitalize">
                        {room.roomType.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Building2 className="h-3 w-3" /> {room.departmentName ?? "—"}
                      <span>·</span>
                      <span>Floor {room.floor}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${room.capacity > 0 ? ((room.capacity - room.occupiedBeds) / room.capacity) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {room.capacity - room.occupiedBeds} free
                      </span>
                    </div>
                    {room.ratePerDay > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">₨{room.ratePerDay.toLocaleString()}/day</p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate("/adt")}>Cancel</Button>
          <Button type="submit" disabled={!canSubmit}>
            <Bed className="mr-2 h-4 w-4" /> Admit Patient
          </Button>
        </div>
      </form>
    </PageContainer>
  );
}
