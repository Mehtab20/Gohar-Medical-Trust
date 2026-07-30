import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/data/empty-state";
import { SearchInput } from "@/components/data/search-input";
import {
  FlaskConical,
  Plus,
  User,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Beaker,
  Syringe,
  FileText,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ordered: { label: "Pending", color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", icon: <Clock className="h-3.5 w-3.5" /> },
  sample_collected: { label: "Sample Collected", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", icon: <Syringe className="h-3.5 w-3.5" /> },
  in_analysis: { label: "In Analysis", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400", icon: <Beaker className="h-3.5 w-3.5" /> },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", icon: <XCircle className="h-3.5 w-3.5" /> },
};

const priorityColors: Record<string, string> = {
  routine: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  urgent: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  stat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type StatusTab = "all" | "ordered" | "sample_collected" | "in_analysis" | "completed" | "cancelled";

export default function LabPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const worklist = useQuery(api.lab.queries.getLabWorklist);
  const allOrders = useQuery(api.lab.queries.listLabOrders, {
    status: activeTab === "all" ? undefined : activeTab,
    limit: 100,
  });

  const patients = useQuery(api.patients.queries.listPatients, {});
  const patientMap = useMemo(() => {
    if (!patients) return {};
    return Object.fromEntries(patients.map((p) => [p._id, p]));
  }, [patients]);

  const filteredOrders = useMemo(() => {
    if (!allOrders) return [];
    if (!searchQuery.trim()) return allOrders;

    const q = searchQuery.toLowerCase();
    return allOrders.filter((order) => {
      const patient = patientMap[order.patientId];
      const patientName = patient ? `${patient.firstName} ${patient.lastName}`.toLowerCase() : "";
      return (
        patientName.includes(q) ||
        order.testType.toLowerCase().includes(q) ||
        order.testCode.toLowerCase().includes(q)
      );
    });
  }, [allOrders, searchQuery, patientMap]);

  const tabCounts = useMemo(() => {
    if (!worklist) return {};
    return {
      all: worklist.total,
      ordered: worklist.pending,
      sample_collected: worklist.collected,
      in_analysis: worklist.inAnalysis,
      completed: worklist.completed,
      cancelled: worklist.cancelled,
    };
  }, [worklist]);

  const tabs: { key: StatusTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "ordered", label: "Pending" },
    { key: "sample_collected", label: "Collected" },
    { key: "in_analysis", label: "In Analysis" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Lab Information System"
        description="Manage lab orders, sample collection, and test results"
      />

      {/* KPI Cards */}
      {worklist && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: "Pending", value: worklist.pending, icon: <Clock className="h-4 w-4" />, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30" },
            { label: "Collected", value: worklist.collected, icon: <Syringe className="h-4 w-4" />, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/30" },
            { label: "In Analysis", value: worklist.inAnalysis, icon: <Beaker className="h-4 w-4" />, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/30" },
            { label: "Completed", value: worklist.completed, icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-600 bg-green-50 dark:bg-green-950/30" },
            { label: "Total", value: worklist.total, icon: <FlaskConical className="h-4 w-4" />, color: "text-primary bg-primary/10" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actions bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search by patient name or test..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="max-w-md"
        />
        <Button onClick={() => navigate("/lab/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Order
        </Button>
      </div>

      {/* Status tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
            {tabCounts && tabCounts[tab.key] !== undefined && tabCounts[tab.key]! > 0 && (
              <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                activeTab === tab.key ? "bg-white/20" : "bg-primary/10 text-primary"
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {!allOrders ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={<FlaskConical className="h-12 w-12" />}
          title="No lab orders found"
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Create a new lab order to get started"
          }
          action={
            <Button onClick={() => navigate("/lab/new")}>
              <Plus className="mr-2 h-4 w-4" /> New Order
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order, index) => {
            const patient = patientMap[order.patientId];
            const status = statusConfig[order.status]!;
            const priority = priorityColors[order.priority]!;

            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
              >
                <button
                  onClick={() => navigate(`/lab/${order._id}`)}
                  className="w-full text-left"
                >
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <FlaskConical className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                                {status.icon}
                                <span className="ml-1">{status.label}</span>
                              </span>
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${priority}`}>
                                {order.priority}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(order._creationTime)}
                            </span>
                          </div>

                          <div className="mt-2">
                            {patient && (
                              <p className="flex items-center gap-1.5 text-sm font-medium">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                {patient.firstName} {patient.lastName}
                              </p>
                            )}
                            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" />
                              <span className="font-medium text-foreground">{order.testType}</span>
                              <span className="text-xs">({order.testCode})</span>
                            </p>
                          </div>

                          {order.resultValue && (
                            <div className="mt-2 flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
                              <span className="text-xs text-muted-foreground">Result:</span>
                              <span className={`text-sm font-medium ${order.isAbnormal ? "text-destructive" : "text-success"}`}>
                                {order.resultValue}
                              </span>
                              {order.isAbnormal && <AlertCircle className="h-3.5 w-3.5 text-destructive" />}
                            </div>
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
    </PageContainer>
  );
}
