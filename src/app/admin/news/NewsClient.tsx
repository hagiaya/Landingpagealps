'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminTable from "@/components/admin/AdminTable";
import { News } from "@/lib/types";

interface NewsClientProps {
  news: (News & { publishedAtFormatted: string })[];
  newsToEdit: (News & { publishedAtFormatted: string }) | null;
  createNewsAction: (formData: FormData) => Promise<void>;
  updateNewsAction: (formData: FormData) => Promise<void>;
  deleteNewsAction: (id: string) => Promise<void>;
  cancelEditAction: () => Promise<void>;
}

export default function NewsClient({
  news,
  newsToEdit,
  createNewsAction,
  updateNewsAction,
  deleteNewsAction,
  cancelEditAction,
}: NewsClientProps) {
  return (
    <AdminAuthWrapper>
      <AdminLayout initialPage="/admin/news">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage News</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>News Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminTable
              data={news}
              columns={[
                { key: "title", label: "Title" },
                { key: "author", label: "Author" },
                { key: "category", label: "Category" },
                { 
                  key: "is_published", 
                  label: "Status",
                  render: (item) => (
                    <Badge variant={item.is_published ? "default" : "outline"}>
                      {item.is_published ? "Published" : "Draft"}
                    </Badge>
                  )
                },
                { key: "publishedAtFormatted", label: "Published Date" },
              ]}
              title="News"
              searchFields={["title", "author", "category", "content"]}
              addLabel="Add New Article"
              onDelete={(item: any) => deleteNewsAction(item.id)}
              emptyMessage="No news articles found"
            />
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{newsToEdit ? 'Edit News' : 'Add News'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={newsToEdit ? updateNewsAction : createNewsAction}>
              {newsToEdit && <input type="hidden" name="id" value={newsToEdit.id} />}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    placeholder="News title" 
                    required 
                    defaultValue={newsToEdit?.title || ''} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea 
                    id="content" 
                    name="content" 
                    placeholder="News content" 
                    required 
                    defaultValue={newsToEdit?.content || ''} 
                    rows={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea 
                    id="excerpt" 
                    name="excerpt" 
                    placeholder="Brief summary of the news (optional)" 
                    defaultValue={newsToEdit?.excerpt || ''} 
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input 
                      id="author" 
                      name="author" 
                      placeholder="Author name" 
                      required 
                      defaultValue={newsToEdit?.author || ''} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input 
                      id="category" 
                      name="category" 
                      placeholder="e.g., Company News, Industry Updates" 
                      defaultValue={newsToEdit?.category || ''} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featuredImage">Featured Image URL</Label>
                  <Input 
                    id="featuredImage" 
                    name="featuredImage" 
                    type="url" 
                    placeholder="https://example.com/image.jpg" 
                    defaultValue={newsToEdit?.featured_image || ''} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isPublished" className="flex items-center space-x-2">
                    <Input 
                      id="isPublished" 
                      name="isPublished" 
                      type="checkbox" 
                      defaultChecked={newsToEdit?.is_published ?? true} 
                      className="h-4 w-4"
                    />
                    <span>Publish this article</span>
                  </Label>
                </div>
                <Button type="submit">
                  {newsToEdit ? 'Update News' : 'Publish News'}
                </Button>
              </div>
            </form>
            
            {newsToEdit && (
              <form action={cancelEditAction} className="mt-2">
                <Button type="submit" variant="outline">Cancel Edit</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </AdminLayout>
    </AdminAuthWrapper>
  );
}
