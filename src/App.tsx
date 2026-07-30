import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "@/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import AuthPage from "@/pages/auth";
import DashboardPage from "@/pages/dashboard";
import PatientsPage from "@/pages/patients";
import NewPatientPage from "@/pages/patients/new";
import EditPatientPage from "@/pages/patients/edit";
import PatientDetailPage from "@/pages/patients/[patientId]";
import AppointmentsPage from "@/pages/appointments";
import NewAppointmentPage from "@/pages/appointments/new";
import AppointmentDetailPage from "@/pages/appointments/[appointmentId]";
import DepartmentsPage from "@/pages/admin/departments";
import RoomsPage from "@/pages/admin/rooms";
import WardOverviewPage from "@/pages/adt";
import AdmitPatientPage from "@/pages/patients/admit";
import NotFoundPage from "@/pages/not-found";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const returnTo = window.location.pathname + window.location.search;
    return <Navigate to={`/auth?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />
        <Route path="/patients/new" element={<NewPatientPage />} />
        <Route path="/patients/:patientId/edit" element={<EditPatientPage />} />
        <Route path="/patients/:patientId" element={<PatientDetailPage />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/appointments/new" element={<NewAppointmentPage />} />
        <Route path="/appointments/:appointmentId" element={<AppointmentDetailPage />} />
        <Route path="/admin" element={<DepartmentsPage />} />
        <Route path="/adt" element={<WardOverviewPage />} />
        <Route path="/patients/admit" element={<AdmitPatientPage />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/rooms" element={<RoomsPage />} />
        {/* Placeholder routes for future modules */}
        <Route path="/medical-records" element={<PlaceholderPage title="Medical Records" />} />
        <Route path="/billing" element={<PlaceholderPage title="Billing" />} />
        <Route path="/pharmacy" element={<PlaceholderPage title="Pharmacy" />} />
        <Route path="/lab" element={<PlaceholderPage title="Lab" />} />
        <Route path="/radiology" element={<PlaceholderPage title="Radiology" />} />
        <Route path="/inventory" element={<PlaceholderPage title="Inventory" />} />
        <Route path="/staff" element={<PlaceholderPage title="Staff" />} />
        <Route path="/hr" element={<PlaceholderPage title="HR" />} />
        <Route path="/reports" element={<PlaceholderPage title="Reports" />} />
        <Route path="/admin/settings" element={<PlaceholderPage title="Settings" />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// Temporary placeholder for modules not yet built
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">Module coming soon</p>
      </div>
    </div>
  );
}
