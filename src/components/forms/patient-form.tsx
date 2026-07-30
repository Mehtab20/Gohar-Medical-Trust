import { useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { BLOOD_GROUPS, GENDER_OPTIONS } from "@/lib/constants";

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies: string[];
  chronicConditions: string[];
}

interface PatientFormProps {
  defaultValues?: Partial<PatientFormData>;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode: "create" | "edit";
}

const defaultFormData: PatientFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "male",
  bloodGroup: "",
  phone: "",
  email: "",
  address: { street: "", city: "", state: "", zipCode: "", country: "Pakistan" },
  emergencyContact: { name: "", relationship: "", phone: "" },
  insuranceProvider: "",
  insurancePolicyNumber: "",
  allergies: [],
  chronicConditions: [],
};

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

export function PatientForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  mode,
}: PatientFormProps) {
  const [form, setForm] = useState<PatientFormData>({
    ...defaultFormData,
    ...defaultValues,
    address: { ...defaultFormData.address, ...defaultValues?.address },
    emergencyContact: {
      ...defaultFormData.emergencyContact,
      ...defaultValues?.emergencyContact,
    },
  });
  const [allergyInput, setAllergyInput] = useState("");
  const [conditionInput, setConditionInput] = useState("");

  const updateField = <K extends keyof PatientFormData>(
    key: K,
    value: PatientFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  const addItem = (field: "allergies" | "chronicConditions", input: string) => {
    const trimmed = input.trim();
    if (trimmed && !form[field].includes(trimmed)) {
      updateField(field, [...form[field], trimmed]);
    }
  };

  const removeItem = (field: "allergies" | "chronicConditions", item: string) => {
    updateField(
      field,
      form[field].filter((i) => i !== item),
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="First Name" required>
            <Input
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              required
              placeholder="Enter first name"
            />
          </Field>
          <Field label="Last Name" required>
            <Input
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              required
              placeholder="Enter last name"
            />
          </Field>
          <Field label="Date of Birth" required>
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateField("dateOfBirth", e.target.value)}
              required
            />
          </Field>
          <Field label="Gender" required>
            <select
              value={form.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              {GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Blood Group">
            <select
              value={form.bloodGroup}
              onChange={(e) => updateField("bloodGroup", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Phone" required>
            <Input
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              required
              placeholder="03XX-XXXXXXX"
              type="tel"
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="patient@example.com"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="Street" required>
            <Input
              value={form.address.street}
              onChange={(e) =>
                updateField("address", { ...form.address, street: e.target.value })
              }
              required
              placeholder="Street address"
            />
          </Field>
          <Field label="City" required>
            <Input
              value={form.address.city}
              onChange={(e) =>
                updateField("address", { ...form.address, city: e.target.value })
              }
              required
              placeholder="City"
            />
          </Field>
          <Field label="State / Province" required>
            <Input
              value={form.address.state}
              onChange={(e) =>
                updateField("address", { ...form.address, state: e.target.value })
              }
              required
              placeholder="State / Province"
            />
          </Field>
          <Field label="ZIP Code" required>
            <Input
              value={form.address.zipCode}
              onChange={(e) =>
                updateField("address", { ...form.address, zipCode: e.target.value })
              }
              required
              placeholder="ZIP code"
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Country" required>
              <Input
                value={form.address.country}
                onChange={(e) =>
                  updateField("address", { ...form.address, country: e.target.value })
                }
                required
                placeholder="Country"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Field label="Full Name" required>
            <Input
              value={form.emergencyContact.name}
              onChange={(e) =>
                updateField("emergencyContact", {
                  ...form.emergencyContact,
                  name: e.target.value,
                })
              }
              required
              placeholder="Contact name"
            />
          </Field>
          <Field label="Relationship" required>
            <Input
              value={form.emergencyContact.relationship}
              onChange={(e) =>
                updateField("emergencyContact", {
                  ...form.emergencyContact,
                  relationship: e.target.value,
                })
              }
              required
              placeholder="e.g. Spouse, Parent"
            />
          </Field>
          <Field label="Phone" required>
            <Input
              value={form.emergencyContact.phone}
              onChange={(e) =>
                updateField("emergencyContact", {
                  ...form.emergencyContact,
                  phone: e.target.value,
                })
              }
              required
              placeholder="03XX-XXXXXXX"
              type="tel"
            />
          </Field>
        </CardContent>
      </Card>

      {/* Medical & Insurance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Medical & Insurance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allergies */}
          <div className="space-y-2">
            <Label>Allergies</Label>
            <div className="flex gap-2">
              <Input
                value={allergyInput}
                onChange={(e) => setAllergyInput(e.target.value)}
                placeholder="Type an allergy and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("allergies", allergyInput);
                    setAllergyInput("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addItem("allergies", allergyInput);
                  setAllergyInput("");
                }}
              >
                Add
              </Button>
            </div>
            {form.allergies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeItem("allergies", allergy)}
                      className="ml-1 hover:text-amber-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Chronic Conditions */}
          <div className="space-y-2">
            <Label>Chronic Conditions</Label>
            <div className="flex gap-2">
              <Input
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder="Type a condition and press Add"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("chronicConditions", conditionInput);
                    setConditionInput("");
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  addItem("chronicConditions", conditionInput);
                  setConditionInput("");
                }}
              >
                Add
              </Button>
            </div>
            {form.chronicConditions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.chronicConditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800"
                  >
                    {condition}
                    <button
                      type="button"
                      onClick={() => removeItem("chronicConditions", condition)}
                      className="ml-1 hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Insurance */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Insurance Provider">
              <Input
                value={form.insuranceProvider}
                onChange={(e) => updateField("insuranceProvider", e.target.value)}
                placeholder="Insurance company name"
              />
            </Field>
            <Field label="Policy Number">
              <Input
                value={form.insurancePolicyNumber}
                onChange={(e) => updateField("insurancePolicyNumber", e.target.value)}
                placeholder="Policy number"
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Register Patient" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
