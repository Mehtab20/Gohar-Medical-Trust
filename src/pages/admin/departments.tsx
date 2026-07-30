import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/data/status-badge";
import { Loader2, Plus, Building2, Pencil } from "lucide-react";
import { motion } from "framer-motion";

export default function DepartmentsPage() {
  const departments = useQuery(api.departments.queries.listDepartments);
  const createDepartment = useMutation(api.departments.mutations.createDepartment);
  const updateDepartment = useMutation(api.departments.mutations.updateDepartment);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", name: "", description: "", location: "", phone: "" });

  const resetForm = () => {
    setForm({ code: "", name: "", description: "", location: "", phone: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDepartment({
          departmentId: editingId as any,
          code: form.code,
          name: form.name,
          description: form.description || undefined,
          location: form.location || undefined,
          phone: form.phone || undefined,
          headOfDepartment: undefined,
          isActive: true,
        });
        toast.success("Department updated");
      } else {
        await createDepartment({
          code: form.code,
          name: form.name,
          description: form.description || undefined,
          location: form.location || undefined,
          phone: form.phone || undefined,
          headOfDepartment: undefined,
          isActive: true,
        });
        toast.success("Department created");
      }
      resetForm();
    } catch {
      toast.error("Failed to save department");
    }
  };

  const startEdit = (dept: any) => {
    setForm({
      code: dept.code,
      name: dept.name,
      description: dept.description ?? "",
      location: dept.location ?? "",
      phone: dept.phone ?? "",
    });
    setEditingId(dept._id);
    setShowForm(true);
  };

  return (
    <PageContainer>
      <PageHeader
        title="Departments"
        description="Manage hospital departments"
        actions={
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancel" : "Add Department"}
          </Button>
        }
      />

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">{editingId ? "Edit Department" : "New Department"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label>Code *</Label>
                  <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required placeholder="e.g. GEN" />
                </div>
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="e.g. General Medicine" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Floor 1, East Wing" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Extension or line" />
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Department description" />
                </div>
                <div className="flex gap-2 sm:col-span-2 lg:col-span-3">
                  <Button type="submit" size="sm">{editingId ? "Update" : "Create"}</Button>
                  <Button type="button" variant="outline" size="sm" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardContent className="p-0">
          {departments === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : departments.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No departments yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Add your first department to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {departments.map((dept) => (
                <div key={dept._id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{dept.name}</p>
                      <p className="text-xs text-muted-foreground">Code: {dept.code} {dept.location ? `· ${dept.location}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={dept.isActive ? "active" : "inactive"} />
                    <Button variant="ghost" size="icon" onClick={() => startEdit(dept)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
