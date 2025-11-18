'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { HeroSection as HeroSectionType } from '@/lib/landing-page-db';
import SplineRobot from '@/components/SplineRobot';
import AIChat from '@/components/landing-page/AIChat';

interface HeroSectionProps {
  data: HeroSectionType;
}

export default function HeroSection({ data }: HeroSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null); // Track the lead ID
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    service_type: 'website' as 'website' | 'aplikasi' | 'uiux',
    phone_number: '',
    project_description: '',
    features: '',
    budget: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields before submission
    if (!formData.name || !formData.address || !formData.service_type) {
      alert('Nama, alamat, dan jenis layanan wajib diisi.');
      return;
    }
    
    try {
      // Try to submit to our database (optional - continue even if this fails)
      const leadData = {
        name: formData.name,
        address: formData.address,
        service_type: formData.service_type,
        phone_number: formData.phone_number,
        project_description: formData.project_description
      };
      
      // Submit to our database (mandatory)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // Handle case where response is not JSON or is empty
          console.error('Failed to parse error response:', e);
          errorData = { error: 'Server error with empty response', message: 'Response status: ' + response.status };
        }
        
        console.error('Database submission failed:', errorData);
        alert('Terjadi kesalahan saat mengirim formulir. Silakan coba lagi.');
        return;
      }
      
      // Send WhatsApp message notification to business
      try {
        await fetch('/api/send-whatsapp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            service_type: formData.service_type,
            phone_number: formData.phone_number,
            project_description: formData.project_description,
            features: formData.features,
            budget: formData.budget,
            businessNumber: '+6283117927964'
          }),
        });
      } catch (whatsappError) {
        console.error('WhatsApp submission error:', whatsappError);
        // Don't fail the whole process if WhatsApp fails
      }
      
      // Get the lead ID from response
      const responseData = await response.json();
      const newLeadId = responseData.lead?.id || null;
      
      // Store the lead ID and show the AI chat after successful database submission
      if (newLeadId) {
        setLeadId(newLeadId);
      }
      setIsOpen(false);
      setShowAIChat(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <section id="hero" className="relative py-12 md:py-16 lg:py-24 overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 grid-pattern opacity-50"></div>
      
      {/* Main blurred gradient background with purple emphasis */}
      <div 
        className="absolute inset-0 -z-20"
        style={{
          background: 'linear-gradient(135deg, rgba(123, 52, 231, 0.25) 0%, rgba(106, 33, 206, 0.35) 40%, rgba(63, 17, 121, 0.25) 100%)',
          filter: 'blur(80px)',
          opacity: 0.8
        }}
      />
      {/* Additional background layer */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(123, 52, 231, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(106, 33, 206, 0.2) 0%, transparent 50%)',
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          filter: 'blur(50px)',
          opacity: 0.6
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
          <div className="md:w-1/2 text-center md:text-left w-full">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 dark:from-purple-400 dark:via-indigo-300 dark:to-purple-200 bg-clip-text text-transparent"
            >
              {data.title}
            </h1>
            <p 
              className="text-base sm:text-lg md:text-xl text-purple-700 dark:text-purple-200 mb-6 md:mb-8"
            >
              {data.subtitle}
            </p>
            <div className="flex justify-center md:justify-start">
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-base sm:text-lg px-6 py-5 md:px-8 md:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20">
                    {data.button_text}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Hubungi Kami</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Alamat</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="service_type">Layanan</Label>
                      <Select 
                        value={formData.service_type} 
                        onValueChange={(value) => setFormData({...formData, service_type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="aplikasi">Aplikasi</SelectItem>
                          <SelectItem value="uiux">UI/UX</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone_number">Nomor WhatsApp</Label>
                      <Input
                        id="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                        placeholder="+62..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project_description">Deskripsi Proyek</Label>
                      <Textarea
                        id="project_description"
                        value={formData.project_description}
                        onChange={(e) => setFormData({...formData, project_description: e.target.value})}
                        placeholder="Jelaskan proyek yang ingin Anda buat..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features">Fitur-fitur yang Diinginkan</Label>
                      <Textarea
                        id="features"
                        value={formData.features}
                        onChange={(e) => setFormData({...formData, features: e.target.value})}
                        placeholder="Sebutkan fitur-fitur yang ingin Anda tambahkan ke proyek Anda..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Kesediaan Anggaran</Label>
                      <Select 
                        value={formData.budget} 
                        onValueChange={(value) => setFormData({...formData, budget: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kisaran anggaran Anda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="less-than-5jt">&lt; Rp 5.000.000</SelectItem>
                          <SelectItem value="5jt-10jt">Rp 5.000.000 - Rp 10.000.000</SelectItem>
                          <SelectItem value="10jt-25jt">Rp 10.000.000 - Rp 25.000.000</SelectItem>
                          <SelectItem value="25jt-50jt">Rp 25.000.000 - Rp 50.000.000</SelectItem>
                          <SelectItem value="more-than-50jt">&gt; Rp 50.000.000</SelectItem>
                          <SelectItem value="not-sure">Belum pasti</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">Kirim</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="md:w-1/2 w-full flex justify-center">
            <SplineRobot className="w-full h-80 md:h-96 lg:h-[500px]" />
          </div>
        </div>
      </div>
      {showAIChat && (
        <AIChat 
          formData={{ 
            name: formData.name,
            service_type: formData.service_type,
            project_description: formData.project_description,
            features: formData.features,
            budget: formData.budget
          }} 
          onClose={() => setShowAIChat(false)} 
        />
      )}
    </section>
  );
}