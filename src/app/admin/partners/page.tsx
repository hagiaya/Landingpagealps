import { adminLandingPageServer } from "@/lib/landing-page-db";
import PartnersClient from "./PartnersClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function PartnersPage() {
  const partners = await adminLandingPageServer.getAllPartners();

  async function createPartnerAction(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const logoUrl = formData.get('logoUrl') as string;
    const websiteUrl = formData.get('websiteUrl') as string;
    const orderIndex = parseInt(formData.get('orderIndex') as string || '0');

    await adminLandingPageServer.createPartner({
      name,
      logo_url: logoUrl,
      website_url: websiteUrl,
      order_index: orderIndex
    });

    revalidatePath('/admin/partners');
    redirect('/admin/partners');
  }

  async function deletePartnerAction(id: string) {
    'use server';
    await adminLandingPageServer.deletePartner(id);
    revalidatePath('/admin/partners');
  }

  async function editPartnerAction(item: any) {
    'use server';
    console.log('Editing partner:', item);
    // Example: await adminLandingPageServer.updatePartner(item.id, { ... });
    // revalidatePath('/admin/partners');
  }

  return (
    <PartnersClient
      partners={partners}
      createPartnerAction={createPartnerAction}
      deletePartnerAction={deletePartnerAction}
      editPartnerAction={editPartnerAction}
    />
  );
}