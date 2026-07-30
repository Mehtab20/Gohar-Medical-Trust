import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FlaskConical,
  Search,
  Beaker,
  Syringe,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const COMMON_TESTS = [
  { name: "Complete Blood Count (CBC)", code: "CBC", sampleType: "blood", category: "Hematology" },
  { name: "Hemoglobin (Hb)", code: "HB", sampleType: "blood", category: "Hematology" },
  { name: "Blood Sugar (Fasting)", code: "BSF", sampleType: "blood", category: "Biochemistry" },
  { name: "Blood Sugar (Random)", code: "BSR", sampleType: "blood", category: "Biochemistry" },
  { name: "HbA1c", code: "HBA1C", sampleType: "blood", category: "Biochemistry" },
  { name: "Lipid Profile", code: "LIPID", sampleType: "blood", category: "Biochemistry" },
  { name: "Liver Function Test (LFT)", code: "LFT", sampleType: "blood", category: "Biochemistry" },
  { name: "Renal Function Test (RFT)", code: "RFT", sampleType: "blood", category: "Biochemistry" },
  { name: "Serum Electrolytes", code: "ELYTE", sampleType: "blood", category: "Biochemistry" },
  { name: "Thyroid Function Test (TFT)", code: "TFT", sampleType: "blood", category: "Hormones" },
  { name: "Urine Routine Examination", code: "URE", sampleType: "urine", category: "Microbiology" },
  { name: "Urine Culture & Sensitivity", code: "UCS", sampleType: "urine", category: "Microbiology" },
  { name: "Stool Routine Examination", code: "SRE", sampleType: "stool", category: "Microbiology" },
  { name: "Malaria Parasite (MP)", code: "MP", sampleType: "blood", category: "Microbiology" },
  { name: "Dengue NS1/IgM/IgG", code: "DENGUE", sampleType: "blood", category: "Microbiology" },
  { name: "Hepatitis B Surface Antigen", code: "HBSAG", sampleType: "blood", category: "Serology" },
  { name: "Hepatitis C Virus (HCV)", code: "HCV", sampleType: "blood", category: "Serology" },
  { name: "Widal Test (Typhoid)", code: "WIDAL", sampleType: "blood", category: "Serology" },
  { name: "CRP (C-Reactive Protein)", code: "CRP", sampleType: "blood", category: "Serology" },
  { name: "ESR", code: "ESR", sampleType: "blood", category: "Hematology" },
  { name: "Blood Grouping & Rh Type", code: "BGRP", sampleType: "blood", category: "Hematology" },
  { name: "Coagulation Profile (PT/APTT)", code: "COAG", sampleType: "blood", category: "Hematology" },
  { name: "Sputum AFB (TB)", code: "AFB", sampleType: "sputum", category: "Microbiology" },
  { name: "ECG", code: "ECG", sampleType: "other", category: "Cardiology" },
];

const categories = [...new Set(COMMON_TESTS.map((t) => t.category))];

export default function NewLabOrderPage() {
  const navigate = useNavigate();
  const patients = useQuery(api.patients.queries.listPatients, { status: "active" });
  const doctors = useQuery(api.users.queries.listUsersByRole, { role: "doctor" });
  const createOrder = useMutation(api.lab.mutations.createLabOrder);

  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedTestCode, setSelectedTestCode] = useState("");
  const [priority, setPriority] = useState<"routine" | "urgent" | "stat">("routine");
  const [notes, setNotes] = useState("");
  const [clinicalHistory, setClinicalHistory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedTest = useMemo(
    () => COMMON_TESTS.find((t) => t.code === selectedTestCode),
    [selectedTestCode],
  );

  const filteredTests = useMemo(() => {
    let tests = COMMON_TESTS;
    if (categoryFilter) tests = tests.filter((t) => t.category === categoryFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      tests = tests.filter(
        (t) => t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q),
      );
    }
    return tests;
  }, [searchQuery, categoryFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedPatientId) { setError("Please select a patient"); return; }
    if (!selectedDoctorId) { setError("Please select a doctor"); return; }
    if (!selectedTestCode) { setError("Please select a test"); return; }

    const test = COMMON_TESTS.find((t) => t.code === selectedTestCode);
    if (!test) { setError("Invalid test selected"); return; }

    setIsSubmitting(true);
    try {
      await createOrder({
        patientId: selectedPatientId as any,
        doctorId: selectedDoctorId as any,
        testType: test.name,
        testCode: test.code,
        priority,
        notes: notes.trim() || undefined,
        clinicalHistory: clinicalHistory.trim() || undefined,
      });
      navigate("/lab");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <button
        onClick={() => navigate("/lab")}
        className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Lab
      </button>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient & Doctor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FlaskConical className="h-4 w-4 text-primary" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient">Patient *</Label>
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
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
                  <Label htmlFor="doctor">Referring Doctor *</Label>
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT (Immediate)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Beaker className="h-4 w-4 text-primary" />
                Select Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTest ? (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <div>
                    <p className="font-medium">{selectedTest.name}</p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{selectedTest.code}</Badge>
                      <span className="flex items-center gap-1">
                        <Syringe className="h-3 w-3" />
                        {selectedTest.sampleType}
                      </span>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedTestCode("")}>
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  {/* Search & Category Filters */}
                  <div className="mb-4 space-y-3">
                    <Input
                      placeholder="Search test by name or code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setCategoryFilter(null)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                          categoryFilter === null ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                            categoryFilter === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Test List */}
                  <div className="max-h-80 space-y-1 overflow-y-auto rounded-lg border">
                    {filteredTests.map((test) => (
                      <button
                        key={test.code}
                        type="button"
                        onClick={() => {
                          setSelectedTestCode(test.code);
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{test.code}</span>
                            <span>·</span>
                            <span>{test.sampleType}</span>
                            <span>·</span>
                            <span>{test.category}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                    {filteredTests.length === 0 && (
                      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                        <Search className="mr-2 h-4 w-4" />
                        No tests found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Clinical History & Notes */}
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="history">Clinical History (optional)</Label>
                  <Textarea
                    id="history"
                    value={clinicalHistory}
                    onChange={(e) => setClinicalHistory(e.target.value)}
                    placeholder="Relevant clinical information for the lab..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Special instructions for the lab technician..."
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting || !selectedTestCode}>
              {isSubmitting ? "Creating Order..." : "Create Lab Order"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/lab")}>
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}
