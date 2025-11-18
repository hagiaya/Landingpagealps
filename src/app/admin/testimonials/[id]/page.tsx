import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { adminLandingPageServer } from "@/lib/landing-page-db";
import { notFound, redirect } from 'next/navigation';
import { Save } from "lucide-react";

interface EditTestimonialPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Fetch all testimonials and find the specific one
  const allTestimonials = await adminLandingPageServer.getAllTestimonials();
  const testimonial = allTestimonials.find(t => t.id === id);
  
  if (!testimonial) {
    notFound(); // Show 404 if testimonial doesn't exist
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Testimonial</h1>
        <Button 
          variant="outline"
          asChild
        >
          <a href="/admin/testimonials">Cancel</a>
        </Button>
      </div>

      {/* Edit Testimonial Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Testimonial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form action={async (formData: FormData) => {
            'use server';
            
            const clientName = formData.get('clientName') as string;
            const clientPosition = formData.get('clientPosition') as string;
            const company = formData.get('company') as string;
            const content = formData.get('content') as string;
            const avatarUrl = formData.get('avatarUrl') as string;
            const rating = parseInt(formData.get('rating') as string || '5');
            const orderIndex = parseInt(formData.get('orderIndex') as string || '0');
            
            // Update the testimonial
            await adminLandingPageServer.updateTestimonial(id, {
              client_name: clientName,
              client_position: clientPosition || null,
              company: company || null,
              content,
              avatar_url: avatarUrl || null,
              rating: rating,
              order_index: orderIndex
            });
            
            // Redirect back to the testimonials page after update
            redirect('/admin/testimonials');
          }}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input 
                    id="clientName" 
                    name="clientName" 
                    placeholder="Client name" 
                    required 
                    defaultValue={testimonial.client_name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientPosition">Client Position</Label>
                  <Input 
                    id="clientPosition" 
                    name="clientPosition" 
                    placeholder="Client position" 
                    defaultValue={testimonial.client_position || ''}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input 
                  id="company" 
                  name="company" 
                  placeholder="Company name" 
                  defaultValue={testimonial.company || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content</Label>
                <Textarea 
                  id="content" 
                  name="content" 
                  placeholder="Testimonial content" 
                  required 
                  defaultValue={testimonial.content}
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
                    defaultValue={testimonial.avatar_url || ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Select 
                    name="rating" 
                    defaultValue={testimonial.rating?.toString() || '5'}
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
                  defaultValue={testimonial.order_index} 
                />
              </div>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Update Testimonial
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}