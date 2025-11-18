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
import { PortfolioItem } from "@/lib/landing-page-db";

interface PortfolioClientProps {
  portfolioItems: PortfolioItem[];
  createPortfolioItemAction: (formData: FormData) => Promise<void>;
  deletePortfolioItemAction: (id: string) => Promise<void>;
  editPortfolioItemAction: (item: any) => Promise<void>;
}

export default function PortfolioClient({
  portfolioItems,
  createPortfolioItemAction,
  deletePortfolioItemAction,
  editPortfolioItemAction,
}: PortfolioClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/portfolio">
        <Card>
          <CardHeader>
            <CardTitle>Manage Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={portfolioItems}
              columns={[
                { 
                  key: "image_url", 
                  label: "Image",
                  render: (item) => item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No Img</span>
                    </div>
                  )
                },
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
                { key: "category", label: "Category" },
                { key: "order_index", label: "Order" },
              ]}
              title="Portfolio Items"
              searchFields={["title", "description", "category"]}
              addLabel="Add New Item"
              onAdd={() => {
                alert('Add new portfolio item functionality would go here');
              }}
              onEdit={editPortfolioItemAction}
              onDelete={(item: any) => deletePortfolioItemAction(item.id)}
              emptyMessage="No portfolio items found"
            />
          </CardContent>
        </Card>

        {/* Add Portfolio Item Form */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Add New Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={createPortfolioItemAction}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Project title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="e.g., website, app, uiux"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Project description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectUrl">Project URL</Label>
                    <Input
                      id="projectUrl"
                      name="projectUrl"
                      type="url"
                      placeholder="https://example.com/project"
                    />
                  </div>
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
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Portfolio Item
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
