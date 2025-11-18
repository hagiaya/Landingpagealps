'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import { Partner } from "@/lib/landing-page-db";

interface PartnersClientProps {
  partners: Partner[];
  createPartnerAction: (formData: FormData) => Promise<void>;
  deletePartnerAction: (id: string) => Promise<void>;
  editPartnerAction: (item: any) => Promise<void>;
}

export default function PartnersClient({
  partners,
  createPartnerAction,
  deletePartnerAction,
  editPartnerAction,
}: PartnersClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/partners">
        <Card>
          <CardHeader>
            <CardTitle>Manage Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={partners}
              columns={[
                { 
                  key: "logo_url", 
                  label: "Logo",
                  render: (item) => item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.name}
                      className="h-10 w-auto object-contain"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Img</span>
                    </div>
                  )
                },
                { key: "name", label: "Name" },
                { 
                  key: "website_url", 
                  label: "Website",
                  render: (item) => item.website_url ? (
                    <a
                      href={item.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {item.website_url}
                    </a>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )
                },
                { key: "order_index", label: "Order" },
              ]}
              title="Partners"
              searchFields={["name", "website_url"]}
              addLabel="Add New Partner"
              onAdd={() => {
                alert('Add new partner functionality would go here');
              }}
              onEdit={editPartnerAction}
              onDelete={(item: any) => deletePartnerAction(item.id)}
              emptyMessage="No partners found"
            />
          </CardContent>
        </Card>

        {/* Add Partner Form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Partner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createPartnerAction}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Partner name"
                      required
                    />
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
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    name="logoUrl"
                    type="url"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input
                    id="websiteUrl"
                    name="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                  />
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
