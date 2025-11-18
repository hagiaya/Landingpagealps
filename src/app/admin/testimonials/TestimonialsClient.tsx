'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Star, Trash2 } from "lucide-react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import { Testimonial } from "@/lib/landing-page-db";

interface TestimonialsClientProps {
  testimonials: Testimonial[];
  createTestimonialAction: (formData: FormData) => Promise<void>;
  deleteTestimonialAction: (id: string) => Promise<void>;
  editTestimonialAction: (item: any) => Promise<void>;
}

export default function TestimonialsClient({
  testimonials,
  createTestimonialAction,
  deleteTestimonialAction,
  editTestimonialAction,
}: TestimonialsClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/testimonials">
        <Card>
          <CardHeader>
            <CardTitle>Manage Testimonials</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={testimonials}
              columns={[
                { 
                  key: "avatar_url", 
                  label: "Avatar",
                  render: (item) => item.avatar_url ? (
                    <img
                      src={item.avatar_url}
                      alt={item.client_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                      {item.client_name.charAt(0)}
                    </div>
                  )
                },
                { key: "client_name", label: "Client Name" },
                { key: "client_position", label: "Position" },
                { key: "company", label: "Company" },
                { 
                  key: "content", 
                  label: "Content",
                  render: (item) => (
                    <div className="max-w-xs truncate">
                      "{item.content.substring(0, 50)}{item.content.length > 50 ? '...' : ''}"
                    </div>
                  )
                },
                { 
                  key: "rating", 
                  label: "Rating",
                  render: (item) => (
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (item.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  )
                },
                { key: "order_index", label: "Order" },
              ]}
              title="Testimonials"
              searchFields={["client_name", "client_position", "company", "content"]}
              addLabel="Add New Testimonial"
              onAdd={() => {
                alert('Add new testimonial functionality would go here');
              }}
              onEdit={editTestimonialAction}
              onDelete={(item: any) => deleteTestimonialAction(item.id)}
              emptyMessage="No testimonials found"
            />
          </CardContent>
        </Card>

        {/* Add Testimonial Form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createTestimonialAction}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      placeholder="Client name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPosition">Client Position</Label>
                    <Input
                      id="clientPosition"
                      name="clientPosition"
                      placeholder="Client position"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Testimonial Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Testimonial content"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Select
                      name="rating"
                      defaultValue="5"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Star</SelectItem>
                        <SelectItem value="2">2 Stars</SelectItem>
                        <SelectItem value="3">3 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orderIndex">Display Order</Label>
                  <Input
                    id="orderIndex"
                    name="orderIndex"
                    type="number"
                    defaultValue="0"
                  />
                </div>
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
