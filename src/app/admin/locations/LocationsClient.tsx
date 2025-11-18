'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import { ClientLocation } from "@/lib/landing-page-db";

interface LocationsClientProps {
  locations: ClientLocation[];
  createLocationAction: (formData: FormData) => Promise<void>;
  deleteLocationAction: (id: string) => Promise<void>;
  editLocationAction: (item: any) => Promise<void>;
}

export default function LocationsClient({
  locations,
  createLocationAction,
  deleteLocationAction,
  editLocationAction,
}: LocationsClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/locations">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Client Locations</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={locations}
              columns={[
                { key: "client_name", label: "Client Name" },
                { key: "address", label: "Address" },
                { key: "latitude", label: "Latitude" },
                { key: "longitude", label: "Longitude" },
              ]}
              title="Client Locations"
              searchFields={["client_name", "address"]}
              addLabel="Add New Location"
              onEdit={editLocationAction}
              onDelete={(item: any) => deleteLocationAction(item.id)}
              emptyMessage="No locations found"
            />
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createLocationAction}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input id="clientName" name="clientName" placeholder="Client name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" placeholder="Full address" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationDescription">Location Description</Label>
                  <Input id="locationDescription" name="locationDescription" placeholder="Additional location details" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input id="latitude" name="latitude" type="number" step="any" placeholder="e.g., -6.200000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input id="longitude" name="longitude" type="number" step="any" placeholder="e.g., 106.816666" />
                  </div>
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
