import { adminLandingPageServer } from "@/lib/landing-page-db";
import HeroClient from "./HeroClient";
import { revalidatePath } from "next/cache";

export default async function HeroPage() {
  const hero = await adminLandingPageServer.ensureHeroSection();

  async function updateHeroAction(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const buttonText = formData.get('buttonText') as string;
    
    if (hero) {
      await adminLandingPageServer.updateHeroSection(hero.id, {
        title,
        subtitle: subtitle || null,
        image_url: imageUrl || null,
        button_text: buttonText
      });
    }
    
    revalidatePath('/admin/hero');
    revalidatePath('/'); // Also revalidate home page
  }

  return <HeroClient hero={hero} updateHeroAction={updateHeroAction} />;
}