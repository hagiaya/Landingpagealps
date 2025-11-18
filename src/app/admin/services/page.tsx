import { adminLandingPageServer } from "@/lib/landing-page-db";
import ServicesClient from "./ServicesClient";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const services = await adminLandingPageServer.getAllServices();

  async function createServiceAction(formData: FormData) {
    'use server';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const iconUrl = formData.get('iconUrl') as string;
    const orderIndex = parseInt(formData.get('orderIndex') as string || '0');

    await adminLandingPageServer.createService({
      title,
      description,
      icon_url: iconUrl,
      order_index: orderIndex
    });

    revalidatePath('/admin/services');
    redirect('/admin/services');
  }

  async function deleteServiceAction(id: string) {
    'use server';
    await adminLandingPageServer.deleteService(id);
    revalidatePath('/admin/services');
  }

  async function editServiceAction(item: any) {
    'use server';
    // In a real implementation, you would update the item
    console.log('Editing service:', item);
    // Example: await adminLandingPageServer.updateService(item.id, { ... });
    // revalidatePath('/admin/services');
  }

  return (
    <ServicesClient 
      services={services}
      createServiceAction={createServiceAction}
      deleteServiceAction={deleteServiceAction}
      editServiceAction={editServiceAction}
    />
  );
}