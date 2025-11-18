'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import { Service } from "@/lib/landing-page-db";

interface ServicesClientProps {
  services: Service[];
  createServiceAction: (formData: FormData) => Promise<void>;
  deleteServiceAction: (id: string) => Promise<void>;
  editServiceAction: (item: any) => Promise<void>;
}

export default function ServicesClient({ 
  services,
  createServiceAction,
  deleteServiceAction,
  editServiceAction
}: ServicesClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/services">
        <Card>
          <CardHeader>
            <CardTitle>Manage Services</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={services}
              columns={[
                { key: "title", label: "Title" },
                { 
                  key: "description", 
                  label: "Description",
                  render: (item) => (
                    <div className="max-w-xs truncate">
                      {item.description}
                    </div>
                  )
                },
                { 
                  key: "icon_url", 
                  label: "Icon",
                  render: (item) => (
                    <span className="text-2xl">{item.icon_url}</span>
                  )
                },
                { key: "order_index", label: "Order" },
              ]}
              title="Services"
              searchFields={["title", "description"]}
              addLabel="Add New Service"
              onAdd={() => {
                // In a real implementation, we would handle adding a new service
                alert('Add new service functionality would go here');
              }}
              onEdit={editServiceAction}
              onDelete={(item: any) => deleteServiceAction(item.id)}
              emptyMessage="No services found"
            />
          </CardContent>
        </Card>

        {/* Add Service Form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createServiceAction}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="Service title" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderIndex">Display Order</Label>
                    <Input 
                      id="orderIndex" 
                      name="orderIndex" 
                      type="number" 
                      defaultValue="0" 
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Service description" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="iconUrl">Icon</Label>
                  <Input id="iconUrl" name="iconUrl" placeholder="Emoji or icon URL (e.g., 🌐)" />
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
