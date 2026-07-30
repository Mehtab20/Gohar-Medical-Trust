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
import { Loader2, Plus, Bed } from "lucide-react";
import { motion } from "framer-motion";
import { ROOM_TYPES } from "@/lib/constants";

export default function RoomsPage() {
  const rooms = useQuery(api.departments.queries.listRooms, {});
  const departments = useQuery(api.departments.queries.listActiveDepartments);
  const roomStats = useQuery(api.departments.queries.getRoomStats);
  const createRoom = useMutation(api.departments.mutations.createRoom);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    roomNumber: "",
    departmentId: "",
    roomType: "general_ward",
    floor: 1,
    capacity: 1,
    ratePerDay: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.departmentId) {
      toast.error("Please select a department");
      return;
    }
    try {
      await createRoom({
        roomNumber: form.roomNumber,
        departmentId: form.departmentId as any,
        roomType: form.roomType as any,
        floor: form.floor,
        capacity: form.capacity,
        ratePerDay: form.ratePerDay,
        amenities: [],
      });
      toast.success("Room created");
      setShowForm(false);
      setForm({ roomNumber: "", departmentId: "", roomType: "general_ward", floor: 1, capacity: 1, ratePerDay: 0 });
    } catch {
      toast.error("Failed to create room");
    }
  };

  const occupancyRate = roomStats ? Math.round((roomStats.occupiedCount / roomStats.totalCapacity) * 100) : 0;

  return (
    <PageContainer>
      <PageHeader
        title="Rooms & Beds"
        description="Manage hospital rooms, wards, and bed occupancy"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" /> {showForm ? "Cancel" : "Add Room"}
          </Button>
        }
      />

      {roomStats && (
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{roomStats.totalCapacity}</p>
              <p className="text-xs text-muted-foreground">Total Beds</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{roomStats.available}</p>
              <p className="text-xs text-muted-foreground">Available Rooms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{roomStats.occupied}</p>
              <p className="text-xs text-muted-foreground">Occupied Rooms</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{occupancyRate}%</p>
              <p className="text-xs text-muted-foreground">Occupancy Rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card>
            <CardHeader><CardTitle className="text-base">New Room / Bed</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Room Number *</Label>
                  <Input value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} required placeholder="W1-01" />
                </div>
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <select value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="">Select department</option>
                    {departments?.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Room Type</Label>
                  <select value={form.roomType} onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {ROOM_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Floor</Label>
                  <Input type="number" value={form.floor} onChange={(e) => setForm({ ...form, floor: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="space-y-2">
                  <Label>Capacity (beds)</Label>
                  <Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })} min={1} />
                </div>
                <div className="space-y-2">
                  <Label>Rate/Day (₨)</Label>
                  <Input type="number" value={form.ratePerDay} onChange={(e) => setForm({ ...form, ratePerDay: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="sm:col-span-3">
                  <Button type="submit" size="sm">Create Room</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Card>
        <CardContent className="p-0">
          {rooms === undefined ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : rooms.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Bed className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No rooms configured</h3>
              <p className="mt-2 text-sm text-muted-foreground">Add rooms and beds to manage occupancy.</p>
            </div>
          ) : (
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rooms.map((room) => (
                <Card key={room._id} className={`overflow-hidden border-l-4 ${
                  room.status === "available" ? "border-l-green-500" :
                  room.status === "occupied" ? "border-l-red-500" :
                  room.status === "maintenance" ? "border-l-amber-500" : "border-l-blue-500"
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{room.roomNumber}</p>
                        <p className="text-xs text-muted-foreground capitalize">{room.roomType.replace(/_/g, " ")}</p>
                      </div>
                      <StatusBadge status={room.status} />
                    </div>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Floor {room.floor}</span>
                      <span>·</span>
                      <span>{room.occupiedBeds}/{room.capacity} beds</span>
                    </div>
                    {room.ratePerDay > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">₨{room.ratePerDay.toLocaleString()}/day</p>
                    )}
                    <div className="mt-2 flex gap-1">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            room.occupiedBeds === 0 ? "bg-green-500" :
                            room.occupiedBeds >= room.capacity ? "bg-red-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${room.capacity > 0 ? (room.occupiedBeds / room.capacity) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}
