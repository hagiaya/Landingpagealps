import { adminLandingPageServer } from "@/lib/landing-page-db";
import TestimonialsClient from "./TestimonialsClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function TestimonialsPage() {
  const testimonials = await adminLandingPageServer.getAllTestimonials();

  async function createTestimonialAction(formData: FormData) {
    'use server';
    const clientName = formData.get('clientName') as string;
    const clientPosition = formData.get('clientPosition') as string;
    const company = formData.get('company') as string;
    const content = formData.get('content') as string;
    const avatarUrl = formData.get('avatarUrl') as string;
    const rating = parseInt(formData.get('rating') as string || '5');
    const orderIndex = parseInt(formData.get('orderIndex') as string || '0');

    await adminLandingPageServer.createTestimonial({
      client_name: clientName,
      client_position: clientPosition || null,
      company: company || null,
      content,
      avatar_url: avatarUrl || null,
      rating: rating,
      order_index: orderIndex
    });

    revalidatePath('/admin/testimonials');
    redirect('/admin/testimonials');
  }

  async function deleteTestimonialAction(id: string) {
    'use server';
    await adminLandingPageServer.deleteTestimonial(id);
    revalidatePath('/admin/testimonials');
  }

  async function editTestimonialAction(item: any) {
    'use server';
    console.log('Editing testimonial:', item);
    // Example: await adminLandingPageServer.updateTestimonial(item.id, { ... });
    // revalidatePath('/admin/testimonials');
  }

  return (
    <TestimonialsClient
      testimonials={testimonials}
      createTestimonialAction={createTestimonialAction}
      deleteTestimonialAction={deleteTestimonialAction}
      editTestimonialAction={editTestimonialAction}
    />
  );
}