import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/data/data-table";
import { SearchInput } from "@/components/data/search-input";
import { StatusBadge } from "@/components/data/status-badge";
import { EmptyState } from "@/components/data/empty-state";
import { Plus, Users, Phone, Mail, Calendar, UserCircle } from "lucide-react";
import { formatDate, formatPhone } from "@/lib/utils";
import { motion } from "framer-motion";
import type { Doc } from "@convex/_generated/dataModel";

type Patient = Doc<"patients">;

const columns: Column<Patient>[] = [
  {
    key: "mrn",
    header: "MRN",
    sortable: true,
    className: "font-mono text-xs w-32",
    render: (p) => <span className="text-primary font-medium">{p.medicalRecordNumber}</span>,
  },
  {
    key: "name",
    header: "Patient Name",
    sortable: true,
    render: (p) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
          <UserCircle className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium">{p.firstName} {p.lastName}</p>
          <p className="text-xs text-muted-foreground">{p.gender === "male" ? "Male" : p.gender === "female" ? "Female" : "Other"} · {p.dateOfBirth}</p>
        </div>
      </div>
    ),
  },
  {
    key: "phone",
    header: "Contact",
    render: (p) => (
      <div className="space-y-1">
        <p className="flex items-center gap-1.5 text-sm">
          <Phone className="h-3.5 w-3.5 text-muted-foreground" />
          {formatPhone(p.phone)}
        </p>
        {p.email && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {p.email}
          </p>
        )}
      </div>
    ),
  },
  {
    key: "registered",
    header: "Registered",
    sortable: true,
    render: (p) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        {formatDate(p.registrationDate)}
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    className: "w-24",
    render: (p) => <StatusBadge status={p.status} />,
  },
];

export default function PatientsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Use search query when user is actively searching, otherwise use status-filtered list
  const searchResults = useQuery(
    api.patients.queries.searchPatients,
    searchTerm.trim() ? { searchTerm: searchTerm.trim() } : "skip",
  );

  const patientsByStatus = useQuery(
    api.patients.queries.listPatients,
    statusFilter
      ? { status: statusFilter as "active" | "inactive" }
      : "skip",
  );

  // Determine which data source to use
  const isSearching = searchTerm.trim().length > 0;
  const isFiltering = statusFilter.length > 0;
  const allPatients = useQuery(api.patients.queries.listPatients, {});

  const patients = isSearching
    ? searchResults
    : isFiltering
      ? patientsByStatus
      : allPatients;
  const isLoading = patients === undefined;

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  return (
    <PageContainer>
      <PageHeader
        title="Patients"
        description="Manage patient records and demographics"
        actions={
          <Button onClick={() => navigate("/patients/new")}>
            <Plus className="mr-2 h-4 w-4" /> Register New Patient
          </Button>
        }
      />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <SearchInput
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name, MRN, or phone..."
          className="sm:w-80"
        />
        <div className="flex gap-2">
          {["", "active", "inactive"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status === "" ? "All" : status === "active" ? "Active" : "Inactive"}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {!isLoading && patients && patients.length === 0 ? (
            <EmptyState
              icon={<Users className="h-8 w-8 text-muted-foreground/50" />}
              title={searchTerm ? "No patients found" : "No patients registered yet"}
              description={
                searchTerm
                  ? "Try a different search term or clear the filters."
                  : "Register your first patient to get started."
              }
              action={
                !searchTerm && (
                  <Button onClick={() => navigate("/patients/new")}>
                    <Plus className="mr-2 h-4 w-4" /> Register First Patient
                  </Button>
                )
              }
            />
          ) : (
            <DataTable<Patient>
              columns={columns}
              data={(patients as Patient[]) ?? []}
              isLoading={isLoading}
              onRowClick={(patient) => navigate(`/patients/${patient._id}`)}
              emptyMessage="No patients found"
            />
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {patients && patients.length > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-xs text-muted-foreground"
        >
          Showing {patients.length} patient{patients.length !== 1 ? "s" : ""}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.p>
      )}
    </PageContainer>
  );
}
