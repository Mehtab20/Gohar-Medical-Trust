import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { PatientForm, type PatientFormData } from "@/components/forms/patient-form";
import { Loader2 } from "lucide-react";

export default function EditPatientPage() {
  const params = useParams<{ patientId: string }>();
  const patientId = params.patientId;
  const navigate = useNavigate();
  const patient = useQuery(api.patients.queries.getPatient, {
    patientId: patientId as any,
  });
  const updatePatient = useMutation(api.patients.mutations.updatePatient);

  if (!patientId) {
    navigate("/patients");
    return null;
  }

  if (patient === undefined) {
    return (
      <PageContainer>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="sr-only">Loading patient data...</span>
        </div>
      </PageContainer>
    );
  }

  if (patient === null) {
    return (
      <PageContainer>
        <PageHeader title="Patient Not Found" />
        <p className="text-muted-foreground">The patient you're looking for doesn't exist.</p>
      </PageContainer>
    );
  }

  const handleSubmit = async (data: PatientFormData) => {
    try {
      await updatePatient({ patientId: patientId as any, ...(data as any) });
      toast.success("Patient updated", {
        description: "The patient record has been updated successfully.",
      });
      navigate(`/patients/${patientId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update patient";
      toast.error("Update failed", {
        description: message,
      });
      throw error;
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title={`Edit Patient: ${patient.firstName} ${patient.lastName}`}
        description="Update patient demographics and information"
      />
      <PatientForm
        defaultValues={{
          firstName: patient.firstName,
          lastName: patient.lastName,
          dateOfBirth: patient.dateOfBirth,
          gender: patient.gender,
          bloodGroup: patient.bloodGroup ?? "",
          phone: patient.phone,
          email: patient.email ?? "",
          address: patient.address,
          emergencyContact: patient.emergencyContact,
          insuranceProvider: patient.insuranceProvider ?? "",
          insurancePolicyNumber: patient.insurancePolicyNumber ?? "",
          allergies: patient.allergies,
          chronicConditions: patient.chronicConditions,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/patients/${patientId}`)}
        mode="edit"
      />
    </PageContainer>
  );
}
