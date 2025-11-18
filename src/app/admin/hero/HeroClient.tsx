'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImagePreview } from "@/components/ui/image-preview";
import { HeroSection } from "@/lib/landing-page-db";

interface HeroClientProps {
  hero: HeroSection;
  updateHeroAction: (formData: FormData) => Promise<void>;
}

export default function HeroClient({ hero, updateHeroAction }: HeroClientProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Hero Section</h1>
        <p className="text-muted-foreground">Manage the hero section content</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={updateHeroAction}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  defaultValue={hero?.title || 'Solusi Digital untuk Bisnis Anda'} 
                  placeholder="Hero section title" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea 
                  id="subtitle" 
                  name="subtitle"
                  defaultValue={hero?.subtitle || ''} 
                  placeholder="Hero section subtitle" 
                />
              </div>
              
              <ImagePreview
                id="imageUrl"
                name="imageUrl"
                label="Image URL"
                defaultValue={hero?.image_url || ''}
                placeholder="https://example.com/image.jpg"
              />
              
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input 
                  id="buttonText" 
                  name="buttonText"
                  defaultValue={hero?.button_text || 'Hubungi Kami'} 
                  placeholder="Button text" 
                  required
                />
              </div>
              
              <Button type="submit">Update Hero Section</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
