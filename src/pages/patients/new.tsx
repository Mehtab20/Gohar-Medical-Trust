import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { PatientForm, type PatientFormData } from "@/components/forms/patient-form";

export default function NewPatientPage() {
  const navigate = useNavigate();
  const createPatient = useMutation(api.patients.mutations.createPatient);

  const handleSubmit = async (data: PatientFormData) => {
    try {
      const patientId = await createPatient(data as any);
      toast.success("Patient registered successfully", {
        description: `${data.firstName} ${data.lastName} has been registered.`,
      });
      navigate(`/patients/${patientId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to register patient";
      toast.error("Registration failed", {
        description: message,
      });
      throw error;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Register New Patient"
        description="Enter patient details to create a new medical record"
      />
      <PatientForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/patients")}
        mode="create"
      />
    </PageContainer>
  );
}
