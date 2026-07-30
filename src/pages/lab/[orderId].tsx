import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  ArrowLeft,
  FlaskConical,
  User,
  Calendar,
  Clock,
  Syringe,
  Beaker,
  CheckCircle2,
  XCircle,
  Activity,
  AlertCircle,
  FileText,
  Stethoscope,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ordered: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="h-4 w-4" /> },
  sample_collected: { label: "Sample Collected", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: <Syringe className="h-4 w-4" /> },
  in_analysis: { label: "In Analysis", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: <Beaker className="h-4 w-4" /> },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle2 className="h-4 w-4" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-4 w-4" /> },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  routine: { label: "Routine", color: "bg-gray-100 text-gray-700" },
  urgent: { label: "Urgent", color: "bg-amber-100 text-amber-700" },
  stat: { label: "STAT", color: "bg-red-100 text-red-700" },
};

export default function LabOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const order = useQuery(api.lab.queries.getLabOrder, { orderId: orderId as any });
  const patient = order
    ? useQuery(api.patients.queries.getPatient, { patientId: order.patientId })
    : undefined;
  const doctor = order
    ? useQuery(api.users.queries.getUser, { userId: order.doctorId })
    : undefined;
  const labTechnicians = useQuery(api.users.queries.listUsersByRole, { role: "lab_technician" });
  const currentUser = useQuery(api.users.queries.getCurrentUser);

  const recordSample = useMutation(api.lab.mutations.recordSampleCollection);
  const enterResults = useMutation(api.lab.mutations.enterLabResults);
  const cancelOrder = useMutation(api.lab.mutations.cancelLabOrder);

  // Sample collection state
  const [sampleType, setSampleType] = useState(order?.sampleType ?? "blood");
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [isCollecting, setIsCollecting] = useState(false);

  // Results entry state
  const [resultValue, setResultValue] = useState(order?.resultValue ?? "");
  const [referenceRange, setReferenceRange] = useState("");
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [resultNotes, setResultNotes] = useState(order?.resultNotes ?? "");
  const [isEnteringResults, setIsEnteringResults] = useState(false);

  // Cancel state
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  const [error, setError] = useState("");

  if (!orderId) {
    navigate("/lab");
    return null;
  }

  if (order === undefined) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (order === null) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="text-lg font-semibold">Order Not Found</h2>
          <Button onClick={() => navigate("/lab")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lab
          </Button>
        </div>
      </PageContainer>
    );
  }

  const status = statusConfig[order.status]!;
  const priority = priorityConfig[order.priority]!;

  const handleRecordSample = async () => {
    if (!selectedCollectorId) { setError("Please select a collector"); return; }
    setIsCollecting(true);
    setError("");
    try {
      await recordSample({
        orderId: orderId as any,
        sampleType,
        sampleCollectedById: selectedCollectorId as any,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record sample");
    } finally {
      setIsCollecting(false);
    }
  };

  const handleEnterResults = async () => {
    if (!resultValue.trim()) { setError("Result value is required"); return; }
    if (!referenceRange.trim()) { setError("Reference range is required"); return; }
    setIsEnteringResults(true);
    setError("");
    try {
      await enterResults({
        orderId: orderId as any,
        resultValue: resultValue.trim(),
        referenceRange: referenceRange.trim(),
        isAbnormal,
        resultNotes: resultNotes.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to enter results");
    } finally {
      setIsEnteringResults(false);
    }
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    setError("");
    try {
      await cancelOrder({
        orderId: orderId as any,
        reason: cancelReason.trim() || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setIsCancelling(false);
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

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Header */}
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500" />
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <FlaskConical className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${priority.color}`}>
                      {priority.label}
                    </span>
                  </div>
                  <h1 className="mt-2 text-xl font-bold">{order.testType}</h1>
                  <p className="text-sm text-muted-foreground">Code: <span className="font-mono">{order.testCode}</span></p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {patient && (
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        {patient.firstName} {patient.lastName}
                      </span>
                    )}
                    {doctor && (
                      <span className="flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Dr. {doctor.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      Ordered {formatDate(order._creationTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Collection Section (for pending orders) */}
        {order.status === "ordered" && (
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Syringe className="h-4 w-4 text-amber-500" />
                Record Sample Collection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sampleType">Sample Type</Label>
                  <select
                    id="sampleType"
                    value={sampleType}
                    onChange={(e) => setSampleType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="blood">Blood</option>
                    <option value="urine">Urine</option>
                    <option value="stool">Stool</option>
                    <option value="sputum">Sputum</option>
                    <option value="tissue">Tissue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collector">Collected By</Label>
                  <select
                    id="collector"
                    value={selectedCollectorId}
                    onChange={(e) => setSelectedCollectorId(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select lab technician...</option>
                    {currentUser && (
                      <option value={currentUser._id}>{currentUser.name} (Me)</option>
                    )}
                    {labTechnicians?.filter((t) => t._id !== currentUser?._id).map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Button onClick={handleRecordSample} disabled={isCollecting || !selectedCollectorId}>
                {isCollecting ? "Recording..." : "Record Sample Collection"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Entry (for pending/collected/in_analysis orders) */}
        {(order.status === "ordered" || order.status === "sample_collected" || order.status === "in_analysis") && (
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Beaker className="h-4 w-4 text-purple-500" />
                Enter Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="result">Result Value *</Label>
                  <Input
                    id="result"
                    value={resultValue}
                    onChange={(e) => setResultValue(e.target.value)}
                    placeholder="e.g. 12.5, Positive, Normal..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refRange">Reference Range *</Label>
                  <Input
                    id="refRange"
                    value={referenceRange}
                    onChange={(e) => setReferenceRange(e.target.value)}
                    placeholder="e.g. 4.0-11.0, Negative..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resultNotes">Result Notes (optional)</Label>
                <Textarea
                  id="resultNotes"
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                  placeholder="Additional notes for the result..."
                  rows={2}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isAbnormal}
                  onChange={(e) => setIsAbnormal(e.target.checked)}
                  className="rounded border-border"
                />
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  Mark as abnormal
                </span>
              </label>
              <Button
                onClick={handleEnterResults}
                disabled={isEnteringResults || !resultValue.trim() || !referenceRange.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                {isEnteringResults ? "Saving..." : "Complete & Submit Results"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results Display (for completed orders) */}
        {order.status === "completed" && order.resultValue && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-4 w-4 text-green-600" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Result</p>
                  <p className={`mt-1 text-lg font-semibold ${order.isAbnormal ? "text-destructive" : "text-green-700"}`}>
                    {order.resultValue}
                  </p>
                  {order.isAbnormal && (
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                      <AlertCircle className="h-3 w-3" /> Abnormal
                    </span>
                  )}
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Reference Range</p>
                  <p className="mt-1 text-lg font-semibold">{order.referenceRange}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="mt-1 font-medium">{formatDate(order.completedAt!)}</p>
                </div>
              </div>
              {order.resultNotes && (
                <div className="rounded-lg bg-muted/30 p-3">
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="mt-1 text-sm">{order.resultNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sample Info Section */}
        {order.sampleCollectedAt && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Syringe className="h-4 w-4 text-muted-foreground" />
                Sample Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Sample Type</p>
                  <p className="font-medium capitalize">{order.sampleType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Collected At</p>
                  <p>{formatDate(order.sampleCollectedAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Collected By</p>
                  <p>Tech ID: {order.sampleCollectedById}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Cancel Section (only for non-completed/non-cancelled) */}
        {order.status !== "completed" && order.status !== "cancelled" && (
          <details className="group">
            <summary className="cursor-pointer text-sm text-destructive hover:text-destructive/80">
              Cancel this order
            </summary>
            <div className="mt-3 space-y-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <div className="space-y-2">
                <Label htmlFor="cancelReason">Reason for cancellation</Label>
                <Textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Why is this order being cancelled?"
                  rows={2}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </details>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </motion.div>
    </PageContainer>
  );
}
